# Spec Delta

## ADDED Requirements

### Requirement: Email sending is traced
The backend SHALL record the work of its email client (connecting to the mail server, authenticating and sending a message) as spans in the trace that was active when the email was sent, with the active span as their ancestor. A step that fails SHALL have error status.

#### Scenario: A failed connection to the mail server is recorded
- **WHEN** the backend's email client tries to connect to a mail server that refuses the connection, inside an active span, while spans are being collected
- **THEN** a span of the email client is recorded in the same trace with the active span as its ancestor, and it has error status

### Requirement: Failed spans carry their exception
When an outgoing HTTP call fails with an exception, or an API request fails with an unexpected error, the backend SHALL record that exception on the span of the call or request, as an exception event carrying the exception type and message, and SHALL mark the span with error status.

#### Scenario: A failed outgoing call records its exception
- **WHEN** the backend makes an outgoing HTTP call inside an active span to an address that refuses the connection, while spans are being collected
- **THEN** the call's client span has error status and an exception event carrying the exception type

#### Scenario: A request that fails with an unexpected error records its exception
- **WHEN** an API endpoint fails with an unexpected exception while its server span is being recorded
- **THEN** the server span has error status and an exception event carrying that exception's type and message

### Requirement: Measurement content cache lookups are traced
Every lookup of measurement content (photo and thumbnail bytes, rendered plots) in the backend's in-memory content cache SHALL be recorded as a span that tells whether the content was served from the cache. Producing the content on a cache miss SHALL happen inside that span.

#### Scenario: A cache miss is recorded
- **WHEN** content that is not in the cache is requested while spans are being collected
- **THEN** a cache lookup span is recorded with a cache-hit attribute of `false`, and spans started while producing the content are its children

#### Scenario: A cache hit is recorded
- **WHEN** the same content is requested again while it is still cached, while spans are being collected
- **THEN** a cache lookup span is recorded with a cache-hit attribute of `true`

### Requirement: Chrome extension calls from one page share a trace
The Chrome extension SHALL send a W3C `traceparent` header, marked as sampled, with every call it makes to the backend. All backend calls made while the extension processes one loaded page SHALL carry the same trace id, each with its own parent span id, so the backend records them in one trace. Calls made while processing another page load SHALL use a different trace id. Calls to hosts other than the backend SHALL NOT carry a `traceparent` header.

#### Scenario: Backend calls from one page carry the same trace id
- **WHEN** the extension makes two calls to the backend while processing the same page
- **THEN** both calls carry a valid sampled `traceparent` header with the same trace id and different parent span ids

#### Scenario: Another page load gets another trace id
- **WHEN** the extension makes a backend call while processing one page load and another backend call while processing a different page load
- **THEN** the two calls carry different trace ids

#### Scenario: Calls to other hosts carry no trace context
- **WHEN** the extension calls a host other than the backend (for example the eBay API)
- **THEN** that call carries no `traceparent` header

## MODIFIED Requirements

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

#### Scenario: The startup signing key cleanup is its own trace
- **WHEN** the signing key cleanup job runs at startup while an unrelated span is active, with spans being collected
- **THEN** a root span named after the job is recorded in a new trace, not under the unrelated span

#### Scenario: A failing run marks its span as an error
- **WHEN** a background job run throws an exception while spans are being collected
- **THEN** the run's span has error status

#### Scenario: A run stopped by shutdown is not an error
- **WHEN** a background job run is cancelled because the application is stopping, while spans are being collected
- **THEN** the run's span does not have error status
