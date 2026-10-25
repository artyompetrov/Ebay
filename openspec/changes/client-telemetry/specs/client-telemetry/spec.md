# Spec Delta

## Purpose

Defines how the browser clients (the Chrome extension and the Blazor WebAssembly frontend) record their own spans and log records and deliver them through the backend to the central trace and log stores, so that client performance and errors can be investigated in Grafana together with the backend.

## ADDED Requirements

### Requirement: Backend relays client telemetry to the collector
The backend SHALL accept OTLP/JSON trace data at `POST /api/telemetry/v1/traces` and log data at `POST /api/telemetry/v1/logs` and forward the request body byte-for-byte to the collector's matching OTLP/HTTP path, answering `200` when the collector accepts it. Neither the relay request nor its call to the collector SHALL be recorded as a backend span.

#### Scenario: A trace batch is forwarded to the collector
- **WHEN** an authenticated client posts an OTLP/JSON trace batch to `/api/telemetry/v1/traces`
- **THEN** the collector receives the identical bytes at `/v1/traces` and the client gets `200`

#### Scenario: A log batch is forwarded to the collector
- **WHEN** an authenticated client posts an OTLP/JSON log batch to `/api/telemetry/v1/logs`
- **THEN** the collector receives the identical bytes at `/v1/logs` and the client gets `200`

### Requirement: Telemetry relay accepts only authenticated, bounded requests
The relay SHALL require Web API authentication and SHALL reject a body larger than 1 MiB with `413` without forwarding any part of it. When the collector rejects a batch as invalid (`4xx`), the relay SHALL answer `400`; when the collector fails or is unreachable, `502`. The relay SHALL NOT retry. Error answers SHALL use the Web API problem format.

#### Scenario: An anonymous request is rejected
- **WHEN** a client posts a trace batch to `/api/telemetry/v1/traces` without an access token
- **THEN** the response is `401` and nothing is forwarded to the collector

#### Scenario: An oversized batch is rejected
- **WHEN** an authenticated client posts a log batch of 1 MiB + 1 byte
- **THEN** the response is `413` and the collector receives nothing

#### Scenario: A batch rejected by the collector is a client error
- **WHEN** an authenticated client posts a trace batch while the collector answers `400`
- **THEN** the response is `400`

#### Scenario: A collector failure is reported once
- **WHEN** an authenticated client posts a trace batch while the collector answers `503`
- **THEN** the response is `502` and the collector received the batch exactly once

### Requirement: Backend serves the client telemetry level
The backend SHALL serve the minimum log level clients export at `GET /api/telemetry/v1/settings` to authenticated clients, taken from backend configuration, `Debug` when not configured. Clients SHALL apply a changed level within 10 minutes without a new client build.

#### Scenario: Default level is Debug
- **WHEN** an authenticated client requests `/api/telemetry/v1/settings` and no level is configured
- **THEN** the answer carries minimum level `Debug`

#### Scenario: A configured level is served
- **WHEN** the backend is configured with client telemetry level `Trace` and a client requests the settings
- **THEN** the answer carries minimum level `Trace`

### Requirement: Clients identify themselves in telemetry
Every exported client span and log record SHALL carry `service.name` (`ebay_chrome_extension` or `ebay_frontend`), `service.version` (the client build version) and `session.id` (random per browser tab for the extension, per app load for the frontend).

#### Scenario: Extension telemetry carries its identity
- **WHEN** the Chrome extension exports a span and a log record from one tab
- **THEN** both carry `service.name` `ebay_chrome_extension`, the manifest version as `service.version` and the same `session.id`

#### Scenario: Frontend telemetry carries its identity
- **WHEN** the Blazor frontend exports a span and a log record
- **THEN** both carry `service.name` `ebay_frontend`, the assembly informational version as `service.version` and the same `session.id`

### Requirement: Extension telemetry is gated on a matched page handler
The Chrome extension SHALL NOT export spans or log records and SHALL NOT call any backend for a page until at least one site processor has matched it. Records written before the match SHALL be exported once a processor matches and discarded otherwise. The extension update check SHALL run only after a processor matched.

#### Scenario: An unrelated page produces no telemetry and no backend call
- **WHEN** the extension loads on a page for which no site processor matches
- **THEN** no span or log record is exported and no request is sent to the backend, including the update check

