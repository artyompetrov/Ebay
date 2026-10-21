# Design

## Context

See proposal.md - Why. Current state that shapes the approach:

- `Server.Platform/PlatformExtensions.AddPlatform` sets up console logging plus OpenTelemetry log export (`AddOtlpExporter()`, configured by the `OTEL_EXPORTER_OTLP_ENDPOINT`/`OTEL_EXPORTER_OTLP_PROTOCOL`/`OTEL_SERVICE_NAME` variables already set for `ebay_helper` in `deploy/docker-compose.yaml`). There is no tracer provider, so the `ActivitySource`s in `ChipfindAdapter`, `QrzAdapter` and `SaleAdvertisementsTracing` have no listener in production. `Server.Application/WellKnown.cs` already anticipates subscribing them with `AddSource`.
- `ebay_otelcollector` (`otel/opentelemetry-collector-contrib:0.117.0`) receives OTLP on 4317/4318 and has only a `logs` pipeline to `ebay_loki`.
- `ebay_grafana` is 10.4.2 behind nginx at `/grafana/`, with one provisioned datasource, Loki, whose live UID is `P8E80F9AEF21F6940` (generated, not pinned in `deploy/config/grafana/provisioning/datasources/loki.yaml`; the Loki dashboard references it).
- The `grafana` MCP server (`mcp-grafana` via `uvx`, `.mcp.json`) logs in as the Viewer user `mcp`. Its Tempo tools (`search_tempo_traces`, `get_tempo_trace`, `list_tempo_attribute_*`, `query_tempo_metrics`) work through a Grafana Tempo datasource and need only `datasources:read`/`datasources:query`, which a Viewer has in Grafana OSS.
- Integration tests host the real app through `WebApplicationFactory<Server.Program>` (`Tests.Integration/IntegrationTestsSetupFixture.cs`) against a real PostgreSQL, so the tracing setup can be exercised end to end with an in-memory exporter.

## Goals / Non-Goals

**Goals:**
- One tracing setup in `Server.Platform`, configured by the same `OTEL_*` variables as logs, so local runs without a collector behave as today (exporter failures are not fatal).
- Trace and log of the same request are linked, so the agent can move from an error log to its trace and back.
- Bounded resource use on the single production server.

**Non-Goals:**
- Metrics (Prometheus/OTLP metrics) and the Tempo metrics-generator (service graphs, span metrics).
- Tail sampling or any sampling; volume is low enough to keep everything.
- Client-side tracing (Blazor WebAssembly, Chrome extension) and accepting OTLP from outside the server.
- New Grafana dashboards for traces; Grafana Explore and the MCP tools are enough.

## Decisions

**D1. Tracing is configured in `Server.Platform` next to logging.**
`AddPlatform` gains `builder.Services.AddOpenTelemetry().WithTracing(...)` with the service resource taken from `OTEL_SERVICE_NAME`, `AlwaysOnSampler`, the instrumentations below, `AddSource(...)` for the three application sources, and `AddOtlpExporter()`. Source names are taken from the adapters' and application's `WellKnown` constants, which `Server.Platform` must not reference (architecture rules keep the platform layer below adapters). So `AddPlatform` exposes a way for the composition root (`Server/Program.cs`) to pass extra source names; `Program.cs` passes the three constants.
*Alternative:* each adapter registers its own source through `ConfigureOpenTelemetryTracerProvider`. Rejected for now: it spreads OpenTelemetry package references across adapter projects; it can be revisited when more adapters get spans.

**D2. Instrumentation packages.**
- Incoming HTTP: `OpenTelemetry.Instrumentation.AspNetCore`, with a `Filter` that drops `/api/health` (`PlatformExtensions.HealthEndpointPath`), paths starting with `/_framework/` or `/.well-known/`, and paths ending with `.js`, `.css`, `.wasm`.
- Outgoing HTTP: `OpenTelemetry.Instrumentation.Http` (covers every `HttpClient`, including the IdentityServer back-channel).
- Database: Npgsql's own `ActivitySource` through `Npgsql.OpenTelemetry` (`AddNpgsql()`), version matching the Npgsql pulled in by `Npgsql.EntityFrameworkCore.PostgreSQL`. It records the statement text and never the parameter values.
*Alternative for the database:* `OpenTelemetry.Instrumentation.EntityFrameworkCore`. Rejected: still pre-release, and it duplicates what Npgsql emits natively.

**D3. Scrubbing query strings and headers.**
Neither instrumentation records headers unless configured to, and none will be configured. URL query strings are removed by a small span processor in `Server.Platform` that, on span end, deletes the `url.query` attribute and strips the `?...` part from `url.full`. A processor rather than per-instrumentation enrich callbacks gives one place that also covers future instrumentations.

