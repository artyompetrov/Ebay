# Proposal

## Why

The scraping sources go through a mobile proxy (mobileproxy.space), and the target sites sit behind Cloudflare, whose addresses Roskomnadzor throttles with TSPU (DPI) on some carrier exit IPs and not on others. On a throttled exit IP the TLS handshake and response headers pass, and then the body freezes until the 100 s `HttpClient` timeout: chipfind.ru collection failed on every run for a whole day this way, while the same proxy on another exit IP works. The proxy provider exposes a link that switches the exit IP, so the system can look for a working exit IP itself instead of failing run after run.

## What Changes

- Before each collection, every scraping source (qrz.ru, chipfind.ru, newaudioportal.com) probes its site's main page through the proxy. A probe passes only on a 2xx response whose whole body arrives within a short timeout, because TSPU throttling shows up as a body that stops after the first kilobytes.
- When the probe fails and an IP change link is configured, the system calls the link, waits, and probes again, up to a configured number of IP changes (default 20). The first passing probe ends the loop, and the collection runs on that exit IP, which then stays in use for the next sources and runs for as long as their probes pass.
- When every attempt fails, the source's collection ends with an error result (the monitoring run logs it and goes on to the next source, as it already does for collection errors), without requesting the feed.
- Without an IP change link, the probe runs once and a failure ends the collection with an error instead of hanging on the feed for 100 s. Without a proxy address, there is no probe and behavior is unchanged.
- New settings in the `ScrapingProxy` section: `ChangeIpUrl` (secret: it carries the provider's proxy key), `MaxIpChangeAttempts` (default 20), `ProbeTimeout` (default 45 s), `IpChangeDelay` (default 10 s), validated at startup. The IP change link never appears in logs or traces.
- **BREAKING** (internal): an unreachable proxy now ends a collection with an error result from the probe instead of an `HttpRequestException` thrown from the first feed request.

## Capabilities

### New Capabilities
<!-- None: probing and exit IP rotation are part of how scraping traffic uses the proxy. -->

### Modified Capabilities
- `scraping-proxy`: adds the pre-collection probe, exit IP rotation through the provider's link, the new settings and their validation, and changes how an unreachable proxy fails a collection.

## Impact

- Code: `Server.Adapters.Driven.ScrapingProxy` (options, a new exit guard service and the IP change HTTP client), `Server.Adapters.Driven.Qrz`, `Server.Adapters.Driven.ChipFind`, `Server.Adapters.Driven.NewAudioPortal` (call the guard before collecting, main page URI per adapter).
- Tests: `Tests.Unit` (guard tests with fake handlers and a fake time provider, options validation, updated adapter proxy tests).
- Deploy: `deploy/docker-compose.yaml` passes `SCRAPING_PROXY_CHANGE_IP_URL`; `deploy/localhost.env.example` lists it empty. The operator adds the link to `server.env`, and turns off the provider's timer-based IP change so a good exit IP is kept.
- Docs: `src/Ebay/AGENTS.md` (scraping proxy bullet).
- No API, DB or contract changes.
