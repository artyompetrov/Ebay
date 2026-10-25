# Design

## Context

See proposal.md (Why). Current state that shapes the approach (verified against the code):

- **Extension HTTP path.** The content script (`build/ebay.js`, `document_start` on every http(s) page) sends all HTTP through `fetchResource` (`src/infrastructure/Utils.ts`). That function passes the request to the background service worker (`_extension/background.js`, plain JS outside webpack) via `chrome.runtime.sendMessage`. Content-script fetches would be subject to the page's CORS rules, so they are not made directly.
- **Extension trace ids.** `PageTraceContext` (`TraceContext.ts`) creates one trace id per page and a random parent id per call. No span is ever recorded with those ids.
- **Extension update check.** `main.ts` runs `checkForUpdates()` before matching processors. It fetches `update_url`, which is on the backend domain, so every visited page already sends a backend request with a `traceparent`.
- **Extension token.** The backend token is a JSON string in `chrome.storage.local["ebayToolTokenStore"]`, guarded by `backend_url`. It is written only on login by `AuthPageProcessor`, and refreshed tokens are not stored back. The access token lifetime is 30 days. `getNewToken` redirects the page to log in.
- **Extension logging.** `Settings.extendedLogging` is hardcoded to `true` and logs full URLs, bodies and headers, including `Authorization`, to the console. `EbaySiteProcessor` logs whole payloads. Errors reach the backend only through `saveErrorToBackend`.
- **Extension load path.** On an eBay lot page `EbaySiteProcessor.run()` waits for `footer` before anything else. It then creates the panel, reads the page (including footer waits inside the description iframe), calls eBay `getItem` twice and the backend `getLotInfo`/`extractData`, and compares the lot data. Polling on search pages (`updateStatusInfinite`) runs every second, forever.
- **Blazor frontend.** Single-threaded WASM. The `ServerAPI` HttpClient uses `BaseAddressAuthorizationMessageHandler`. No `traceparent` is sent. There is no appsettings, so the default level is Information, and `IHttpClientFactory` logs every request URI (with its query) at Information. JS interop is done only with `JSImport` (`Frontend/Interop.cs`). `App.razor` uses `Router` → `Found` → `AuthorizeRouteView`.
- **Backend.**
  - `WebApiController` overrides the NSwag-generated `WebApiControllerBase`, one abstract method per contract operation.
  - `ErrorFilter` turns every exception into a 500.
  - OTel exports via `OTEL_EXPORTER_OTLP_ENDPOINT` (`http://ebay_otelcollector:4318`).
  - `ParentBasedSampler(localParentNotSampled: AlwaysOff)` with `TracedRequestFilter` drops spans started inside excluded requests.
- **Infrastructure.**
  - nginx `client_max_body_size` is 25m.
  - Tempo uses the default `max_bytes_per_trace` (5 MB).
  - The collector's OTLP/HTTP receiver accepts JSON. Its logs pipeline also has a `debug` exporter at `verbosity: detailed`.

## Goals / Non-Goals

**Goals:**
- An agent can open a client trace and see where the time went from navigation start to the visible result, with backend spans nested under the client call that caused them.
- Client logs (Debug by default, Trace on demand) are searchable in Loki by `service_name`, `trace_id` and `session.id`.
- Near-zero cost on host pages: no SDK, no serialization and no network calls on pages the extension does not handle, and minimal main-thread work on pages it does handle.

**Non-Goals:**
- Client metrics (see proposal). Metrics can later be derived in the collector (`spanmetrics` connector) without client changes.
- Fixing the slow panel itself. This change makes it measurable. Fixes (e.g. not waiting for `footer`) are follow-ups driven by the traces.
- Implicit async context propagation (zone.js) and patching host-page globals.
- Validating relayed batch contents (see Risks).

## Decisions

