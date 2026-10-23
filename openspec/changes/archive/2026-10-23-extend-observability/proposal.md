# Proposal

## Why

Traces already show incoming requests, SQL, outgoing `HttpClient` calls and MassTransit messages, but several parts of the system are still invisible or hard to investigate: sending email produces no spans, the startup signing key cleanup's SQL is dropped as parentless, failures carry an error status but not the exception, lookups in the measurement content cache are not visible, every Chrome extension call is a separate trace, and there are no metrics at all (request rate and latency, connection pool, runtime, message bus), so trends can only be guessed from individual traces.

## What Changes

- Email sending is traced: connecting, authenticating and sending through the SMTP client appear as spans inside the trace that sent the email.
- The startup signing key cleanup runs as a background job, so its run is its own trace and its SQL is recorded.
- Failures carry the exception: an outgoing HTTP call that fails and an API request that fails with an unexpected error record the exception (type, message, stack trace) on their span, next to the error status.
- Lookups in the in-memory measurement content cache (photos, thumbnails, rendered plots) become spans that say whether the content was served from the cache.
- The currency rate source calls openexchangerates.org through the backend's HTTP client factory instead of a library that creates its own `HttpClient` per call; the call stays traced as before.
- The Chrome extension sends one W3C trace context with every backend call it makes while processing a page, so all backend work caused by one page is one trace; calls to other hosts (the eBay API) carry no trace context.
- New: backend metrics. Request, outgoing HTTP, database client, message bus, email client and .NET runtime metrics, plus every application meter named `Server.*`, are exported over OTLP to a new Prometheus instance, kept for 30 days and queryable through Grafana (including the agent's read-only MCP account).

## Capabilities

### New Capabilities
- `observability-metrics`: which backend metrics are recorded, where they are stored and how long they stay queryable.

### Modified Capabilities
- `observability-tracing`: adds requirements for email spans, exceptions on failed spans, measurement content cache spans and a shared trace for the Chrome extension's calls from one page.

## Impact

- Code: `src/Ebay/Server.Platform` (tracer options, meter provider), `Server.Adapters.Driven.Smtp` (MailKit telemetry), `Server.Adapters.Driven.EF.Identity` and `Server.Adapters.Driving.BackgroundTasks` (signing key cleanup becomes a background job behind a driven port, with a use case in `Server.Application`), `Server.Adapters.Driving.WebApi` (`ErrorFilter`), `Server.Adapters.Driven.MemoryCache`, `Server.Adapters.Driven.OpenExchangeRates` (drops the `OpenExchangeRates.NET` package), `src/ChromeExtension` (trace context on backend calls); tests in `Tests.Unit`, `Tests.Integration` and `src/ChromeExtension/tests`.
- Deployment: new `ebay_prometheus` container (OTLP receiver, 30-day retention, `mem_limit`), a metrics pipeline in the collector, a provisioned Grafana Prometheus datasource.
- Docs: root `AGENTS.md` and `src/Ebay/AGENTS.md` (tracing, metrics, module descriptions).
- No API or database schema changes.
