# Tasks

## 1. Backend tracing setup

- [ ] 1.1 Add package versions to `src/Ebay/Directory.Packages.props` (`OpenTelemetry.Instrumentation.AspNetCore`, `OpenTelemetry.Instrumentation.Http`, `Npgsql.OpenTelemetry` matching the resolved Npgsql version, `OpenTelemetry.Exporter.InMemory` for tests; releases at least two weeks old, compatible with OpenTelemetry 1.18.0) and reference them from `Server.Platform` (and `Tests.Integration` for the in-memory exporter); verify `dotnet build src/Ebay/Ebay.slnx` succeeds with no new warnings
- [ ] 1.2 In `Server.Platform/PlatformExtensions.AddPlatform`, add `WithTracing` per design D1-D2: service resource from `OTEL_SERVICE_NAME`, `AlwaysOnSampler`, ASP.NET Core instrumentation with the path filter (health, `/_framework/`, `/.well-known/`, `.js`/`.css`/`.wasm`), HttpClient instrumentation, `AddNpgsql()`, caller-provided source names, `AddOtlpExporter()`; update the XML docs; verify the build and that the existing `ArchitectureTest` still passes
- [ ] 1.3 Add the query-string scrubbing span processor (design D3) in `Server.Platform` and register it on the tracer provider; verify with a unit test in `Tests.Unit` (`[TestOf]` the processor) that `url.query` is removed and `url.full` loses its `?...` part
- [ ] 1.4 Pass the three application source names (`Server.Adapters.Driven.ChipFind`, `Server.Adapters.Driven.Qrz`, `Server.Application.SaleAdvertisements` `WellKnown` constants) from `Server/Program.cs` into `AddPlatform`, and update the "future AddSource" comment in `Server.Application/WellKnown.cs`; verify the app starts locally (`dotnet run` with no collector running) without errors other than OTLP export warnings
- [ ] 1.5 In `Tests.Integration`, attach an in-memory exporter to the host's tracer provider through `ConfigureOpenTelemetryTracerProvider` in `IntegrationTestsSetupFixture`, with a helper that returns only the spans of a given trace or marker (safe under parallel tests, design D7); verify the existing integration tests still pass
- [ ] 1.6 Add integration tests tagged `[OpenSpecScenario("observability-tracing", ...)]` for every covered scenario: API request server span, every request recorded, health / `_framework` / `.well-known` not traced, nested database span, no parameter values, outgoing call client span, spans from all three application sources, no query string or `Authorization` value in any span; verify they pass with `dotnet test src/Ebay/Tests.Integration` and `dotnet test src/Ebay/Tests.Unit`

## 2. Trace storage and pipeline

- [ ] 2.1 Add `deploy/config/tempo/tempo.yaml` (OTLP gRPC receiver on 4317, HTTP API on 3200, local storage and WAL under `/var/tempo`, `block_retention: 168h`, metrics generator off) per design D4; verify the config loads by running the pinned Tempo image locally against it (for example `docker run ... -config.file=... ` reaches `/ready`)
- [ ] 2.2 Add `ebay_tempo_init` (busybox chown of the mount to 10001, `network_mode: none`) and `ebay_tempo` (pinned image, `mem_limit: 512m`, `GOMEMLIMIT`, `./mount/tempo:/var/tempo`, `internal_network`, healthcheck on `/ready`, no published ports) to `deploy/docker-compose.yaml`; verify `docker compose -f deploy/docker-compose.yaml config` succeeds
- [ ] 2.3 Add the `traces` pipeline (`otlp` -> `batch` -> `otlp/tempo` at `ebay_tempo:4317`, insecure TLS) to `deploy/config/otelcollector/config.yaml` and make `ebay_otelcollector` depend on `ebay_tempo`; verify with `otelcol-contrib validate` using the pinned collector image

## 3. Grafana and agent access

- [ ] 3.1 Pin `uid: P8E80F9AEF21F6940` on the Loki datasource and add its `TraceID` derived field (`matcherType: label`, field `trace_id`, linking to datasource uid `tempo`) in `deploy/config/grafana/provisioning/datasources/loki.yaml`; verify the provisioning YAML parses and the UID matches the one used by `deploy/config/grafana/provisioning/dashboards/json/loki.json`
- [ ] 3.2 Add `deploy/config/grafana/provisioning/datasources/tempo.yaml` (`uid: tempo`, `http://ebay_tempo:3200`, `tracesToLogsV2` to the Loki UID filtering by `service_name` and `trace_id`) and make `ebay_grafana` depend on `ebay_tempo`; verify the YAML parses and `docker compose ... config` still succeeds
- [ ] 3.3 Update the root `AGENTS.md`: Navigation entry for `deploy/config/tempo`, the Grafana/MCP paragraph (traces live in Tempo, datasource uid `tempo`, 7-day retention, use `mcp__grafana__search_tempo_traces`/`get_tempo_trace`, Loki logs carry `trace_id`), and `src/Ebay/AGENTS.md` if it describes `Server.Platform`; verify the described names match the files

## 4. Checks and rollout verification

- [ ] 4.1 Run `./scripts/agent-check/agent-check.sh` and `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh`; verify both pass
- [ ] 4.2 After deployment, as the `mcp` user through the Grafana MCP server, run `search_tempo_traces` for `service.name = "ebay_helper"` and open one result with `get_tempo_trace`; verify the trace has the request span with nested database spans, and check the log-to-trace and trace-to-logs links in Grafana Explore (apply the design's fallback if the Loki derived field does not work on Grafana 10.4.2)

## Workflow follow-up

- Sync the `observability-tracing` spec and archive the change, then rerun `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh`.
