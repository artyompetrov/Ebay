# Proposal

## Why

Performance problems and errors in the clients (the Chrome extension and the Blazor WebAssembly frontend) cannot be investigated today. Development is mostly done by coding agents that debug through Grafana (Tempo/Loki), so they need as much client-side information as possible there.

Today neither client records spans of its own. The extension only sends a `traceparent`, so its backend calls show up in Tempo under a root that never arrives (`<root span not yet received>`). How long the extension takes to react on a page is invisible. For example, the lot registration panel on `https://www.ebay.com/itm/...?tool_productId=...` sometimes appears slowly, and nothing shows where that time goes. The Blazor frontend sends no trace context at all. Client logs exist only in the browser console. Extension errors reach the backend through a dedicated endpoint that writes them to the `ClientErrors` table, which nobody reads.

In addition, the extension calls the backend (update check) from every http(s) page the user visits, even when no handler matches.

## What Changes

- **Extension page tracing.** On a page where a handler matched, the extension records a root span from the browser's navigation start, so the trace shows the full reaction time as the user perceives it. The root span carries navigation milestones, `extension.handler_matched` and `panel.shown` events, and has child spans for processors, element waits, cache lookups, the update check and HTTP calls. HTTP call spans are split into page↔worker transfer and worker fetch.
- **Extension background work and slow frames.** Polling iterations and idle highlighting passes are their own traces, linked to the page trace. Long animation frames over 50 ms (with attribution to extension scripts) and clicks on the extension panel are recorded.
- **Frontend tracing.** The Blazor frontend records one root span per navigation, from the initial load including boot timing and Web Vitals, named after the route. It also records spans for page lifecycle and render, slow component steps, JS interop calls, clicks and backend calls.
- **Backend spans join client traces.** The `traceparent` sent to the backend names the client's recorded call span, so backend spans hang under the client's trace.
- **Logs go to Loki.** Both clients send their log records with trace correlation, at a level served by the backend: `Debug` by default, raisable to `Trace` without a client build. Backend request/response bodies are logged only at `Trace`, truncated to 4 KB. Headers, tokens, codes, form values, query strings and third-party bodies are never exported.
- **Errors.** Caught errors, uncaught errors and unhandled rejections/task exceptions are exported as error records and mark spans as failed.
- **Relay endpoints.** New backend endpoints: `POST /api/telemetry/v1/traces`, `POST /api/telemetry/v1/logs` and `GET /api/telemetry/v1/settings`. Authenticated clients post OTLP/JSON, the backend forwards it byte-for-byte to the private collector, and these requests are not traced themselves.
- **Export rules.** Export is batched and bounded, never starts a login, never retries, and reports dropped counts. In the extension the OpenTelemetry SDK, batching, token handling and export live in the background service worker. The content script only records lightweight span/log objects.
- **Telemetry gated on a matched handler.** The extension sends no telemetry and makes no backend call (including the update check) on pages where no handler matched. The update check runs after handler matching, as a span of the page.
- **BREAKING:** removed the `POST /api/ebay/v1/error/` endpoint (`SaveError`, `ClientErrorInfo`), the `ClientError` entity, service and repository, and the `ClientErrors` table (dropped by a migration, its data is discarded). Extension builds released before this change get a `4xx` there (`405`: only the frontend's GET fallback matches the path), which they already catch.

Non-goal: separate client metrics. Traces and logs carry the measurements (Web Vitals, timings) as span attributes/events. Metrics can be derived from spans in the collector later if needed.

Delivery: two PRs under this one change. Stage 1 covers the backend relay, removal of the error table and the Chrome extension. Stage 2 covers the Blazor frontend.

## Capabilities

### New Capabilities
- `client-telemetry`: what the browser clients (Chrome extension, Blazor frontend) record as spans and logs, how it reaches Tempo/Loki through the backend relay, what it must never contain, and how export failures are handled.

### Modified Capabilities
- `observability-tracing`: the requirement "Infrastructure and static requests are not traced" adds the telemetry relay. The requirement "Chrome extension calls from one page share a trace" is removed and superseded by `client-telemetry`.

## Impact

- **Chrome extension** (`src/ChromeExtension`):
  - `background.js` becomes a TypeScript webpack entry that holds the OTel SDK, the exporter and the token lookup; `manifest.json.template` changes accordingly.
  - The content script gets a dependency-free span/log recorder that replaces `TraceContext.ts`, and `console.*` calls go through a logger.
  - `main.ts` matches handlers before the update check.
  - `EbaySiteProcessor` gets spans/events and loses `saveErrorToBackend`.
  - `extendedLogging` is replaced by log levels.
  - New npm dependencies (OpenTelemetry JS) are used in the worker bundle only.
- **Blazor frontend** (`src/Ebay/Frontend`):
  - A new `Telemetry` folder: `ActivitySource`, tracing message handler, navigation tracer driven from `App.razor`, traced page base, `ILoggerProvider`, OTLP/JSON exporter, and JS interop for performance observers and flush on hide.
- **Backend** (`src/Ebay`):
  - Contract operations in `WebApi.yaml` (tag `Telemetry`).
  - A relay service and a driven `Server.Adapters.Driven.OtlpCollector` adapter that sends to the same collector address the backend already exports to (`OTEL_EXPORTER_OTLP_ENDPOINT`), plus an optional `ClientTelemetry__MinLevel` setting.
  - A `TracedRequestFilter` exclusion.
  - Removal of `ClientError*` and a WriteModel migration that drops `wm."ClientErrors"`.
- **Deploy**: no new containers. New `service.name` values `ebay_chrome_extension` and `ebay_frontend` in Loki and Tempo. No new required env vars.
- **Docs**: `src/ChromeExtension/AGENTS.md`, `src/Ebay/AGENTS.md` (Tracing section, path-prefix rule, frontend telemetry, JSExport usage), and root `AGENTS.md` Navigation (TraceQL/LogQL examples for the client services).
