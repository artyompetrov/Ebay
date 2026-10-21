# Design

## Context

See proposal.md - Why. Current state that shapes the approach:

- `Server.Platform/PlatformExtensions.AddPlatform` sets up console logging plus OpenTelemetry log export (`AddOtlpExporter()`, configured by the `OTEL_EXPORTER_OTLP_ENDPOINT`/`OTEL_EXPORTER_OTLP_PROTOCOL`/`OTEL_SERVICE_NAME` variables already set for `ebay_helper` in `deploy/docker-compose.yaml`). There is no tracer provider, so the `ActivitySource`s in `ChipfindAdapter`, `QrzAdapter` and `SaleAdvertisementsTracing` have no listener in production. Their names all start with `Server.`; the adapters' `WellKnown` classes holding them are `internal`.
- `Server.Platform` references no project of ours (architecture tests keep it below adapters and the application); its package references are allowed for the root assembly through `GetPlatformReferences()` in `ArchitectureTest`.
- `Server.Adapters.MassTransit` uses the PostgreSQL transport, the EF bus outbox and the SQL message scheduler, which poll PostgreSQL continuously through Npgsql.
- `ebay_otelcollector` (`otel/opentelemetry-collector-contrib:0.117.0`) receives OTLP on 4317/4318 and has only a `logs` pipeline to `ebay_loki`.
- `ebay_grafana` is 10.4.2 behind nginx at `/grafana/`, with one provisioned datasource, Loki, whose live UID is `P8E80F9AEF21F6940` (generated, not pinned in `deploy/config/grafana/provisioning/datasources/loki.yaml`; the Loki dashboard references it). Log records already carry `trace_id`/`span_id` as structured metadata.
- The `grafana` MCP server (`mcp-grafana` via `uvx`, `.mcp.json`) logs in as the Viewer user `mcp`. Its Tempo tools (`search_tempo_traces`, `get_tempo_trace`, `list_tempo_attribute_*`, `query_tempo_metrics`) work through a Grafana Tempo datasource and need only `datasources:read`/`datasources:query`, which a Viewer has in Grafana OSS.
- Integration tests host the real app through `WebApplicationFactory<Server.Program>` (`Tests.Integration/IntegrationTestsSetupFixture.cs`) against a real PostgreSQL and run one test at a time (`Tests.Integration/AssemblyInfo.cs`: `Parallelizable(None)`, `LevelOfParallelism(1)`), but hosted services run concurrently with tests.

## Goals / Non-Goals

**Goals:**
- One tracing setup in `Server.Platform`, configured by the same `OTEL_*` variables as logs, so local runs without a collector behave as today (exporter failures are not fatal).
- Trace and log of the same request are linked, so the agent can move from an error log to its trace and back.
- Bounded resource use on the single production server.

**Non-Goals:**
- Metrics (Prometheus/OTLP metrics) and the Tempo metrics-generator (service graphs, span metrics).
- Tail sampling or any sampling; volume is low enough to keep everything once background polling is dropped (D3).
- Client-side tracing (Blazor WebAssembly, Chrome extension) and accepting OTLP from outside the server.
- New Grafana dashboards for traces; Grafana Explore and the MCP tools are enough.
- Removing query strings from logs (see Risks).

## Decisions

**D1. Tracing is configured entirely in `Server.Platform`, subscribing our sources by prefix.**
`AddPlatform` gains `builder.Services.AddOpenTelemetry().WithTracing(...)` with a parent-based sampler that records roots and every remote parent (sampled or not) but drops children of local spans that were not recorded (D2), the instrumentations of D2, the processors of D3, `AddSource("Server.*")` and `AddOtlpExporter()`. The service name comes from `OTEL_SERVICE_NAME` through the default resource detector, so no explicit resource code is needed. The wildcard covers the three existing sources and every future one, without `Server.Platform` or `Program.cs` referencing the adapters' internal `WellKnown` constants; `AddPlatform` keeps its signature and `Program.cs` does not change. The naming rule (span source names start with `Server.`) is documented in `src/Ebay/AGENTS.md`.
*Alternatives:* passing source names from `Program.cs` (rejected: the adapter constants are `internal`, and every new source would need wiring); each adapter registering its own source through `ConfigureOpenTelemetryTracerProvider` (rejected: spreads OpenTelemetry references across adapters). `UseOtlpExporter()` for logs and traces together was considered and rejected: it cannot be mixed with per-signal `AddOtlpExporter()` and gives no control over processor order relative to the exporter (D3).

