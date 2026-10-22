# Design

## Context

See proposal.md - Why. Background jobs live in `Server.Adapters.Driving.BackgroundTasks`: periodic jobs derive from the `BackgroundTask` loop (sale-advertisement monitoring, stale advertisement cleanup, currency rates); `DbCacheCleanupHostedService` and `MeasurementPlotWarmupHostedService` do their work once in `StartAsync`. The platform exports every `Server.*` span source and drops database spans without a parent (`openspec/specs/observability-tracing`).

## Goals / Non-Goals

**Goals:**
- One place that turns a job run into a trace, used by the periodic loop and the startup jobs.

**Non-Goals:**
- Tracing the waits between iterations, or one long-lived span for the whole loop (a trace per run is what people and the agent search for).
- Changing message consumers: they already continue the trace that published the message.

## Decisions

**D1. A single helper runs a job as a root span.**
`BackgroundJobTracing.RunAsync(jobName, work, cancellationToken)` (internal, in the adapter) sets `Activity.Current` to `null` and starts an `Internal` span named after the job on the `Server.Adapters.Driving.BackgroundTasks` source. Clearing the ambient span makes the run a root even when the host or a test starts the job inside another span; because the helper is an `async` method, the cleared value does not leak back to the caller. On an exception it sets error status, records the exception as a span event and rethrows; an `OperationCanceledException` raised by the job's own cancellation token is not an error.
*Alternative:* `StartActivity(..., parentContext: default)`. Rejected: a default parent context means "use `Activity.Current`", so it does not create a root.

**D2. The job name is the hosted service's type name** (`CurrencyRateBackgroundTask`, `DbCacheCleanupHostedService`, ...): stable, unique, and the same name already used in the jobs' logs, so traces and logs are easy to match.

**D3. Where the helper is called.** In `BackgroundTask.RunTaskForever` around each `BackgroundTaskImplementation` call (not around the delay), and around the work in the two startup jobs' `StartAsync`. The monitoring pipeline's existing `sale-advertisements.run` span becomes a child of its job's run span. The plot warmup publishes one message per measurement; their consumers join the warmup's trace, which can be large but is exactly the work that run caused.

## Risks / Trade-offs

- [Runs with `IsLocalRun` enabled still produce a short empty span locally] -> harmless; the check stays inside the job.
- [More data in Tempo: SQL of background runs is no longer dropped] -> runs are infrequent (every 30 minutes at most); 7-day retention bounds it.
