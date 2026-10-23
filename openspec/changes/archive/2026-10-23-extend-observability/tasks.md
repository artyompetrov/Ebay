# Tasks

## 1. Traces

- [x] 1.1 Enable MailKit telemetry in `AddSmtpAdapter()` and export the `MailKit.Net.SmtpClient` source from the platform; verify with an integration test tagged `[OpenSpecScenario("observability-tracing", "Email sending is traced", "A failed connection to the mail server is recorded")]`
- [x] 1.2 Turn on exception recording for ASP.NET Core and `HttpClient` spans and record controller exceptions on the server span in `ErrorFilter`; verify with an integration test for a refused outgoing call and a unit test of `ErrorFilter`, tagged with the "Failed spans carry their exception" scenarios
- [x] 1.3 Move the signing key cleanup behind a driven port, a use case and a startup hosted service in `Server.Adapters.Driving.BackgroundTasks` run through `BackgroundJobTracing`; verify with unit tests of the hosted service (root span in a new trace, failure logged and not rethrown) and the existing cleaner tests
- [x] 1.4 Add the `measurement-content-cache.get` span with `cache.hit` to `MeasurementContentCacheAdapter`; verify with unit tests tagged with the "Measurement content cache lookups are traced" scenarios
- [x] 1.5 Call openexchangerates.org through a named `HttpClient` and remove the `OpenExchangeRates.NET` package; verify with a unit test of the response mapping against a stub handler
- [x] 1.6 Add the per-page `traceparent` to the Chrome extension's backend calls; verify with `npm test` tests tagged with the "Chrome extension calls from one page share a trace" scenarios and `npm run build`

## 2. Metrics

- [x] 2.1 Add the meter provider to `AddPlatform` (ASP.NET Core, `HttpClient`, Npgsql, `System.Runtime`, `MassTransit`, MailKit, `Server.*`, OTLP export); verify with integration tests tagged with the `observability-metrics` request and meter scenarios
- [x] 2.2 Add `ebay_prometheus` (OTLP receiver, 30-day retention, memory limit, init container), the collector metrics pipeline and the Grafana Prometheus datasource; verify the compose file with `docker compose config` and the Prometheus config with `promtool check config`

## 3. Docs and checks

- [x] 3.1 Update the root `AGENTS.md` and `src/Ebay/AGENTS.md` (tracing, metrics, signing key cleanup, Prometheus); verify the text matches the code
- [x] 3.2 Run `dotnet build`, the unit and integration tests, the extension tests and `./scripts/agent-check/agent-check.sh`; verify all pass

## Workflow follow-up

- Archive the change and run `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh`.
- After deployment, query `http_server_request_duration_seconds_count` through the Grafana MCP Prometheus tools (datasource uid `prometheus`) and find an email or signing key cleanup span in Tempo.
