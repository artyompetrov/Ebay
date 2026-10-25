# Spec Delta

## MODIFIED Requirements

### Requirement: Infrastructure and static requests are not traced
The backend SHALL NOT record spans for requests to the health check endpoint, to the client telemetry relay (`/api/telemetry/`), to `/.well-known/` paths, to static frontend paths (under `/_framework/` or `/_content/`) or to files with a static asset extension (`.js`, `.css`, `.wasm`, `.map`, `.ico`, `.png`, `.jpg`, `.svg`, `.woff`, `.woff2`, `.ttf`, `.otf`, `.eot`).

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

#### Scenario: Telemetry relay is not traced
- **WHEN** an authenticated client posts a trace batch to `/api/telemetry/v1/traces` while spans are being collected
- **THEN** no span is recorded for that request or for the relay's call to the collector

## REMOVED Requirements

### Requirement: Chrome extension calls from one page share a trace
**Reason**: The extension now records its own spans, and the `traceparent` it sends names a recorded client span instead of a random parent id. All client tracing rules for the extension and the Blazor frontend now live in one capability.
**Migration**: See `client-telemetry`, requirement "Extension backend calls are client spans that parent backend spans" (same trace per page load, different trace per page load, no `traceparent` to other hosts). Re-tag the tests that mapped the removed scenarios.
