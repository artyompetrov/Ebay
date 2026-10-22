# Proposal

## Why

The sale-advertisement notification email lists the advertisement lines that matched our tracked products, but not what those products are worth to us. To decide whether an offer is worth buying, staff now have to open the Products page and look every product up by hand.

## What Changes

- The notification email gets a table below the list of matched lines. It has one row per tracked product that triggered the email (newly recorded and interesting), with:
  - the product name;
  - the estimated price: the product's average revenue per unit, converted from USD to RUB with the stored currency rate and rounded to whole roubles (the same figure the Products page shows as "Средняя выручка (RUB)");
  - the number of units sold that the estimate is based on.
- Products that matched the advertisement but did not trigger the email (already recorded for this seller, or not interesting) are not listed in the table.
- If the RUB rate is not available, the estimated price is shown in USD instead, so the email is still sent.
- Product names in the table are HTML-encoded.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `sale-advertisement-monitoring`: adds requirements for the table of notified products with their estimated prices and for the USD fallback. The existing "Notification contents" requirement is unchanged.

## Impact

- `src/Ebay/Server.Application/SaleAdvertisements/SaleAdvertisementMonitoringService.cs`: keeps product name and calculation result per tracked product, loads currency rates once per run via `ICurrencyQueries`, builds the table.
- `src/Ebay/Tests.Unit/SaleAdvertisementMonitoringServiceTests.cs`: test context gets a fake `ICurrencyQueries`; new tests for the table scenarios.
- No API, database or configuration changes.
