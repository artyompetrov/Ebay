# Proposal

## Why

The qrz.ru and chipfind.ru adapters scrape third-party sites from the production server's own IP address, so a ban or rate limit on that IP stops sale advertisement monitoring. Mobile proxies have been bought to hide the server IP behind rotating carrier addresses; the adapters need a way to send their traffic through such a proxy, configured on the server before deploy.

## What Changes

- New `ScrapingProxy` configuration section with `Address` (absolute `http://host:port` URI), `Username` and `Password`, set through the environment (`ScrapingProxy__Address`, `ScrapingProxy__Username`, `ScrapingProxy__Password`).
- When `Address` is set, every HTTP request made by the qrz and chipfind adapters goes through that HTTP proxy (HTTPS targets via `CONNECT`), authenticating with the given login and password. A proxy failure fails the request; there is no silent fallback to a direct connection, since that would expose the server IP.
- When `Address` is empty, the adapters connect directly (local development and tests keep working without a proxy).
- Invalid settings (non-`http` or relative address, credentials inside the URI, a login without a password or the other way round, credentials without an address) fail host startup.
- Other outgoing HTTP clients (GeoIP, exchange rates, SMTP, OTLP export, etc.) are not proxied.
- The chipfind adapter gets a properly registered named HTTP client (today it asks for a `chipfind` client that is never configured), so the proxy can be attached to it.
- `deploy/docker-compose.yaml` passes `SCRAPING_PROXY_ADDRESS`, `SCRAPING_PROXY_USERNAME`, `SCRAPING_PROXY_PASSWORD` from the server env file to `ebay_helper`; `deploy/localhost.env.example` lists them empty.

## Capabilities

### New Capabilities
- `scraping-proxy`: routing of the marketplace-scraping adapters' outgoing HTTP traffic through an optional authenticated HTTP proxy, its configuration, validation and the guarantee of no direct fallback.

### Modified Capabilities
<!-- None: qrz-monitoring and chipfind-monitoring keep their parsing/paging/caching requirements unchanged; the transport is covered by the new capability. -->

## Impact

- Code: new shared library `src/Ebay/Server.Adapters.Driven.ScrapingProxy` (options + `IHttpClientBuilder` extension), `Server.Adapters.Driven.Qrz` and `Server.Adapters.Driven.ChipFind` registrations (`ServiceCollectionExtensions`, chipfind `WellKnown`/`ChipfindAdapter` client name).
- Tests: new tests in `Tests.Unit` with a local stub proxy (loopback TCP listener), no real network.
- Deploy: `deploy/docker-compose.yaml`, `deploy/localhost.env.example`; the operator adds the three variables to `server.env` on the server before deploying.
- Docs: `src/Ebay/AGENTS.md` (module list and the shared-library exception next to `Server.Adapters.Driven.PostgreSql`).
- No API, DB or contract changes.
