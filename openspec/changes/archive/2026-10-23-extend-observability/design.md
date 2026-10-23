# Design

## Context

See proposal.md - Why. `Server.Platform.AddPlatform` owns the tracer provider: ASP.NET Core, `HttpClient` and Npgsql instrumentation, the `MassTransit` source and every `Server.*` source, a sampler that keeps every trace, `OrphanDatabaseSpanFilter` (drops parentless SQL) and `UrlQueryScrubber`, exported over OTLP to `ebay_otelcollector` and on to Tempo. Logs go the same way to Loki. There is no meter provider and no metrics store. Background jobs run inside `BackgroundJobTracing.RunAsync` in `Server.Adapters.Driving.BackgroundTasks`, except `UnreadableSigningKeyCleanupHostedService`, which lives in `Server.Adapters.Driven.EF.Identity`. API exceptions are answered by the MVC `ErrorFilter`, so they never reach the ASP.NET Core instrumentation as unhandled. The Chrome extension sends every request through the background service worker (`fetchResource` in `src/infrastructure/Utils.ts`), so CORS does not apply to its headers.

## Goals / Non-Goals

**Goals:**
- Every library that does IO on behalf of the backend is visible in traces; failures show their exception.
- Basic RED and resource metrics for the backend, stored next to logs and traces and reachable through the same Grafana (and its MCP account).

**Non-Goals:**
- Browser-side spans in the Chrome extension or the Blazor frontend (exporting from the browser needs a public, unauthenticated OTLP endpoint).
- Dashboards and alerts on the new metrics; they can be built once there is data.
- Metric exemplars (links from metrics to traces).
- Upgrading Duende IdentityServer (6.0.5 has no span source; its requests and SQL are already traced by ASP.NET Core and Npgsql).

## Decisions

**D1. MailKit telemetry is enabled by the SMTP adapter, exported by the platform.**
`AddSmtpAdapter()` calls `MailKit.Telemetry.SmtpClient.Configure()` and `MailKit.Telemetry.Socket.Configure()` (MailKit creates its span source and meters only after this call). The platform adds the source `MailKit.Net.SmtpClient` and the meters `mailkit.net.smtp`/`mailkit.net.socket` by name, as it does for `MassTransit`, so the platform does not reference MailKit.
*Alternative:* call `Configure()` from the platform. Rejected: the platform would reference a library that only one adapter uses.

**D2. Signing key cleanup becomes a background job behind a driven port.**
A port `ISigningKeyCleanupAdapter` (`Server.Application.Abstractions.Driven`) is implemented in the EF Identity adapter: it opens the DI scope Duende's stores need and runs the existing `UnreadableSigningKeyCleaner`. A use case `SigningKeyCleanupService` (`Server.Application`) calls it and logs the result; `SigningKeyCleanupHostedService` (`Server.Adapters.Driving.BackgroundTasks`) runs the use case through `BackgroundJobTracing.RunAsync` at startup and keeps today's best-effort behavior (a failure is logged and does not stop the application, the run's span is marked as an error).
*Alternative:* start a span in the EF Identity adapter itself. Rejected: it duplicates `BackgroundJobTracing`, and hosted services that run jobs belong to the background tasks driving adapter.

**D3. Exceptions on spans.**
`RecordException = true` on the ASP.NET Core and `HttpClient` trace instrumentation (unhandled exceptions of non-MVC endpoints and failed outgoing calls). `ErrorFilter` handles controller exceptions itself, so it adds the exception (`Activity.AddException`) and error status to the request's server span, found through `IHttpActivityFeature`. Exception events are text the trace store keeps; messages of the exceptions involved (connection errors, Npgsql errors with redacted details) do not contain query strings or credentials.

**D4. Cache lookup span in the content cache adapter.**
`MeasurementContentCacheAdapter.GetOrCreateAsync` starts a span `measurement-content-cache.get` on a new source `Server.Adapters.Driven.MemoryCache` (exported by `Server.*`) and sets `cache.hit` (the tag name ChipFind and Qrz already use) to whether the factory was skipped. The factory runs inside the span, so rendering and database work on a miss are its children.

**D5. OpenExchangeRates through `IHttpClientFactory`.**
The adapter registers a named client and calls `GET https://openexchangerates.org/api/latest.json?app_id=...&base=...&symbols=...` itself, reading `rates` with `System.Text.Json`. The `OpenExchangeRates.NET` package is removed: it creates and disposes its own `HttpClient` per call and accepts no client. The `app_id` stays out of traces because query strings are scrubbed.

**D6. Chrome extension trace context.**
A DOM- and `chrome`-free module `src/infrastructure/TraceContext.ts` holds one random trace id per loaded content script (that is, per page load) and builds a `traceparent` (`00-<trace id>-<new span id>-01`) for every call. `fetchResource` adds it only when the URL starts with the backend URL. The backend's sampler already records requests with a remote parent, so all calls of one page are one trace. The parent span ids are never exported, so Tempo shows such traces without a root span.
*Alternative:* export browser spans through the collector. Rejected: needs a public unauthenticated OTLP endpoint (see Non-Goals).

**D7. Metrics pipeline.**
`AddPlatform` adds `WithMetrics`: ASP.NET Core and `HttpClient` instrumentation (the built-in `Microsoft.AspNetCore.*`, `System.Net.Http` and `System.Net.NameResolution` meters), `AddNpgsqlInstrumentation()`, and the meters `System.Runtime` (built into .NET 9+, no extra package), `MassTransit`, the MailKit meters and `Server.*`, exported over OTLP like the other signals. The collector gets a `metrics` pipeline exporting with `otlphttp` to `ebay_prometheus` (Prometheus 3 with its native OTLP receiver enabled, `--storage.tsdb.retention.time=30d`, out-of-order window for OTLP pushes, `mem_limit`), and Grafana gets a provisioned Prometheus datasource with the fixed uid `prometheus`. Prometheus is reachable only on the internal network.
*Alternatives:* collector `prometheus` exporter plus a scrape job (one more hop and config to keep in sync); Grafana Mimir (far heavier than one small server needs).

## Risks / Trade-offs

- [Prometheus adds memory and disk on the single server] -> `mem_limit` with `GOMEMLIMIT` below it like Tempo, 30-day retention; the metric set is small (one service, low traffic).
- [Route and status labels multiply series] -> routes are templates, not raw paths, so cardinality is bounded by the number of endpoints.
- [Exception stack traces enlarge spans] -> only failed spans carry them, and those are the ones worth reading.
- [Extension traces have no root span] -> accepted; the server spans of a page still group under one trace id that the extension can log.

## Migration Plan

Deploy as usual: `deploy-on-server.sh` brings up the new `ebay_prometheus` (its one-shot init container chowns `deploy/mount/prometheus` to Prometheus' `nobody` user) and recreates the collector and Grafana with the new configs. Rollback: revert the commit and redeploy; the Prometheus data directory can be deleted.
