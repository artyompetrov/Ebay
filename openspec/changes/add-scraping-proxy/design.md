# Design

## Context

- `Server.Adapters.Driven.Qrz` registers a named client `qrz` (`WellKnown.HttpClientName`, browser User-Agent) and reads it through `IHttpClientFactory`. Its options are bound with `AddOptions<QrzAdapterOptions>().BindConfiguration("Qrz").ValidateDataAnnotations().ValidateOnStart()`.
- `Server.Adapters.Driven.ChipFind` calls `services.AddHttpClient()` and then `CreateClient("chipfind")` with a literal name that is never registered, so it gets a default, unconfigured client. Its options are a hard-coded `ChipFindAdapterOptions` singleton.
- Both adapters use hard-coded `https://` URLs, so through an HTTP proxy every request is a `CONNECT` tunnel.
- Adapter-to-adapter references are forbidden (`src/Ebay/AGENTS.md`), except shared driven libraries like `Server.Adapters.Driven.PostgreSql`, which several adapters reference for shared options (`AddPostgreSqlOptions()`, idempotent).
- Production config comes from `deploy/docker-compose.yaml` environment entries filled from `server.env` (`docker compose --env-file server.env` in `scripts/deploy-on-server/deploy-on-server.sh`).

## Goals / Non-Goals

**Goals:**
- One proxy setting shared by both scraping adapters, applied to their named HTTP clients only.
- Fail fast on misconfiguration; never leak the server IP by falling back to a direct connection.
- Testable without network access.

**Non-Goals:**
- Per-adapter proxies, proxy pools, or triggering the provider's IP rotation through its API.
- SOCKS or HTTPS (TLS-to-proxy) proxies; only plain `http://` proxies, as bought.
- Retrying or tuning timeouts for slow mobile links (the default `HttpClient` timeout of 100 s stays).
- Proxying any other outgoing traffic.

## Decisions

### D1. Shared library `Server.Adapters.Driven.ScrapingProxy`
A small project, following the `Server.Adapters.Driven.PostgreSql` precedent, holds:
- `ScrapingProxyOptions` (section `ScrapingProxy`): `Uri? Address`, `string? Username`, `string? Password`, implementing `IValidatableObject` for the rules in the spec (absolute `http` URI with a host, no user info, login and password both or neither, no credentials without an address).
- `AddScrapingProxyOptions(this IServiceCollection)`: idempotent `AddOptions<ScrapingProxyOptions>().BindConfiguration(...).ValidateOnStart()` (multiple calls register the binding once, guarded the same way as `AddPostgreSqlOptions()`).
- `UseScrapingProxy(this IHttpClientBuilder)`: `ConfigurePrimaryHttpMessageHandler(sp => ...)` that reads `IOptions<ScrapingProxyOptions>` and returns a `SocketsHttpHandler` with `UseProxy = true, Proxy = new WebProxy(address) { Credentials = new NetworkCredential(user, password) }` when an address is set, and `UseProxy = false` otherwise.

Both adapters call `services.AddScrapingProxyOptions()` and `.UseScrapingProxy()` on their named client.

Alternatives: putting the options in each adapter (duplicated validation and config keys, violates DRY); putting them in `Server.Platform` (it owns host-wide setup, not adapter transport, and adapters don't reference it); configuring `HttpClient.DefaultProxy` globally (would also proxy GeoIP, exchange rates and OTLP export, violating the spec).

### D2. `UseProxy = false` when no address is configured
`SocketsHttpHandler` otherwise picks up `HTTP_PROXY`/`HTTPS_PROXY` from the environment, which makes "direct" depend on the process environment (and, in the cloud sandbox, on the agent proxy). Explicitly disabling it makes the "no proxy" scenario deterministic and testable by inspecting the primary handler.

### D3. Credentials via `NetworkCredential`, not URI user info
`WebProxy` with `Credentials` lets .NET answer the proxy's `407 Basic` challenge. Keeping the password out of the URI also keeps it out of anything that logs or traces the address. The address is validated to contain no user info so there is exactly one way to pass credentials. Options are never logged.

### D4. No fallback
`SocketsHttpHandler` with an explicit `Proxy` never bypasses it for these hosts (no bypass list is set), so a proxy failure surfaces as `HttpRequestException` and the adapters' existing error handling applies (first-page failure fails the run; the monitoring service logs it and continues with the other sources).

### D5. Fix the chipfind named client
Add `WellKnown.HttpClientName = "chipfind"`, register it with `services.AddHttpClient(WellKnown.HttpClientName).UseScrapingProxy()`, and use the constant in `ChipfindAdapter`, replacing the bare `services.AddHttpClient()` and the string literals.

### D6. Testing
- Options rules: `ScrapingProxyOptionsTests` validating instances through `Validator.TryValidateObject` (as `QrzAdapterOptionsTests` does).
- Proxied scenarios: a loopback `TcpListener` stub proxy in `Tests.Unit` (port 0, per test, so tests stay parallel-safe) that records request heads, answers the first `CONNECT` with `407 Proxy-Authenticate: Basic` and the second with `502`, then closes. The test builds a `ServiceCollection` with in-memory configuration, calls `AddQrzAdapter()`/`AddChipFindAdapter()`, runs one collection, expects the `HttpRequestException`, and asserts the recorded `CONNECT` host and `Proxy-Authorization` value.
- Direct and "other clients" scenarios: resolve `IHttpMessageHandlerFactory.CreateHandler(name)`, walk `DelegatingHandler.InnerHandler` to the `SocketsHttpHandler`, and assert `UseProxy == false` / the proxy is not the scraping proxy.

## Risks / Trade-offs

- [Mobile proxy IP rotates mid-connection or connections pin to one exit IP] → `IHttpClientFactory` already recycles primary handlers every 2 minutes; set `PooledConnectionLifetime` to the same 2 minutes on the handler so long runs open fresh tunnels.
- [Mobile links are slow; the qrz run's 5 s delay plus proxy latency makes runs longer] → acceptable; the 20/30-minute periods have headroom. Revisit timeouts only if logs show them.
- [Proxy down stops both sources] → intended (no IP leak); failures are visible as warnings/errored spans in Loki/Tempo.
- [Operator forgets the variables] → the adapters silently go direct, as today. Acceptable for the first rollout; documented in the deploy notes.

## Migration Plan

1. Add `SCRAPING_PROXY_ADDRESS`, `SCRAPING_PROXY_USERNAME`, `SCRAPING_PROXY_PASSWORD` to `server.env` on the production server.
2. Merge; CI deploys. Compose maps them to `ScrapingProxy__Address`, `ScrapingProxy__Username`, `ScrapingProxy__Password` (with `:-` defaults so missing variables mean "direct").
3. Check in Loki/Tempo that the next qrz and chipfind runs succeed.
4. Rollback: clear `SCRAPING_PROXY_ADDRESS` in `server.env` and redeploy; no code rollback needed.
