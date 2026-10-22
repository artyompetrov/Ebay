# Design

## Context

`SaleAdvertisementMonitoringService` loads all products once per run through `ProductService.GetAllProductsAsync` and keeps only `(ProductId, Regex, IsInteresting)` in its private `ProductInner` record. The email body is a hand-built HTML string in `SendNotificationAsync`. The estimate lives in `ProductInfo.CalculationResult` (`RevenueAvg` in USD, `QuantityTotal`). Currency rates are stored as "units per 1 USD" and read via `ICurrencyQueries.GetCurrencyRatesAsync` (keyed by currency id, e.g. `"RUB"`), the same source `LotPriceCalculator` uses. The Products page shows `RevenueAvg * rate["RUB"]`.

## Goals / Non-Goals

**Goals:**
- Same RUB figure as the Products page, so staff compare like with like.
- No extra DB queries per advertisement.

**Non-Goals:**
- Moving email rendering to a template engine.
- HTML-encoding the existing matched lines and contact (they stay as they are).
- Showing the listing price (`ListingPriceAvg`) or any other metric.

## Decisions

- **Carry the data in `ProductInner`.** Extend it with `Name`, `RevenueAvgUsd` and `QuantityTotal` taken from the already loaded `ProductInfoView`. Alternative: reload products per email - rejected, needless queries. Interesting products always have a calculation result (it is part of the `IsInteresting` rule), so notified rows never lack data.
- **Load the RUB rate once per run**, next to `GetProducts`, via `ICurrencyQueries` injected into the service (it is already a singleton-safe query with its own DbContext per call). Pass `double? rubRate` down to `SendNotificationAsync`. Alternative: per advertisement - rejected, rates change at most daily.
- **Add `WellKnown.CurrencyRate.TargetCurrency = "RUB"`** in `Server.Application/WellKnown.cs`, next to `BaseCurrency`, instead of a string literal. The Frontend has its own copy of this constant; sharing it across projects is out of scope.
- **Collect notified products in first-match order** with a list plus the existing `newInterestingProductIds` set, so the table order is deterministic.
- **Formatting:** `Math.Round(value, MidpointRounding.AwayFromZero)` then `ToString("0", CultureInfo.InvariantCulture)` plus `" RUB"` / `" USD"`. Invariant culture keeps tests stable regardless of server locale and avoids non-breaking-space separators in mail clients.
- **Table markup:** plain `<table border="1" cellpadding="4" style="border-collapse:collapse">` with a header row `Товар | Оценка | Продано шт.`. Inline attributes only, because many mail clients drop `<style>` blocks. Names go through `WebUtility.HtmlEncode`.
- **Missing RUB rate:** fall back to USD and log a warning once per run (see `logging` skill), rather than failing the run, because the email is still useful.

## Risks / Trade-offs

- [Rate from DB is stale] → Same staleness as the Products page; acceptable, it is an estimate.
- [Constructor change of a public service] → Only DI and the unit test build it; both are updated in the same change.
