# Tasks

## 1. Shared proxy library

- [ ] 1.1 Create `src/Ebay/Server.Adapters.Driven.ScrapingProxy` (added to `Ebay.slnx`) with `ScrapingProxyOptions` (section `ScrapingProxy`: `Address`, `Username`, `Password`, `IValidatableObject` rules from the spec) and the idempotent `AddScrapingProxyOptions()` (design D1, D3). Verify with `ScrapingProxyOptionsTests` (`[TestOf(typeof(ScrapingProxyOptions))]`) covering every scenario of the `scraping-proxy` requirement "Invalid proxy settings fail startup", tagged `[OpenSpecScenario]`.
- [ ] 1.2 Add `UseScrapingProxy(this IHttpClientBuilder)` returning a `SocketsHttpHandler` with `WebProxy` + `NetworkCredential` when an address is set, `UseProxy = false` otherwise, and `PooledConnectionLifetime` of 2 minutes (design D1-D4, Risks). Verify that `dotnet build` succeeds with ReferenceTrimmer clean and that `ArchitectureTest` passes.

## 2. Adapters

- [ ] 2.1 In `Server.Adapters.Driven.Qrz`, reference the new library, call `AddScrapingProxyOptions()` and `.UseScrapingProxy()` on the `qrz` named client. Verify with tests in `QrzAdapterTests` using a loopback stub proxy (design D6) covering the "qrz.ru request is tunnelled through the proxy with credentials", "Proxy without credentials" and "Unreachable proxy fails the qrz.ru collection" scenarios, tagged `[OpenSpecScenario]`.
- [ ] 2.2 In `Server.Adapters.Driven.ChipFind`, add `WellKnown.HttpClientName = "chipfind"`, replace `services.AddHttpClient()` with `services.AddHttpClient(WellKnown.HttpClientName).UseScrapingProxy()`, call `AddScrapingProxyOptions()`, and use the constant in `ChipfindAdapter` (design D5). Verify with a `ChipfindAdapterTests` test using the stub proxy for "chipfind.ru request is tunnelled through the proxy with credentials", tagged `[OpenSpecScenario]`, and with the existing chipfind tests still passing.
- [ ] 2.3 Add registration tests (handler inspection via `IHttpMessageHandlerFactory`, design D6) for "No proxy address configured" and "Unrelated HTTP client ignores the scraping proxy", tagged `[OpenSpecScenario]`. Verify they pass with `dotnet test` on `Tests.Unit`.
- [ ] 2.4 Update `src/Ebay/AGENTS.md`: add `Server.Adapters.Driven.ScrapingProxy` next to `Server.Adapters.Driven.PostgreSql` as a shared driven library, and mention the `ScrapingProxy` section in the sale advertisement sources bullet. Verify by reading the diff.

## 3. Deploy configuration

- [ ] 3.1 In `deploy/docker-compose.yaml`, pass `ScrapingProxy__Address=${SCRAPING_PROXY_ADDRESS:-}`, `ScrapingProxy__Username=${SCRAPING_PROXY_USERNAME:-}`, `ScrapingProxy__Password=${SCRAPING_PROXY_PASSWORD:-}` to `ebay_helper`, and add the three variables (empty) to `deploy/localhost.env.example`. Verify with `docker compose --env-file deploy/localhost.env.example -f deploy/docker-compose.yaml config` showing the three variables with empty values, if Docker is available; otherwise by reading the diff.

## 4. Integration checks

- [ ] 4.1 Run `./scripts/agent-check/agent-check.sh` from the repository root and verify it passes (build, tests, OpenSpec validation and scenario coverage).

## Workflow follow-up

- Before deploying, add `SCRAPING_PROXY_ADDRESS`, `SCRAPING_PROXY_USERNAME`, `SCRAPING_PROXY_PASSWORD` to `server.env` on the production server.
- After deploy, check in Loki/Tempo that the next qrz and chipfind runs succeed through the proxy.
- Sync the `scraping-proxy` spec and archive the change, then rerun `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh`.