### D1. Backend relay with a raw, bounded body
- **Endpoints.** `POST /api/telemetry/v1/traces`, `POST /api/telemetry/v1/logs` and `GET /api/telemetry/v1/settings`, under tag `Telemetry`. The `/telemetry/` prefix is a deliberate exception to the `ebay/v1`/`webapi/v1` prefix rule (`src/Ebay/AGENTS.md`): it mirrors the OTLP paths. Document it there.
- **Why a relay.** It reuses the existing bearer auth and the clients' existing host permissions. The collector stays private, and no nginx or introspection work is needed. Rejected alternatives: an nginx `location /otlp/` with `auth_request` (new nginx config, introspection endpoint, CORS in nginx), and an unauthenticated ingest (flooding).
- **Raw body.** The request body must reach the action unread.
  - Declare the body in the contract so NSwag generates the abstract method without a bound body parameter. A binary/opaque body (`application/json` with a string/binary schema, or `x-` options of the generator) is to be confirmed in task 1.1 by inspecting the generated base class.
  - The `WebApiController` override reads `Request.Body` itself. It first rejects on `Content-Length > 1 MiB`, then copies into a buffer capped at 1 MiB + 1 byte, so a chunked body is never partially forwarded.
  - `[RequestSizeLimit]` is not used: it throws inside the action, and `ErrorFilter` would turn that into a 500.
- **Layering.** The controller maps HTTP to `ClientTelemetryService` (`Server.Application`). The service returns `OneOf<Success, TooLarge, Rejected, Error<string>>`, mapped to 200/413/400/502 with `ProblemAnswers`. The service is a thin pass-through. That is acceptable, because it keeps the controller free of the driven port.
- **Driven port.** `IClientTelemetryAdapter.ForwardAsync(signal, ReadOnlyMemory<byte>, ct)`. Adapter: a new `Server.Adapters.Driven.OtlpCollector` project with a named HttpClient whose base address is `OTEL_EXPORTER_OTLP_ENDPOINT`, the collector address the backend already exports its own telemetry to, so deployment needs no new setting. Integration tests replace the named client's primary handler with a fake collector in `ConfigureServices`, so the backend's own exporters are not affected.
- **Settings.** The `ClientTelemetry__MinLevel` option (default `Debug`) is served by `GET /api/telemetry/v1/settings` as `{ minLevel }`.
- **Not traced.** `/api/telemetry/` is added to `TracedRequestFilter`. The sampler then drops the adapter's outgoing span as well.
- **No log flood.** The relay request also generates ASP.NET Hosting and HttpClient logs every few seconds per client. Suppress them with a category filter for the relay's named HttpClient. For hosting logs, verify the effective level in task 1.3; if per-request Information logs appear, filter them by path for `/api/telemetry/`.

### D2. Extension: lightweight recorder in the content script, OTel SDK in the background worker
- **Content script.** A dependency-free `src/infrastructure/telemetry/` recorder.
  - It creates W3C ids with `crypto.getRandomValues` and timestamps as `performance.timeOrigin + performance.now()`.
  - It produces plain `SpanRecord`/`LogRecord` objects: name, ids, parent, links, kind, start/end, attributes, events and status.
  - Ended records are queued and sent to the worker in one `chrome.runtime.sendMessage({ kind: 'telemetry', records })`. The queue is sent when it reaches 50 records, every 1 s, or immediately on `pagehide`/`visibilitychange → hidden`. Sending only on these triggers keeps the message cost per page small.
  - The tests are plain unit tests: the recorder has no `chrome.*` dependency, and the transport is injected.
- **Worker.** `background.ts` becomes a webpack entry (and `manifest.json.template` → `background.service_worker` changes accordingly).
  - It owns `@opentelemetry/sdk-trace-base` and `@opentelemetry/sdk-logs` with `BatchSpanProcessor`/`BatchLogRecordProcessor` (2 s schedule, queue 2048, drop oldest), resource attributes and `SpanLimits` (attribute value ≤ 4 KB, 64 attributes, 128 events).
  - It converts incoming records to the SDK's readable span/log shapes and serializes them with `@opentelemetry/otlp-transformer` (JSON).
  - It posts to the relay without `traceparent`, using the stored token. The token lookup uses the same `backend_url` match and `expiresAt` check as `getStoredToken`. A missing or expired token, `401`, `4xx`, `5xx` or a network error means the batch is dropped and counted.
  - Before each export it fetches the settings (cached for 10 min) and applies the level filter to logs in the worker, so the content script needs no settings round trip.
  - The worker also records its own spans: the fetch for each relayed HTTP call, as a child of the content script's client span, and worker wake-ups. MV3 kills idle workers, so the 2 s schedule keeps the loss window small.