#### Scenario: Early records are kept for a matched page
- **WHEN** the extension writes a log record before matching and a processor then matches the page
- **THEN** that log record is exported in the page's trace

### Requirement: Extension page reaction is traced from navigation start
For a matched page the extension SHALL record a root span starting at the browser's navigation start, with events for the document's navigation milestones and for the handler match, and a child span per processor run. A processor that shows its panel SHALL add a `panel.shown` event.

#### Scenario: The root span starts at navigation start
- **WHEN** the extension processes an eBay lot page
- **THEN** the exported root span's start time equals the page's navigation start, and it has events for `responseEnd`, `domContentLoaded` and `extension.handler_matched` with the processor names

#### Scenario: Showing the lot panel is a root span event
- **WHEN** the lot registration panel becomes visible on an eBay lot page
- **THEN** the root span carries a `panel.shown` event at that time, and the processor's span is its child in the same trace

### Requirement: Extension waits and lookups are traced
Within a processed page the extension SHALL record a span for each wait for a page element (selector and attempt count), for the update check, and for each cached-data lookup (whether it was a cache hit).

#### Scenario: Waiting for an element is a span
- **WHEN** a processor waits for the page footer to appear
- **THEN** a span with the selector and the number of attempts is exported as a descendant of the processor span

#### Scenario: A cache lookup records the hit
- **WHEN** a processor reads cached data that is present and not expired
- **THEN** a cache lookup span with cache-hit attribute `true` is exported

### Requirement: Extension background work is traced as linked traces
Each polling iteration and each idle-time processing pass of a page SHALL be recorded as the root span of its own trace, linked to the page's root span, so a long-open page never grows a single trace without bound.

#### Scenario: A polling iteration is its own linked trace
- **WHEN** a processor performs a polling iteration after its initial run
- **THEN** the iteration is exported as a root span of a new trace with a link to the page's root span

#### Scenario: An idle highlighting pass is its own linked trace
- **WHEN** the search-site highlighter runs an idle-time pass
- **THEN** the pass is exported as a root span with a link to the page's root span and attributes for the items processed

### Requirement: Extension backend calls are client spans that parent backend spans
The extension SHALL record a client span for every HTTP call (method, path without query, server address, status) and SHALL send a sampled `traceparent` naming that span to the backend only. Calls from one page load SHALL share the trace of their parent span, which for page work is the page trace. A failure or `5xx` SHALL mark the span as an error.

#### Scenario: The backend server span is a child of the extension call span
- **WHEN** the extension calls a backend endpoint while processing a page
- **THEN** the call's `traceparent` carries the page's trace id and the span id of the exported client span

#### Scenario: Calls of two page loads use different traces
- **WHEN** the extension makes a backend call on one page load and another on a different page load
- **THEN** the two calls carry different trace ids

#### Scenario: An extension call to another host carries no trace context
- **WHEN** the extension calls the eBay API
- **THEN** that call carries no `traceparent` header, and a client span for it is still exported

#### Scenario: A failed extension backend call marks its span as an error
- **WHEN** an extension backend call answers `500`
- **THEN** its client span is exported with error status and status code `500`

### Requirement: Extension call time is split by hop
For each HTTP call the extension SHALL record, as children of the call's client span, the time the background worker spent fetching and the time spent passing the request and response between the page and the worker.

#### Scenario: The worker fetch is a child of the call span
- **WHEN** the extension makes an HTTP call through the background worker
- **THEN** a worker fetch span is exported as a child of the call's client span, and the client span's duration covers it

### Requirement: Extension slow frames and panel interactions are traced
On a processed page the extension SHALL record long animation frames over 50 ms as span events with the duration and whether extension scripts ran in them, at most 60 per minute, and SHALL record each click on its own panel controls as a span named after the control id, without any entered values.

#### Scenario: A long frame caused by the extension is recorded
- **WHEN** an extension script blocks the page for more than 50 ms on a processed page
- **THEN** a long-frame event with its duration and an extension-script attribute `true` is exported in the page trace

#### Scenario: A panel button click is a span without values
- **WHEN** the user types a price into the lot panel and clicks its submit button
- **THEN** a span named after the button id is exported, and the typed price appears in no attribute of it