**D4. Storage: Grafana Tempo, single binary.**
New `ebay_tempo` service (`grafana/tempo`, a pinned 2.x release at least two weeks old), config in `deploy/config/tempo/tempo.yaml`:
- OTLP gRPC receiver on `0.0.0.0:4317`, only reachable on `internal_network`, no published ports.
- Local block storage and WAL under `/var/tempo`, bind-mounted from `./mount/tempo` like Loki.
- `compactor.compaction.block_retention: 168h` (7 days).
- Metrics generator disabled; `mem_limit: 512m` in compose with `GOMEMLIMIT` set a bit lower so the Go runtime collects before the container hits the limit.
- The Tempo image runs as uid 10001; a one-shot `ebay_tempo_init` (busybox, `chown -R 10001:10001`, `network_mode: none`), the same pattern as `ebay_helper_init`, makes the mount writable before Tempo starts.
*Alternative:* Jaeger. Rejected: the MCP tools and Grafana already speak Tempo, and Tempo's local storage needs no extra database.

**D5. Collector traces pipeline.**
`traces: receivers [otlp] -> processors [batch] -> exporters [otlp/tempo]`, with `otlp/tempo` pointing at `ebay_tempo:4317` (`tls.insecure: true`, internal network). The `debug` exporter is not added to traces, because detailed verbosity for every span would flood the collector's stdout.

**D6. Grafana datasources and log/trace links.**
- Pin the existing Loki datasource's `uid: P8E80F9AEF21F6940` in `loki.yaml`, so the dashboard and the new links keep working on fresh installs.
- New `tempo.yaml`: `uid: tempo`, URL `http://ebay_tempo:3200`, `tracesToLogsV2` to the Loki UID filtered by `service_name` and by trace id (`| trace_id="${__span.traceId}"`).
- On Loki, a derived field `TraceID` with `matcherType: label` on the `trace_id` structured-metadata field, linking to datasource `tempo`. OpenTelemetry logs written inside an active span already carry `trace_id`/`span_id`, and Loki stores them as structured metadata (`allow_structured_metadata: true`).

**D7. Tests.**
Integration tests in `Tests.Integration` (one test class per scenario group, `[TestOf(typeof(PlatformExtensions))]`, `[OpenSpecScenario("observability-tracing", ...)]`) add an OpenTelemetry in-memory exporter (`OpenTelemetry.Exporter.InMemory`) to the host's tracer provider through `ConfigureOpenTelemetryTracerProvider` in the factory's `ConfigureServices`. Because the factory and its exported list are shared across parallel tests, each test finds its own spans by a unique marker (a trace started by the test, or a unique route/query value) and never asserts on the total count of spans. The outgoing-HTTP scenario resolves `IHttpClientFactory` from the host and calls a loopback stub inside a test-started `Activity`. The application-sources scenario starts an activity on each source name from `WellKnown`.

## Risks / Trade-offs

- [Grafana 10.4.2 derived fields may not support matching structured metadata (`matcherType: label`)] -> check in Grafana Explore after deploy. If it doesn't work, keep only the Tempo-to-Loki direction (always works) and leave a `// TODO`-style note in the provisioning file; the agent can still query Loki by `| trace_id="..."` directly.
- [Server memory is unknown; Tempo is one more resident process] -> hard `mem_limit` plus `GOMEMLIMIT`; Tempo is OOM-killed and restarted instead of starving the app. Trace loss during a restart is acceptable.
- [Disk growth from keeping every trace] -> 7-day retention bounds it; traffic is low. Watch `deploy/mount/tempo` size after the first week.
- [Npgsql span noise from background jobs polling the database] -> accepted, since those spans are what we want to see for slow jobs. If it gets too noisy, filter in `AddNpgsql` options later.
- [Changing `OTEL_*`-driven export could break local runs without a collector] -> the OTLP exporter only logs export failures; integration tests replace the exporter with the in-memory one.
- [Viewer role and datasource permissions] -> Grafana OSS gives Viewers query access to all datasources; verify with `search_tempo_traces` as the `mcp` user after deploy.

## Migration Plan

1. Merge; CI deploys with the existing `deploy-on-server.sh` (compose `down`/`up`), which also starts `ebay_tempo_init`, `ebay_tempo` and the updated collector and Grafana.
2. Verify: open a page in the app, then from an agent session run `search_tempo_traces` for `service.name = "ebay_helper"` and `get_tempo_trace` on a result; check the Loki-to-trace and trace-to-logs links in Grafana Explore.
3. Rollback: revert the commit and redeploy. Without the tracer provider the app goes back to exporting logs only; `deploy/mount/tempo` can be deleted by hand.