- **Why the SDK goes in the worker.** Chosen by the user over the content-script variant. It keeps the SDK parse and initialization off every host page (`document_start`, with a development build). It means one SDK per browser instead of one per tab, serialization off the host page's main thread, batching across tabs, and one place for tokens.
- **Gating.** `main.ts` matches processors synchronously first. If none match, the recorder stays in buffer-only mode, and its buffer is discarded on `pagehide`. No message is sent, no SDK work happens, and no update check runs. If a processor matches, the recorder starts the page root span and flushes the buffered early logs into it. The update check then runs as a child span. This changes behaviour: the "new version" alert appears only on handled pages.
- **Root span.** `page <processors>`, `startTime = performance.timeOrigin`.
  - Attributes: `url.path` and `server.address` (no query), `extension.mode`, `page.visibility_state`.
  - Events from `PerformanceNavigationTiming`: `responseEnd`, `domContentLoaded`, `load` (added when it fires), `extension.script_start` (`performance.now()` at module start) and `extension.handler_matched`.
  - The root ends when all processors' `run()` return, or on `pagehide`, whichever comes first.
  - `EbaySiteProcessor` adds `panel.shown` when the panel becomes visible. The time from trace start to that event is the reaction time the user sees.
- **Context passing without zone.js.**
  - `withSpan(name, parent, fn)` passes the span explicitly. The recorder keeps a "page context" fallback, so any span or log without an explicit parent goes under the page root.
  - `fetchResource(input, init, parent?)` creates the client span.
  - `ClientsFactory` builds clients with a fetch bound to a parent span. Processors build their clients inside their own span, so calls nest under the processor.
  - Mis-nesting only changes the tree shape, never the timing.
- **Automatic choke-point spans.**
  - `sleepElementLoaded` creates a span `wait <selector>` with `attempts`.
  - `getCachedDataOrFallback` creates a span with `cache.hit`.
  - `fetchResource` creates a client span (method, `url.path`, `server.address`, status) with two children: `message to worker` / `message from worker`, derived from timestamps, and the worker fetch span reported by the worker.
- **Background work.**
  - Each `updateStatusInfinite` iteration is a new root span with a link to the page root.
  - Each idle highlighting pass is a new root span with a link and `items.processed`, `time.used_ms` and `yields` attributes.
  - This bounds trace size: Tempo rejects traces over 5 MB.
- **Slow frames.** `PerformanceObserver({ type: 'long-animation-frame', buffered: true })` runs on matched pages only. Frames over 50 ms become events on the page root, at most 60 per minute. An event records `duration`, `blocking_duration` and `extension.script = scripts.some(s => s.sourceURL.startsWith('chrome-extension://'))`. Fall back to `longtask` when LoAF is unavailable.
- **Interactions.** One delegated capture `click` listener on the extension's panel root. It creates a span named after `target.id` and the processor, with no values. The handler's work is passed that span as its parent.
- **Errors.** `window` `error`/`unhandledrejection` listeners on matched pages keep only events whose stack or filename is `chrome-extension://<own id>`. The worker has its own `self.onerror`. `showAndSaveError`/`saveErrorToBackend` become `logger.error(msg, error)` plus `span.recordException`/`setStatus(ERROR)`. The on-page error panel stays.
- **Logger.** `Logger.ts`: `trace/debug/info/warn/error(message, attrs?, error?)`.
  - Every record is written to `console` and recorded.
  - URL strings in messages and attributes are scrubbed (query removed) before recording.
  - Mapping of the existing `console.*` calls: progress messages become `debug`; payloads sent to or received from the backend become `trace` with the body truncated to 4 KB; eBay and third-party payloads stay console-only (`console` directly, never recorded); errors become `error`.
  - `extendedLogging` is removed. Headers are no longer logged anywhere, including the console.
