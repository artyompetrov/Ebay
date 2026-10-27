# Design

## Context

- `Server.Adapters.Driven.ScrapingProxy` is a shared driven library, not an adapter. It holds `ScrapingProxyOptions` (the `ScrapingProxy` section), the idempotent `AddScrapingProxyOptions()`, and `UseScrapingProxy()`, which gives an adapter's named `HttpClient` a `SocketsHttpHandler` with the proxy, or with `UseProxy = false` when no address is set.
- The qrz, chipfind and newaudioportal adapters each register their own named client (`qrz`, `chipfind`, `newaudioportal`) with `UseScrapingProxy()`. Qrz and newaudioportal set a browser `User-Agent` on it; chipfind does not.
- `SaleAdvertisementMonitoringService` runs the adapters one after another. An adapter reports an expected collection failure as the `Error<string>` case of `GetRecentAdvertisementsAsync`, which the service logs at Error before going on to the next source. A thrown exception is logged the same way.
- Production code must not `throw` (analyzer `EBAY0001`): expected failures are `OneOf` results.
- The provider's IP change link is `GET https://changeip.mobileproxy.space/?proxy_key=<key>&format=json`. It answers JSON with `status`, `code`, `new_ip`, `rt`, `message` and `proxy_id`, wants a browser `User-Agent`, rejects the same request repeated within 3-5 s, and does not document how long the change takes.

## Goals / Non-Goals

**Goals:**
- One shared probe-and-rotate routine for all scraping adapters, so each adapter only names its main page.
- A throttled exit IP is detected in seconds, not after a 100 s feed timeout.
- Easy to test without network or real waits.

**Non-Goals:**
- No probe before later requests of the same collection (contact pages, listing pages): one probe per collection.
- No rotation in the middle of a collection, when a later request fails.
- No use of the provider's other API commands (`proxy_ip`, `get_my_proxy`), which need an API token.
- No parsing of the IP change response for control flow: its codes are undocumented. It is read only to log `new_ip`.

## Decisions

### D1. An exit guard service in the ScrapingProxy library, called explicitly by each adapter

`IScrapingProxyExitGuard.EnsureWorkingExitAsync(string httpClientName, Uri probeUri, CancellationToken)` returns `OneOf<Success, Error<string>>`. Each adapter calls it first in `GetRecentAdvertisementsAsync` with its own named client and main page URI, and on `Error` returns that error at once.

- It uses the adapter's own named client, so the probe goes through the same proxy and with the same `User-Agent` as the collection.
- An interface, so adapter unit tests that build the adapter directly pass a passing fake.
- Alternatives:
  - A `DelegatingHandler` on the named clients: sees single requests, not a collection, so it can't run "once before a collection" and would probe before every contact page.
  - Calling it from `SaleAdvertisementMonitoringService`: the application would have to know about proxies and main page URIs, which are adapter details.
  - A decorator around `ISaleAdvertisementAdapter`: still needs a per-adapter main page and registration plumbing for every adapter. The explicit call is one line per adapter.

### D2. Probe = GET of the main page, fully read under a linked timeout

