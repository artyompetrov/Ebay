# Tasks

## 1. Options

- [x] 1.1 Add `ChangeIpUrl`, `MaxIpChangeAttempts` (20), `ProbeTimeout` (15 s), `IpChangeDelay` (10 s) to `ScrapingProxyOptions` with the validation rules of the `scraping-proxy` requirement "Invalid proxy settings fail startup" (validation messages never include the link), and mask `ChangeIpUrl` in `PrintMembers` (design D5). Verify with `ScrapingProxyOptionsTests` covering every scenario of that requirement and "Settings text hides the IP change link", tagged `[OpenSpecScenario]`.

## 2. Shared library

- [x] 2.1 Add `Polly` to the ScrapingProxy project and `Microsoft.Extensions.TimeProvider.Testing` to `Directory.Packages.props` and `Tests.Unit`. Verify that `dotnet build` of the solution succeeds.
- [x] 2.2 Move the browser `User-Agent` to a public `ScrapingProxyDefaults.BrowserUserAgent` constant and use it in the qrz and newaudioportal clients instead of their `WellKnown.UserAgent` copies (design D4). Verify that the existing qrz/newaudioportal tests pass.
- [x] 2.3 Rename `AddScrapingProxyOptions()` to `AddScrapingProxy()` and update its three adapter call sites. Register the unproxied `scraping-proxy-change-ip` client there (browser `User-Agent`, 10 s timeout, `RemoveAllLoggers()`) and `TimeProvider.System` (`TryAddSingleton`) (design D4, D5). Verify with a `ScrapingProxyRegistrationTests` test for "IP change link is requested directly with a browser User-Agent", tagged `[OpenSpecScenario]`, and the existing registration tests passing.
- [x] 2.4 Implement the probe in `ScrapingProxyExitGuard` (design D2) and register `IScrapingProxyExitGuard` in `AddScrapingProxy()`. Verify with `ScrapingProxyExitGuardTests` (fake handlers + `FakeTimeProvider`, design D8) for "Non-success status fails the probe", "Body that stops arriving fails the probe", "Unreachable site fails the probe" and "Failed probe without an IP change link", tagged `[OpenSpecScenario]`.
- [x] 2.5 Implement the rotation as a Polly retry pipeline (design D3) with spans and logs (design D7). Verify with `ScrapingProxyExitGuardTests` for "Passing first probe keeps the current exit IP", "Probe passes after several IP changes", "Failed IP change request still counts as an attempt" and "Cancellation ends the rotation without an error result", tagged `[OpenSpecScenario]`.
- [x] 2.6 Verify the secret stays hidden on real registrations (design D8) with tests for "Rotation logs do not contain the proxy key" and "Rotation traces do not contain the proxy key", tagged `[OpenSpecScenario]`.

## 3. Adapters

- [x] 3.1 Chipfind: add `WellKnown.BaseUri` and the browser `User-Agent` on its named client, build the feed URL from `BaseUri`, inject the guard, and call it first in `GetRecentAdvertisementsAsync` (design D1, D6). Verify with `ChipfindAdapterTests` for:
  - "Passing probe is followed by the collection";
  - "Every IP change is used up";
  - "No proxy address, no probe";
  - the existing chipfind stub proxy test, now expecting an error result instead of `HttpRequestException`, still covering "chipfind.ru request is tunnelled through the proxy with credentials".

  All are tagged `[OpenSpecScenario]`, and the existing parsing tests pass a passing fake guard.
- [x] 3.2 Qrz and NewAudioPortal: inject the guard and call it first with `WellKnown.BaseUri`. Verify with:
  - a test for "Each source probes its own main page" (all three adapters on real registrations with recording primary handlers, design D8);
  - the qrz and newaudioportal stub proxy tests (credentials, and qrz without credentials) expecting an error result instead of `HttpRequestException`;
  - the "Unreachable proxy fails the qrz.ru collection" test expecting an error result;
  - the remaining qrz/newaudioportal tests passing.
- [x] 3.3 Update `src/Ebay/AGENTS.md` (sale advertisement sources and the `Server.Adapters.Driven.ScrapingProxy` bullets: `AddScrapingProxy()`, the guard, the shared `User-Agent`, the new settings). Verify by reading the diff.

## 4. Deploy configuration

- [x] 4.1 Pass `ScrapingProxy__ChangeIpUrl=${SCRAPING_PROXY_CHANGE_IP_URL:-}` to `ebay_helper` in `deploy/docker-compose.yaml` and add `SCRAPING_PROXY_CHANGE_IP_URL=` to `deploy/localhost.env.example`. Verify by reading the diff (and `docker compose config` if Docker is available).

## 5. Integration checks

- [x] 5.1 Run `make agent-check` from the repository root and verify it passes (build, tests, OpenSpec validation and scenario coverage).

## Workflow follow-up

- Add `SCRAPING_PROXY_CHANGE_IP_URL` to `server.env` on the production server and turn off the provider's timer-based IP change.
- After deploy, check `scraping-proxy.probe` / `scraping-proxy.change-ip` spans and chipfind collection results in Tempo/Loki, and confirm the chipfind main page predicts the feed (design Risks).
- Sync the `scraping-proxy` spec and archive the change, then rerun `make openspec-coverage-check`.
