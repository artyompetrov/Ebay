# Tasks

## 1. Data for the table

- [ ] 1.1 Add `WellKnown.CurrencyRate.TargetCurrency = "RUB"` to `src/Ebay/Server.Application/WellKnown.cs` next to `BaseCurrency` (verify: solution builds).
- [ ] 1.2 Extend `ProductInner` in `SaleAdvertisementMonitoringService` with `Name`, `RevenueAvgUsd` and `QuantityTotal`, filled in `GetProducts` from `ProductInfoView.Data` (verify: solution builds, existing `SaleAdvertisementMonitoringServiceTests` pass).
- [ ] 1.3 Inject `ICurrencyQueries` into `SaleAdvertisementMonitoringService` (both constructors) and load the RUB rate once per run in `ProcessRecentAdvertisementsAsync`; log a warning when it is missing (verify: DI resolves the service - app starts / existing DI tests pass).

## 2. Email table

- [ ] 2.1 In `ProcessAdvertisementAsync`, collect newly recorded interesting products in first-match order (no duplicates) and pass them with the rate to `SendNotificationAsync` (verify: covered by tests in 3.x).
- [ ] 2.2 Render the table below the matched lines: header `Товар | Оценка | Продано шт.`, HTML-encoded name, price as `"{rounded} RUB"` or `"{rounded} USD"` fallback with invariant culture and `MidpointRounding.AwayFromZero`, inline-styled `<table>` (verify: covered by tests in 3.x).

## 3. Tests

- [ ] 3.1 Add a fake `ICurrencyQueries` to the `TestContext` in `src/Ebay/Tests.Unit/SaleAdvertisementMonitoringServiceTests.cs`, with a settable RUB rate (verify: existing tests still pass).
- [ ] 3.2 Add tests tagged `[OpenSpecScenario("sale-advertisement-monitoring", "Notification lists notified products with their estimated prices", ...)]` for all four scenarios (verify: `dotnet test` on Tests.Unit passes).
- [ ] 3.3 Add a test tagged `[OpenSpecScenario("sale-advertisement-monitoring", "Estimated price falls back to USD without a RUB rate", "Missing RUB rate shows the price in dollars")]` (verify: `dotnet test` on Tests.Unit passes).

## 4. Checks

- [ ] 4.1 Run `openspec validate add-notification-price-table --strict` and `./scripts/agent-check/agent-check.sh` from the repo root (verify: both succeed).

## Workflow follow-up

- Sync specs and archive the change, then run `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh`.