### Requirement: Frontend navigation is traced
The Blazor frontend SHALL record one root span per page navigation, including the initial load, named after the route template, ending when the page has rendered after its initialization. The initial-load span SHALL carry boot timing (framework download, time to first render) and Web Vitals measured during the visit as events.

#### Scenario: A navigation produces a root span named after the route
- **WHEN** the user navigates to the measurements page of a product
- **THEN** a root span named after the route template (without the product id) is exported and ends after the page's first render following its initialization

#### Scenario: The initial load carries boot timing
- **WHEN** the frontend loads in a fresh tab
- **THEN** the initial navigation span carries the framework download duration and the time to first render

#### Scenario: Backend calls during page initialization belong to its navigation trace
- **WHEN** a page loads data from the backend while initializing after a navigation
- **THEN** the client span of that backend call is exported in the navigation's trace

### Requirement: Frontend component work and interop are traced
The frontend SHALL record spans for routed pages' initialization, parameter setting and rendering, for any other component's lifecycle step longer than 16 ms, for every JS interop call, and for each user click on an element with an `id` (named after it, without values).

#### Scenario: Page initialization is a span
- **WHEN** a routed page runs its asynchronous initialization
- **THEN** an initialization span of that page is exported under the navigation span

#### Scenario: A JS interop call is a span
- **WHEN** a page calls a JS interop function
- **THEN** a span named after the function is exported in the current trace

#### Scenario: A click is a root span of its own interaction
- **WHEN** the user clicks a button with an id after the page has rendered
- **THEN** a span named after the button id is exported, and backend calls made by its handler are its descendants

### Requirement: Frontend backend calls are client spans that parent backend spans
The frontend SHALL record a client span for every backend HTTP call (method, path without query, status) and send a sampled `traceparent` naming it; it SHALL NOT send `traceparent` to other hosts. A failure or `5xx` SHALL mark the span as an error.

#### Scenario: The backend server span is a child of the frontend call span
- **WHEN** the frontend calls a backend endpoint inside a navigation
- **THEN** the call's `traceparent` carries the navigation's trace id and the span id of the exported client span

#### Scenario: A frontend call to another host carries no trace context
- **WHEN** the frontend makes an HTTP call to a host other than the backend
- **THEN** that call carries no `traceparent` header

#### Scenario: A failed frontend backend call marks its span as an error
- **WHEN** a frontend backend call answers `500`
- **THEN** its client span is exported with error status and status code `500`

### Requirement: Client logs are exported at the served level
Each client SHALL export its log records at or above the served minimum level, with severity and, when written inside a span, that span's trace and span id. Records SHALL keep appearing in the browser console. Records about telemetry export itself SHALL NOT be exported.

#### Scenario: An extension debug record is exported by default
- **WHEN** the extension writes a Debug record while processing a page, with the default level
- **THEN** the exported record has Debug severity and the trace and span id of the active span

#### Scenario: Records below the served level are not exported
- **WHEN** the served level is `Information` and a client writes a Debug record
- **THEN** the record appears in the console and is not exported

#### Scenario: A frontend logger record is exported
- **WHEN** a Blazor page logs a Warning through `ILogger` during a navigation
- **THEN** an exported record with Warning severity and the navigation's trace id is produced

#### Scenario: Export activity produces no exported log records
- **WHEN** the frontend exports a batch through its HTTP client
- **THEN** no log record about that export call is exported

### Requirement: Backend payloads are logged only at Trace level
The clients SHALL log request and response bodies of their calls to the backend only at Trace level, each truncated to 4 KB, and SHALL NOT export bodies of calls to other hosts at any level.

#### Scenario: A backend response body is exported at Trace level
- **WHEN** the served level is `Trace` and the extension calls a backend endpoint
- **THEN** a Trace record with the response body truncated to 4 KB is exported

#### Scenario: A backend body is not exported at Debug level
- **WHEN** the served level is `Debug` and the extension calls a backend endpoint with a distinctive value in the body
- **THEN** no exported record contains that value

#### Scenario: An eBay response body is never exported
- **WHEN** the served level is `Trace` and the extension receives an eBay API response containing a distinctive value
- **THEN** no exported record contains that value

### Requirement: Client telemetry contains no secrets or query strings
Exported client spans and log records SHALL NOT contain HTTP headers, access or refresh tokens, OAuth authorization codes, client secrets, entered form values, or URL query strings, regardless of level.

