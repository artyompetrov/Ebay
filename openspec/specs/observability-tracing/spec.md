# observability-tracing Specification

## Purpose
Defines which backend activity is recorded as distributed traces, what is excluded from tracing, which data a trace must never contain, and how long traces stay queryable for people and the coding agent.

## Requirements

### Requirement: Incoming API requests are traced
The backend SHALL record a server span for every incoming HTTP request that is not excluded from tracing. The span SHALL carry the HTTP method, the matched route template and the response status code. Every such request SHALL be recorded, even when the caller marks its trace context as not sampled.

#### Scenario: An API request produces a server span
- **WHEN** an authenticated client calls an API endpoint while spans are being collected
- **THEN** exactly one server span is recorded for that request, carrying the HTTP method, the route template and the response status code

#### Scenario: A request marked as not sampled is still recorded
- **WHEN** a client calls an API endpoint with a `traceparent` header whose sampled flag is off, while spans are being collected
- **THEN** a server span is recorded for that request in the trace given by the header

### Requirement: Infrastructure and static requests are not traced
The backend SHALL NOT record spans for requests to the health check endpoint, to `/.well-known/` paths, to static frontend paths (under `/_framework/` or `/_content/`) or to files with a static asset extension (`.js`, `.css`, `.wasm`, `.map`, `.ico`, `.png`, `.jpg`, `.svg`, `.woff`, `.woff2`, `.ttf`, `.otf`, `.eot`).

#### Scenario: Health check is not traced
- **WHEN** a client calls `/api/health` while spans are being collected
- **THEN** no span is recorded for that request

#### Scenario: Static frontend file is not traced
- **WHEN** a client requests a file under `/_framework/` while spans are being collected
- **THEN** no span is recorded for that request

#### Scenario: Static asset by extension is not traced
- **WHEN** a client requests `/favicon.ico` while spans are being collected
- **THEN** no span is recorded for that request

#### Scenario: Well-known path is not traced
- **WHEN** a client requests `/.well-known/openid-configuration` while spans are being collected
- **THEN** no span is recorded for that request

### Requirement: Database commands are traced inside their request
The backend SHALL record a client span for every database command it executes inside a request or application span, as a child of that span. The span SHALL carry the SQL statement text and SHALL NOT carry parameter values.

#### Scenario: A request that reads the database has a nested database span
- **WHEN** a client calls an API endpoint that reads the database while spans are being collected
- **THEN** at least one database span is recorded in the same trace as the request's server span, with that server span as an ancestor

#### Scenario: Database spans contain no parameter values
- **WHEN** a client calls an API endpoint that runs a parameterized query with a distinctive parameter value sent in the request body, while spans are being collected
- **THEN** no attribute of any database span in that request's trace contains that parameter value

### Requirement: Database commands outside any span are not recorded
The backend SHALL NOT record a database command that runs without an active request or application span (for example background polling), so that such commands do not create traces of their own.

#### Scenario: A database command without a parent span is dropped
- **WHEN** the backend executes a database command with no active span while spans are being collected
- **THEN** no span is recorded for that command

### Requirement: Outgoing HTTP calls are traced
The backend SHALL record a client span for every outgoing HTTP call made through its HTTP clients, as a child of the span that was active when the call was made, carrying the HTTP method, the target host and the response status code.

#### Scenario: An outgoing call produces a client span
- **WHEN** the backend makes an outgoing HTTP call through one of its HTTP clients inside an active span while spans are being collected
- **THEN** a client span is recorded in the same trace as a child of the active span, carrying the method, the target host and the response status code

### Requirement: Application spans are exported
The backend SHALL export the spans emitted by every one of its own span sources, which are named with the `Server.` prefix. This includes the chipfind adapter, the qrz adapter and the sale-advertisement monitoring pipeline.

#### Scenario: Spans from every application source are recorded
- **WHEN** a span is started on each of the `Server.Adapters.Driven.ChipFind`, `Server.Adapters.Driven.Qrz` and `Server.Application.SaleAdvertisements` span sources while spans are being collected
- **THEN** each of those spans is recorded

### Requirement: Traces contain no credentials or query strings
Recorded spans SHALL NOT contain HTTP request or response headers or URL query strings, for both incoming and outgoing HTTP calls.

#### Scenario: Query string and authorization header are not recorded
- **WHEN** a client calls an API endpoint with a query string containing a distinctive value and an `Authorization` header while spans are being collected
- **THEN** no attribute of any span in that request's trace contains that query-string value, its parameter name or the `Authorization` header value

### Requirement: Traces are queryable for seven days
Recorded traces SHALL be stored and searchable, by trace id and by span attributes, through the Grafana instance for 7 days after they are recorded, including by the read-only account used by the agent's Grafana MCP server. Traces older than 7 days SHALL be deleted.

#### Scenario: Agent finds a recent trace
- **WHEN** the agent searches traces of the backend service through the Grafana MCP server within 7 days after a request was made in production
- **THEN** the trace of that request is returned and can be opened by its trace id
- **NOT COVERED BY TEST:** depends on the deployed Tempo, collector and Grafana containers and the production MCP account, which the test suites do not start; verified manually after deployment

#### Scenario: Old traces are removed
- **WHEN** a trace is older than 7 days
- **THEN** it is no longer returned by trace search or lookup by id
- **NOT COVERED BY TEST:** retention is enforced by the Tempo storage configuration in deployment, which the test suites do not run, and waiting 7 days is not feasible in a test

### Requirement: Background job runs are traced
Each run of a background job, periodic or run once at startup, SHALL be recorded as its own trace: a root span named after the job, with no parent even when the job was started inside another span. Work done during the run SHALL be recorded inside that trace. A run that fails SHALL mark its span as an error; a run stopped by application shutdown SHALL NOT.

#### Scenario: Each periodic job run is a separate trace
- **WHEN** a periodic background job runs twice while spans are being collected
- **THEN** two root spans named after the job are recorded, each in its own trace

#### Scenario: Work inside a run belongs to the run's trace
- **WHEN** a background job run starts a span of its own while spans are being collected
- **THEN** that span is recorded in the run's trace with the run's span as its parent

#### Scenario: A startup job run is its own trace
- **WHEN** the DB cache cleanup job runs at startup while an unrelated span is active, with spans being collected
- **THEN** a root span named after the job is recorded in a new trace, not under the unrelated span

#### Scenario: A failing run marks its span as an error
- **WHEN** a background job run throws an exception while spans are being collected
- **THEN** the run's span has error status

#### Scenario: A run stopped by shutdown is not an error
- **WHEN** a background job run is cancelled because the application is stopping, while spans are being collected
- **THEN** the run's span does not have error status