**D2. Instrumentation.**
- Incoming HTTP: `OpenTelemetry.Instrumentation.AspNetCore`, with a `Filter` that drops `/api/health` (`PlatformExtensions.HealthEndpointPath`), paths starting with `/_framework/`, `/_content/` or `/.well-known/`, and paths ending with `.js`, `.css`, `.wasm`, `.map`, `.ico`, `.png`, `.jpg`, `.svg`, `.woff`, `.woff2`. The filter clears the request span's `Recorded` flag, and the sampler (`ParentBasedSampler` with `AlwaysOn` for roots and remote parents, `AlwaysOff` for a local parent that is not recorded) drops its children too, so a filtered request leaves no spans at all. A plain `AlwaysOnSampler` was tried first and exported IdentityServer's database spans under the filtered `/.well-known/openid-configuration` request.
- Outgoing HTTP: `OpenTelemetry.Instrumentation.Http` (covers every `HttpClient`, including the IdentityServer back-channel).
- Database: Npgsql's own `ActivitySource` through `Npgsql.OpenTelemetry` 10.0.x (`AddNpgsql()`), matching the resolved Npgsql 10.0.0. It records the statement text and never the parameter values.
- MassTransit: `AddSource("MassTransit")` so that message consume/send spans exist and database commands inside consumers keep a parent instead of being dropped by D3.
*Alternative for the database:* `OpenTelemetry.Instrumentation.EntityFrameworkCore`. Rejected: still pre-release, and it duplicates what Npgsql emits natively. Npgsql's per-data-source tracing filter was rejected for dropping polling: MassTransit opens its own connections that our data source options do not reach.

**D3. Processors, registered before the exporter.**
OpenTelemetry .NET calls processors' `OnEnd` in registration order, and the OTLP exporter is itself a batch processor, so both processors below are added before `AddOtlpExporter()`; otherwise the exporter could see a span before it is cleaned.
- Orphan database span filter: on end, an activity from the `Npgsql` source with no parent (`ParentSpanId == default`) has its `Recorded` flag cleared, so no exporter sends it. This removes the per-poll root traces from MassTransit and other background polling.
- Query scrubber: on end, deletes the `url.query` attribute and strips the `?...` part from `url.full`. Instrumentation already redacts query *values* by default (since 1.8.1, CVE-2024-32028), but keys and the query itself can still leak names and structure, so the processor removes the whole query.
Neither instrumentation records headers unless configured to, and none will be configured.
Both processors are `internal` classes in `Server.Platform`, exposed to `Tests.Unit` with `InternalsVisibleTo` for unit tests.

**D4. Storage: Grafana Tempo, single binary.**
New `ebay_tempo` service pinned to `grafana/tempo:2.10.8` (the newest 2.x release at least two weeks old; Tempo 3.0 changed the deployment topology). Config in `deploy/config/tempo/tempo.yaml`:
- OTLP gRPC receiver on `0.0.0.0:4317` (explicit bind; recent versions default to localhost), only reachable on `internal_network`, no published ports. HTTP API on 3200.
- Local block storage and WAL under `/var/tempo`, bind-mounted from `./mount/tempo` like Loki (`/deploy/mount/` is git-ignored and survives `git clean -fd` in `deploy-on-server.sh`).
- `compactor.compaction.block_retention: 168h` (7 days).
- Metrics generator disabled; `usage_report.reporting_enabled: false`.
- `mem_limit: 512m` in compose with `GOMEMLIMIT` a bit lower so the Go runtime collects before the container hits the limit.
- The image is distroless (no shell, `wget` or `curl`) and 2.10.8 has no `--health` flag, so there is no healthcheck and dependents use `service_started`.
- The image runs as uid 10001; a one-shot `ebay_tempo_init` (busybox, `chown -R 10001:10001`, `network_mode: none`), the same pattern as `ebay_helper_init`, makes the mount writable before Tempo starts.
*Alternative:* Jaeger. Rejected: the MCP tools and Grafana already speak Tempo, and Tempo's local storage needs no extra database.

**D5. Collector traces pipeline.**
`traces: receivers [otlp] -> processors [batch] -> exporters [otlp/tempo]`, with `otlp/tempo` pointing at `ebay_tempo:4317` (`tls.insecure: true`, internal network). The app's `http/protobuf` OTLP endpoint already routes `/v1/traces`. The `debug` exporter is not added to traces, because detailed verbosity for every span would flood the collector's stdout.

