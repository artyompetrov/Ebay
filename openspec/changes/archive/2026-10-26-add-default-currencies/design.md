# Design

## Decisions

1. **Application service + startup hosted service.** `DefaultCurrencyService.AddMissingDefaultCurrenciesAsync` (application layer, one unit of work) adds the missing currencies; `DefaultCurrenciesHostedService` (driving background-tasks adapter) calls it from `StartAsync`. It is registered before `CurrencyRateBackgroundTask`; hosted services start one after another, so the first rate refresh already sees the added currencies.
2. **Runs in every environment, adds only what is missing.** Production already has its currencies, so nothing changes there; a new deployment gets working defaults and the rate refresh replaces the placeholder rates within its first run. Local runs keep the placeholders (`IsLocalRun` disables the refresh).
3. **The list:** `USD` (base of all rates), `RUB` (target currency of the UI and notifications), `EUR`, `GBP`, `AUD`, `CAD` (eBay marketplaces the extension works with) and `KZT` (shipping from Astana). The ISO code is the eBay name and the rate-source name, as for the existing currencies.
4. **Placeholder date 1970-01-01** instead of "now": the currency page shows that the rate has never been refreshed, and nothing treats the placeholder as fresh.

## Risks / Trade-offs

- [A placeholder rate is approximate] → only until the first refresh in production; locally prices are approximate anyway, since rates are never refreshed there.