#### Scenario: A token and query string are not exported by the extension
- **WHEN** the served level is `Trace` and the extension calls the backend with an `Authorization` header and a query string containing a distinctive value
- **THEN** no exported span or record contains the token, that value or its parameter name

#### Scenario: A query string is not exported by the frontend
- **WHEN** the served level is `Trace` and the frontend calls the backend with a query string containing a distinctive value
- **THEN** no exported span or record contains that value or its parameter name

### Requirement: Client errors are logged and recorded on spans
An error caught by client code, an uncaught error and an unhandled promise rejection or task exception from client code SHALL each be exported as an Error-or-higher record carrying the exception type, message and stack trace, and SHALL mark the active span with error status and an exception event.

#### Scenario: An extension processing error becomes an error log and an error span
- **WHEN** an extension site processor catches an error while processing a lot page
- **THEN** an Error record with type, message and stack trace is exported and the processor span has error status and an exception event

#### Scenario: An unhandled rejection in the extension is logged
- **WHEN** extension code rejects a promise that nothing handles on a processed page
- **THEN** an Error record with the rejection reason is exported in the page trace

#### Scenario: An unhandled frontend render exception is logged
- **WHEN** a Blazor component throws during rendering in the browser
- **THEN** an Error-or-higher record with the exception type and message is exported in the current navigation's trace

### Requirement: Telemetry export never disturbs the client
Clients SHALL export in batches below 1 MiB, keep at most 2048 pending items (dropping the oldest), and never start a login: without a valid token a batch is dropped. A failed export is dropped without retry. Export calls carry no trace context. Dropped item counts SHALL be reported with the next successful batch.

#### Scenario: Extension export without a token does not start a login
- **WHEN** the extension has telemetry to export and no valid stored backend token
- **THEN** the batch is dropped, no authorization redirect happens and page processing continues

#### Scenario: Frontend export without a token does not start a login
- **WHEN** the frontend has telemetry to export and no access token is available
- **THEN** the batch is dropped and no authorization redirect happens

#### Scenario: A failed extension export is dropped and counted
- **WHEN** an extension export is answered `502` and a later export succeeds
- **THEN** the failed batch is not sent again and the later batch reports the dropped item count

#### Scenario: A failed frontend export is dropped and counted
- **WHEN** a frontend export is answered `502` and a later export succeeds
- **THEN** the failed batch is not sent again and the later batch reports the dropped item count

#### Scenario: Extension export calls carry no trace context
- **WHEN** the extension posts a telemetry batch to the relay
- **THEN** the request carries no `traceparent` header

#### Scenario: Frontend export calls carry no trace context
- **WHEN** the frontend posts a telemetry batch to the relay
- **THEN** the request carries no `traceparent` header

#### Scenario: Large frontend batches are split
- **WHEN** the frontend has more than 1 MiB of pending telemetry
- **THEN** it is posted as several batches, each below 1 MiB

### Requirement: Pending telemetry leaves the page when it is hidden
When a page becomes hidden or is unloaded, a client SHALL hand all pending records over for export without waiting for the batch interval. When the page is unloaded, the extension SHALL first end its page root span if it is still open. A page that is only hidden (e.g. a lot opened in a background tab) keeps its root span open.

#### Scenario: Extension records leave the tab when it is hidden
- **WHEN** a processed page with unsent spans becomes hidden
- **THEN** the pending records are handed to the background worker in the same event handler, and the root span stays open

#### Scenario: An unloaded page ends its root span
- **WHEN** a processed page whose root span is still open is unloaded
- **THEN** the root span is ended and handed to the background worker in the same event handler

#### Scenario: Frontend records are exported when the tab is hidden
- **WHEN** the frontend tab becomes hidden with unexported spans
- **THEN** an export starts without waiting for the batch interval

### Requirement: Client errors are not stored in the database
The backend SHALL NOT offer an endpoint for storing client error reports and SHALL NOT keep a client error table; `POST /api/ebay/v1/error/` SHALL answer `404`.

#### Scenario: The old error endpoint no longer exists
- **WHEN** an authenticated client posts an error report to `/api/ebay/v1/error/`
- **THEN** the response is `404`
