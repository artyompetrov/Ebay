# Proposal

## Why

Only the sale-advertisement monitoring job starts its own span. The other background jobs (currency rates, stale advertisement cleanup, DB cache cleanup and measurement plot warmup at startup) run without one, so their database commands are dropped as parentless and their outgoing HTTP calls show up in Tempo as anonymous `GET`/`POST` traces. Neither people nor the agent can see what a job run did, how long it took or why it failed.

## What Changes

- Every run of a background job becomes its own trace: a root span named after the job, started without a parent even if the job was started from inside another span.
- Everything the run does (database commands, outgoing HTTP calls, published messages, application spans such as the monitoring pipeline's) appears inside that trace.
- A run that fails marks its span as an error; a run stopped by application shutdown does not.
- Applies to periodic jobs (the shared periodic job loop) and to jobs that run once at startup. Message consumers are unchanged: they stay part of the trace that published the message.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `observability-tracing`: adds a requirement that each background job run is recorded as its own trace.

## Impact

- Code: `src/Ebay/Server.Adapters.Driving.BackgroundTasks` (a span source named `Server.Adapters.Driving.BackgroundTasks`, exported by the existing `Server.*` subscription; the periodic job loop and the two startup jobs), unit tests in `src/Ebay/Tests.Unit`.
- Trace volume: one extra trace per job run (every 30 minutes for monitoring, daily or twice a day for the others, once per startup for the startup jobs), plus the SQL of those runs that was dropped before.
- Docs: `src/Ebay/AGENTS.md` (Tracing section and background tasks module description).
- No deployment, API or database changes.
