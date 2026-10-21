# Tasks

## 1. Backend tracing setup

- [x] 1.1 Add package versions to `src/Ebay/Directory.Packages.props` (`OpenTelemetry.Instrumentation.AspNetCore`, `OpenTelemetry.Instrumentation.Http`, `Npgsql.OpenTelemetry` 10.0.x matching the resolved Npgsql 10.0.0; releases at least two weeks old, compatible with OpenTelemetry 1.18.0) and reference them from `Server.Platform`; verify `dotnet build src/Ebay/Ebay.slnx` succeeds with no new warnings
- [x] 1.2 Add the two `internal` span processors from design D3 (orphan `Npgsql` span filter, query scrubber) in `Server.Platform`, plus `InternalsVisibleTo("Tests.Unit")`; verify with unit tests in `Tests.Unit` (one class per processor, `[TestOf]`) that a parentless `Npgsql` activity loses `Recorded` while one with a parent keeps it, and that `url.query` is removed and `url.full` loses its `?...` part
- [x] 1.3 In `Server.Platform/PlatformExtensions.AddPlatform`, add `WithTracing` per design D1-D3: the parent-based always-on sampler, ASP.NET Core instrumentation with the path filter (health, `/_framework/`, `/_content/`, `/.well-known/`, static asset extensions), HttpClient instrumentation, `AddNpgsql()`, `AddSource("Server.*")`, `AddSource("MassTransit")`, the D3 processors registered before `AddOtlpExporter()`; update the XML docs and add a TODO next to the logging setup about query strings in logs; verify the build and that `ArchitectureTest` still passes
- [x] 1.4 Update the "future AddSource" comment in `Server.Application/WellKnown.cs` and document in `src/Ebay/AGENTS.md` that span source names must start with `Server.` to be exported; verify the app starts locally (`dotnet run` with no collector running) without errors other than OTLP export warnings
- [x] 1.5 In `Tests.Integration`, attach a test exporter (`SpanCollector`) to the host's tracer provider through `ConfigureOpenTelemetryTracerProvider` in `IntegrationTestsSetupFixture`, with helpers that send a test-generated `traceparent` and return only exported spans of that trace id (design D7); verify the existing integration tests still pass
- [x] 1.6 Add integration tests tagged `[OpenSpecScenario("observability-tracing", ...)]` for every covered scenario: API request server span; request with sampled flag off still recorded; health, `_framework`, `favicon.ico` and `.well-known` not traced; nested database span; no parameter values in database spans (value sent in the request body); parentless database command dropped; outgoing call client span against a real `127.0.0.1` socket listener; spans from all three application sources (literal source names); no query-string name/value or `Authorization` value in the request's trace; verify they pass with `dotnet test src/Ebay/Tests.Integration` and `dotnet test src/Ebay/Tests.Unit`
- [ ] 1.7 Measure the idle span rate: run the app locally against the collector and Tempo for 5 minutes with no user traffic; verify that no per-poll database traces appear and record the observed rate in the PR description

## 2. Trace storage and pipeline

- [ ] 2.1 Pick an exact Tempo tag from the last 2.x line, at least two weeks old, and check whether it supports `/tempo --health`; add `deploy/config/tempo/tempo.yaml` (OTLP gRPC receiver bound to `0.0.0.0:4317`, HTTP API on 3200, local storage and WAL under `/var/tempo`, `block_retention: 168h`, metrics generator off, `usage_report.reporting_enabled: false`) per design D4; verify the config loads by running that image locally against it until `/ready` answers
- [ ] 2.2 Add `ebay_tempo_init` (busybox chown of the mount to 10001, `network_mode: none`) and `ebay_tempo` (pinned image, `mem_limit: 512m`, `GOMEMLIMIT`, `./mount/tempo:/var/tempo`, `internal_network`, healthcheck `["CMD", "/tempo", "--health"]` only if supported, no published ports) to `deploy/docker-compose.yaml`; verify `docker compose -f deploy/docker-compose.yaml config` succeeds
- [ ] 2.3 Add the `traces` pipeline (`otlp` -> `batch` -> `otlp/tempo` at `ebay_tempo:4317`, insecure TLS, no `debug` exporter) to `deploy/config/otelcollector/config.yaml` and make `ebay_otelcollector` depend on `ebay_tempo`; verify with `otelcol-contrib validate` using the pinned collector image

## 3. Grafana and agent access

- [ ] 3.1 Pin `uid: P8E80F9AEF21F6940` on the Loki datasource and add its derived field (`name: TraceID`, `matcherType: label`, `matcherRegex: trace_id`, `datasourceUid: tempo`, `url: '${__value.raw}'`) in `deploy/config/grafana/provisioning/datasources/loki.yaml`; verify the YAML parses and the UID matches `deploy/config/grafana/provisioning/dashboards/json/loki.json`
- [ ] 3.2 Add `deploy/config/grafana/provisioning/datasources/tempo.yaml` (`uid: tempo`, `http://ebay_tempo:3200`, `tracesToLogsV2` with the Loki UID, `tags: [{ key: service.name, value: service_name }]`, `filterByTraceID: true`) and make `ebay_grafana` depend on `ebay_tempo`; verify the YAML parses and `docker compose ... config` still succeeds
- [ ] 3.3 Update the root `AGENTS.md`: Navigation entry for `deploy/config/tempo`, the Grafana/MCP paragraph (traces live in Tempo, datasource uid `tempo`, 7-day retention, use `mcp__grafana__search_tempo_traces`/`get_tempo_trace`, Loki logs carry `trace_id`); verify the described names match the files

## 4. Checks and rollout verification

- [ ] 4.1 Run `./scripts/agent-check/agent-check.sh` and `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh`; verify both pass
- [ ] 4.2 After deployment, as the `mcp` user through the Grafana MCP server, run `search_tempo_traces` for `service.name = "ebay_helper"` and open one result with `get_tempo_trace`; verify the trace has the request span with nested database spans, and check the log-to-trace and trace-to-logs links in Grafana Explore (apply the design's fallback if the Loki derived field does not work on Grafana 10.4.2)

## Workflow follow-up

- Sync the `observability-tracing` spec and archive the change, then rerun `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh`.