**D6. Grafana datasources and log/trace links.**
- Pin the existing Loki datasource's `uid: P8E80F9AEF21F6940` in `loki.yaml`, so the dashboard and the new links keep working on fresh installs.
- On Loki, a derived field: `name: TraceID`, `matcherType: label`, `matcherRegex: trace_id`, `datasourceUid: tempo`, `url: '${__value.raw}'` (verified: the Grafana 10.4.2 frontend handles `matcherType === 'label'`).
- New `tempo.yaml`: `uid: tempo`, URL `http://ebay_tempo:3200`, `tracesToLogsV2` with `datasourceUid: P8E80F9AEF21F6940`, `tags: [{ key: service.name, value: service_name }]` and `filterByTraceID: true` (or an equivalent `customQuery` with `| trace_id="${__span.traceId}"`).

**D7. Tests.**
Integration tests in `Tests.Integration` (`[TestOf(typeof(PlatformExtensions))]`, `[OpenSpecScenario("observability-tracing", ...)]`) add a small test exporter (`Tests.Integration/SpanCollector`, a thread-safe queue; the `OpenTelemetry.Exporter.InMemory` package was not needed) to the host's tracer provider through `ConfigureOpenTelemetryTracerProvider` in the factory's `ConfigureServices`. Tests run one at a time, but hosted services and MassTransit emit spans concurrently, so each test sends a `traceparent` header with a trace id it generates and asserts only on exported spans with that trace id (scenarios about dropped spans assert that nothing with that trace id, path or marker was exported). The outgoing-HTTP scenario resolves `IHttpClientFactory` from the host and calls a real socket listener (Kestrel or `HttpListener` on `127.0.0.1` with a free port) inside a test-started `Activity`: a `TestServer` handler bypasses the HTTP handler pipeline, so no client span would be produced. The orphan-database-span scenario runs a command on a fresh Npgsql connection from the host's data source with no current `Activity`. The application-sources scenario starts an activity on each source using its literal name. Unit tests for the D3 processors live in `Tests.Unit`, one test class per processor.

## Risks / Trade-offs

- [Grafana 10.4.2 derived fields may not match structured metadata] -> check in Grafana Explore after deploy. If it doesn't work, keep only the Tempo-to-Loki direction (always works) and leave a TODO in the provisioning file; the agent can still query Loki by `| trace_id="..."` directly.
- [Server memory is unknown; Tempo is one more resident process] -> hard `mem_limit` plus `GOMEMLIMIT`; Tempo is OOM-killed and restarted instead of starving the app. Trace loss during a restart is acceptable.
- [Disk growth from keeping every trace] -> 7-day retention bounds it, and D3 removes the polling traces. Task 1.7 measures the idle span rate locally; watch `deploy/mount/tempo` size after the first week.
- [Dropping orphan database spans hides work done by code paths without a span] -> accepted; such paths can get their own application span later. The spec makes this explicit.
- [Changing `OTEL_*`-driven export could break local runs without a collector] -> the OTLP exporter only logs export failures; integration tests add their own exporter.
- [Viewer role and datasource permissions] -> Grafana OSS gives Viewers query access to all datasources; verify with `search_tempo_traces` as the `mcp` user after deploy.
- [Query strings are already in Loki logs (the ASP.NET Core `Request finished` record carries `QueryString`), and trace-to-logs makes them one click away from a query-free trace] -> existing gap, out of scope; leave a TODO next to the logging setup in `PlatformExtensions`.
- [Span tags such as the monitoring pipeline's seller key now leave the process and are kept 7 days in Tempo] -> acceptable: the data is already stored in the database and logs; noted in the proposal.

## Migration Plan

1. Merge; CI deploys with the existing `deploy-on-server.sh` (compose `down`/`up`), which also starts `ebay_tempo_init`, `ebay_tempo` and the updated collector and Grafana.
2. Verify: open a page in the app, then from an agent session run `search_tempo_traces` for `service.name = "ebay_helper"` and `get_tempo_trace` on a result; check the Loki-to-trace and trace-to-logs links in Grafana Explore.
3. Rollback: revert the commit and redeploy. Without the tracer provider the app goes back to exporting logs only; `deploy/mount/tempo` can be deleted by hand.
