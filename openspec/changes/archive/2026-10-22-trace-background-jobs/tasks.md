# Tasks

## 1. Background job runs as traces

- [x] 1.1 Add a span source `Server.Adapters.Driving.BackgroundTasks` and one helper in `Server.Adapters.Driving.BackgroundTasks` that runs a job as a root span named after the job (clearing any ambient span first), marks failures as errors and leaves shutdown cancellation unmarked; verify with unit tests in `Tests.Unit` tagged `[OpenSpecScenario("observability-tracing", "Background job runs are traced", ...)]` for the failing-run, shutdown and child-span scenarios
- [x] 1.2 Run every iteration of the periodic job loop (`BackgroundTask`) through the helper; verify with a unit test that two iterations of a test job produce two root spans in separate traces
- [x] 1.3 Run the startup jobs (`DbCacheCleanupHostedService`, `MeasurementPlotWarmupHostedService`) through the helper; verify with a unit test that the DB cache cleanup job started under an unrelated span records a root span in a new trace
- [x] 1.4 Document in `src/Ebay/AGENTS.md` that every background job run is its own trace and new hosted services must run their work through the helper; verify the text matches the code

## 2. Checks

- [x] 2.1 Run `dotnet build`, the unit tests, the tracing integration tests and `./scripts/agent-check/agent-check.sh`; verify all pass
- [x] 2.2 Archive the change and run `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh`; verify every scenario is covered

## Workflow follow-up

- After deployment, find a background job trace with the Grafana MCP Tempo tools (`{name="CurrencyRateBackgroundTask"}`) and check it contains the job's SQL and HTTP spans.