- The probe sends `GET probeUri` with `HttpCompletionOption.ResponseHeadersRead`, checks for a 2xx status, then copies the body to `Stream.Null`.
- The whole probe runs under `new CancellationTokenSource(ProbeTimeout, timeProvider)` (the injected `TimeProvider`), linked with the caller's token through `CreateLinkedTokenSource`.
- A timeout, an `HttpRequestException` or a non-2xx status are probe failures, recorded with a short reason (`status 403`, `timeout after 15 s`, `connection error: ...`).
- Cancellation of the caller's token is not a probe failure. The framework's `OperationCanceledException` is not caught (the `catch` filters on the probe token having fired while the caller's token has not) and propagates out of the collection. That matters because the service only suppresses *exceptions* after cancellation: an `Error<string>` returned on shutdown would be logged at Error.
- Reading the whole body is the point: TSPU passes the headers and the first kilobytes. Checking headers only, or using `HEAD`, would pass on a throttled IP.
- The qrz (~160 KB) and newaudioportal (~250 KB) main pages are well above the ~16 KB where throttling shows up. chipfind's page size behind the Cloudflare challenge could not be checked from a datacenter IP (see Risks).

### D3. Rotation loop as a Polly retry pipeline

The project's rule is that retries go through Polly (8.x is already in the solution), not hand-written loops. The probe is one attempt; a `ResiliencePipeline<ProbeResult>` holds the rotation:
- `ShouldHandle`: the outcome is a failed probe (cancellation exceptions are not handled, so they propagate).
- `MaxRetryAttempts = MaxIpChangeAttempts`, `BackoffType = Constant`, `Delay = IpChangeDelay`, `UseJitter = false`.
- `OnRetry`: requests the IP change link (the IP change happens before the delay, so the provider has the delay to switch).
- The builder's `TimeProvider` is the injected one, so `FakeTimeProvider` drives the delays in tests.
- The pipeline is built once per guard (it is immutable and thread-safe) when a link is configured. Without a link, the guard probes once without the pipeline.

The flow:

```
probe
  pass -> Success
  fail -> no ChangeIpUrl -> Error("probe of <uri> failed: <reason>")
          ChangeIpUrl    -> for attempt 1..MaxIpChangeAttempts:
                              request ChangeIpUrl (failure: Warning, still counts)
                              wait IpChangeDelay (TimeProvider)
                              probe -> pass: Information "passed after N IP changes", Success
                          -> Error("probe of <uri> failed after N IP changes: <last reason>")
```

- No proxy address: `Success` at once, without a probe.
- The guard is a stateless singleton. The adapters run one after another in a run, so two rotations never overlap. The guard does not lock, and that is noted in a comment.
- After a successful probe, the pooled connection stays and the collection reuses it. A failed probe's connection is torn down by the cancellation or error. `PooledConnectionLifetime` (2 min) already makes sure later connections pick up a new exit IP.

### D4. The IP change client is a separate, unproxied named client

- `scraping-proxy-change-ip` is registered by `AddScrapingProxy()`: browser `User-Agent`, `Timeout` 10 s, `RemoveAllLoggers()`, and no `UseScrapingProxy()`.
- The browser `User-Agent` moves to one public constant in the ScrapingProxy library (`ScrapingProxyDefaults.BrowserUserAgent`), used by the three adapters' clients and the IP change client, replacing the copies in the qrz and newaudioportal `WellKnown`.
- The provider's link must work even when the proxy's current exit IP is broken, and it is the provider's own API, not a scraped site.
- `RemoveAllLoggers()` keeps the `IHttpClientFactory` request logs from printing the URI. They redact the query by default in .NET 9+, but the key must never be one setting away from the logs.
- On .NET 10 the `HttpClient` activity (which the OpenTelemetry instrumentation 1.18 uses) redacts the query in `url.full` by default, so the client span shows `proxy_key=*`. A test listens to every `ActivitySource` during a rotation on real registrations and checks that no tag carries the key.
- The guard's own logs, spans, warning reasons and `Error<string>` texts never include the link: they name only the attempt, the probe URI and `new_ip`. An exception from the IP change request is logged by type and `HttpRequestError`, not by message, since a message could carry the URI.

### D5. Options

New `ScrapingProxyOptions` members:

| Member | Default | Rule |
|---|---|---|
| `ChangeIpUrl` | none | absolute `http`/`https`; needs `Address` |
| `MaxIpChangeAttempts` | 20 | 1-100 |
| `ProbeTimeout` | 15 s | positive |
| `IpChangeDelay` | 10 s | at least 5 s (the provider rejects a repeated request within 3-5 s) |

- They are bound from `ScrapingProxy__ChangeIpUrl`, `__MaxIpChangeAttempts`, `__ProbeTimeout`, `__IpChangeDelay`.
- `PrintMembers` masks `ChangeIpUrl` as `***`, as it already does for `Password`.
- The defaults are member initializers, so a missing setting keeps them.
- Only `ChangeIpUrl` is passed by docker-compose (`SCRAPING_PROXY_CHANGE_IP_URL`). The numbers keep their defaults unless set by hand.
- `AddScrapingProxyOptions()` is renamed to `AddScrapingProxy()`, because it now also registers the guard, the IP change client and `TimeProvider.System` (`TryAddSingleton`). It stays idempotent.

### D6. Main page URIs

- Qrz and newaudioportal already have `WellKnown.BaseUri` (`https://www.qrz.ru/`, `https://newaudioportal.com/`).
- Chipfind gets `WellKnown.BaseUri = https://www.chipfind.ru/`, and its feed URL is built from it.
- Chipfind's named client also gets the browser `User-Agent`, since a probe without it would be challenged by Cloudflare more often than the feed request is today. This is a small behavior change of the feed request. It matches the other two adapters.

### D7. Observability

- Each probe is a span `scraping-proxy.probe` (`ActivitySource` `Server.Adapters.Driven.ScrapingProxy`, picked up by the existing `Server.*` pattern), tagged with `url.full` of the probe, `attempt` and `probe.bytes`, and marked as an error on failure.
- Each IP change is a span `scraping-proxy.change-ip`, tagged with `attempt` and `new_ip` when the response has one.
- Logs:
  - Warning for each failed probe (probe URI, attempt, reason).
  - Warning for a failed IP change request.
  - Information for each IP change with `new_ip`.
  - Information when a probe passes after at least one IP change.
- The final failure is the `Error<string>` that the service already logs at Error.

### D8. Tests

- Guard tests (`ScrapingProxyExitGuardTests`) build the guard with a fake `IHttpClientFactory` that hands out recording `HttpMessageHandler`s per client name, and a `FakeTimeProvider` (`Microsoft.Extensions.TimeProvider.Testing`) that the test advances to pass the delays and the probe timeout (the stalled body test advances it by `ProbeTimeout` while the response stream is stalled).
- The leak tests (logs and spans) run on real registrations (`AddScrapingProxy()` + an adapter, a recording logger provider, an `ActivityListener` on all sources), with the primary handlers of the adapter and IP change clients replaced by recording handlers (the last `ConfigurePrimaryHttpMessageHandler` wins), so the factory's logging handlers are in the pipeline.
- "Each source probes its own main page" also uses real registrations with recording primary handlers, because `StubProxy` sees only `CONNECT host:443`, the same for the probe and the feed.
- Adapter tests: the stub proxy tests (`*_ProxyWithCredentials_TunnelsThroughProxyWithBasicCredentials` for all three adapters and the qrz `ProxyWithoutCredentials` test) keep their `CONNECT` assertions, because the probe is the first request through the proxy, but now expect an error result instead of `HttpRequestException` (the stub's `502` fails the probe and no link is configured). The unreachable proxy test changes the same way.
- Existing parsing tests pass a passing fake guard.

## Risks / Trade-offs

- [chipfind.ru's main page may be challenged by Cloudflare on mobile IPs where the feed is not, or be smaller than ~16 KB, so a throttled IP could pass] → After deploy, check `scraping-proxy.probe` spans for chipfind (status, `probe.bytes`) next to the feed result. If the main page doesn't predict the feed, switch chipfind's probe URI to another small page. This is a constant in one adapter.
- [Worst case per source is 20 × (15 s probe + 10 s delay + 10 s IP change timeout) + 15 s ≈ 12 min, three sources ≈ 36 min] → It happens only when no exit IP works, which is already a failed run. Runs never overlap: the background task waits its 30 min interval after a run ends, so a long run only delays the next one. The numbers are settings.
- [Rotating for one site moves the shared exit IP for the others] → The adapters run one after another and each probes before collecting, so the next source either keeps the new IP or rotates further. Accepted.
- [The provider's timer-based IP change would drop a good exit IP] → Deploy note: turn it off in the provider dashboard.
- [The `IHttpClientFactory` handler may hold a pooled connection whose tunnel was opened on the old exit IP] → The probe runs over that same pool, so a stale tunnel fails the probe and gets torn down. A passing probe means the pool works.

## Migration Plan

1. Deploy as usual. Without `SCRAPING_PROXY_CHANGE_IP_URL`, the only change is that one probe runs before each collection.
2. Add `SCRAPING_PROXY_CHANGE_IP_URL=https://changeip.mobileproxy.space/?proxy_key=<key>&format=json` to `server.env` and redeploy. Turn off the timer-based IP change in the provider dashboard.
3. Rollback: remove the variable (no rotation) or revert the PR. There is no state to migrate.