- **Third-party page paths.** `url.path` and `server.address` of pages handled on third-party sites (e.g. search pages of shops) are exported; they can contain search terms in the path. Decision: keep them, because the path is needed for debugging and the data goes only to our own backend. Query strings are never exported.
- **`session.id`.** A random id per content-script instance (tab page load), set as a resource-like attribute on every record. The worker groups records by `session.id`.

### D3. Frontend: System.Diagnostics plus a hand-written OTLP/JSON exporter
- **Why not the OTel .NET SDK.** It is not usable on single-threaded `browser-wasm`: batch processors need threads, and the exporter uses synchronous `Send`. `ActivitySource`, `ActivityListener` and `ILoggerProvider` work. A JS OTel SDK was rejected because it would not see `HttpClient`/`ILogger` without a second bridge.
- **Navigation.** A `NavigationTracer` component wraps `AuthorizeRouteView` inside `Found` in `App.razor`.
  - In `OnParametersSet`, when the page type or route values change, it stops the previous root and starts `Activity` `nav <route template>` (template from the page's `@page`/`RouteAttribute` that matches `RouteData`). This covers the initial load, which `LocationChanged` does not.
  - Routed pages derive from `TracedPageBase`. It times `OnInitializedAsync`, `OnParametersSetAsync` and render-to-`OnAfterRender` as child activities. It ends the navigation root at the first `OnAfterRenderAsync` after initialization has completed.
  - Later work (clicks, polling) gets its own root activities.
  - Other components are timed by `TracedComponentBase`. Their spans are exported only when they take longer than 16 ms (filter in the listener).
- **Context fallback.** Blazor event handlers do not see an `AsyncLocal` set in a lifecycle method, so the `TracingMessageHandler` and the logger use `Activity.Current` first, then the `NavigationTracer`'s current activity.
- **HTTP.** `TracingMessageHandler` sits on `ServerAPI` before the authorization handler. For requests to the backend host it creates a `Client` activity, sets `traceparent` and records method, `url.path`, status and errors. For other hosts it records the activity without a header. It logs bodies at Trace (≤ 4 KB) only when the served level allows it.
- **Clicks.** The JS `interop.js` module has one delegated capture `click` listener. It records `{id, time}` for elements with an id. .NET pulls the queue on each export tick with `JSImport` and turns the entries into spans. A handler's HTTP calls nest under the click span through the navigation-tracer fallback for 1 s after the click.
- **Boot and Web Vitals.** `interop.js` collects the navigation timing, the resource timing of `_framework/*` (count, bytes, duration), LCP/CLS/INP (via `PerformanceObserver`) and LoAF over 50 ms. .NET pulls them each tick and attaches them as events to the initial navigation root. Vitals that settle after it ended go to a `web_vitals` span linked to it.
- **JS interop spans.** `Interop.cs` `JSImport` members become private `*Js` methods. Public wrappers start an activity named after the function.
- **Logs.** A `TelemetryLoggerProvider` takes its minimum level from the served settings (default Debug).
  - It excludes the categories `System.Net.Http.HttpClient.*` (client spans already cover them, and they contain query strings) and the `Client.Telemetry.*` namespace.
  - A re-entrancy guard stops records produced during an export from being recorded.
  - The console provider stays. Unhandled render exceptions are logged by the WebAssembly renderer at Critical and are captured.
  - `AppDomain.UnhandledException`, `TaskScheduler.UnobservedTaskException` and JS `error`/`unhandledrejection` (pulled through interop) are logged at Error.
- **Export.** `TelemetryBuffer` is a singleton with a bounded queue of 2048 items (drop oldest) and a drop counter.
  - A `PeriodicTimer` loop (2 s) serializes OTLP/JSON with `System.Text.Json`, splits the batches below 1 MiB, and posts through a named `Telemetry` HttpClient that has `BaseAddressAuthorizationMessageHandler` but no `TracingMessageHandler`. The HttpClient is created per call, following the project rule.
  - `AccessTokenNotAvailableException` or a non-success response drops the batch, and `Redirect()` is never called.
  - `visibilitychange → hidden` calls a `[JSExport]` method that triggers an immediate export. This is the first `JSExport` in the project; document it.
  - Resource attributes: `service.name=ebay_frontend`, `service.version` from `AssemblyInformationalVersionAttribute`, and `session.id` (a new GUID per app load).

### D4. Remove client error storage outright
`SaveError`/`ClientErrorInfo` are removed from `WebApi.yaml`, together with `ClientErrorService`, `IClientErrorRepository`, `ClientErrorRepository`, `ClientError` and the `DbSet`. A WriteModel migration drops `wm."ClientErrors"`; `Down` recreates the empty table. The extension stops calling `saveError` (group 3) before the operation leaves the contract (group 4), so the extension build never breaks. Older extension builds catch the resulting `404`. The table is write-only, so there is nothing to migrate.

## Risks / Trade-offs

- [Content-script cost on every page] → the recorder is a few KB with no dependencies. On unhandled pages it only buffers in memory and sends nothing. Task 2.1 sets a size budget: the content script grows by ≤ 10 KB.
- [MV3 worker termination can lose a pending batch] → a 2 s schedule and flushing when the queue reaches 512 items. Dropped counts are reported when they are known.
- [`pagehide` handoff is best effort] → records are sent synchronously in the handler, and in-flight messages usually survive because the worker is a separate process.
- [The extension token is written only on login (30-day lifetime, no refresh token)] → after it expires, the next backend call of the extension starts a login, which stores a new token. Telemetry is lost only in that short gap. Export itself never starts a login.
- [Explicit context: some spans nest under the page root instead of their real parent] → choke-point spans and per-processor clients cover the important paths. Timings stay correct.
- [The update alert now appears only on handled pages] → acceptable. Those are the pages where the extension is used.
- [An authenticated user can post arbitrary OTLP, including a spoofed `service.name`] → accepted. Only trusted people use the site and the extension, and the telemetry serves only debugging. The relay does not validate batch contents.
- [Volume: Debug logs, a polling trace per second per open search tab, LoAF events] → a single user, Loki ingest of 10 MB/s, 7-day Tempo retention, and per-minute caps on frequent events. If needed, lower the level to `Information` through the setting without a client build.
- [Trace-level bodies may contain business data from our own backend] → this was the user's decision. It is off by default, truncated to 4 KB, and never includes headers, tokens or third-party bodies.
- [The collector's `debug` exporter prints every log record in full to the container's stdout, which Docker keeps on disk without rotation; client Debug logs would multiply that] → remove the `debug` exporter from the collector (logs pipeline and definition): it only duplicates what Loki already stores and is read through Grafana.

## Migration Plan

1. Two PRs, each with its own deploy. Stage 1: the backend applies the migration and exposes the relay; the extension image is rebuilt (its inputs changed), and Chrome auto-updates it. Stage 2: the frontend telemetry ships in the backend image. No new required settings; `ClientTelemetry__MinLevel` can optionally be set in compose.
2. After deploy, use the Grafana MCP. Open the lot page from the proposal, then check:
   - TraceQL `{resource.service.name="ebay_chrome_extension" && name=~"page.*"}` shows a root from navigation start with `panel.shown`, and backend spans nested under extension client spans.
   - Frontend navigations appear under `ebay_frontend`.
   - Loki `{service_name="ebay_chrome_extension"} | trace_id="<id>"` returns records.
   - No `/api/telemetry/` request appears as an `ebay_helper` trace.
3. Rollback: revert the PR. `Down` recreates an empty `ClientErrors` table. Clients without telemetry keep working.

## Open Questions

- Exact OpenAPI/NSwag declaration that yields an override without a bound body (D1). It changes only the contract's declaration, not the behaviour; it is resolved in task 1.1.
