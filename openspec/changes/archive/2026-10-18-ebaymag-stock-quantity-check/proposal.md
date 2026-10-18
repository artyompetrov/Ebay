# Proposal

## Why

On the ebaymag stock page (`https://ebaymag.com/stock`) the quantity of each listing is maintained by hand, so it can drift from what is actually in stock: a listing can offer more units than we have (risk of selling something that does not exist) or fewer (lost sales). The Chrome extension already recognises our lots on that page (it colours their SKU green), but nothing tells the operator whether the listed quantity is right.

## What Changes

- The backend computes an **available quantity** per lot for sale: the number of sellable units among the lot's measurements that are not `Sold`. A matched set (all measurements sharing one `MatchId`: a pair, a quad) counts as one unit; a measurement without `MatchId` counts as one unit.
- `GET /webapi/v1/lot-for-sales` returns that number in a new required field `availableQuantity` of `LotForSaleResponse`.
- On the ebaymag stock page the extension compares the quantity shown for each of our lots (rows whose SKU matches a lot for sale) with `availableQuantity`:
  - ebaymag quantity greater than available: quantity shown in red with a tooltip saying how many are actually in stock;
  - equal: no highlight;
  - less than available: quantity shown in yellow with a tooltip saying how many are in stock.
- Rows whose SKU is not one of our lots stay untouched, as today.
- The SKU/quantity highlight is re-evaluated on every pass and removed when it no longer applies, so a reused or updated table row never keeps a stale colour (this also fixes the existing green SKU highlight).
- Lots are loaded once when the page opens; the operator reloads the page to get fresh stock numbers (no periodic refresh).

## Capabilities

### New Capabilities
- `ebaymag-stock-quantity-check`: highlighting of listing quantities on the ebaymag stock page against the available quantity of our lots for sale.

### Modified Capabilities
- `lot-for-sale-listing`: adds the requirement that each lot for sale exposes its available quantity, counted in matched sets.

## Impact

- Contract: `src/Ebay/Server.Contracts/WebApi/WebApi.yaml` (`LotForSaleResponse.availableQuantity`), regenerated C# server/client code and the extension's generated TypeScript client (`src/ChromeExtension/src/clients/Generated/EbayToolWebApiClient.ts`).
- Backend: `LotForSaleInfo`, `LotForSaleQueries` (read model), `WebApiController.GetLotForSales` mapping; integration tests for the count.
- Extension: `src/ChromeExtension/src/siteProcessors/EbayMagSiteProcessor.ts`, new DOM-only module `src/siteProcessors/ebayMag/StockQuantityHighlighter.ts`, new extension tests (`src/ChromeExtension/tests`, `npm test`, `jsdom` dev dependency) wired into `agent-check.sh`, CI and the OpenSpec coverage checker.
- Frontend test stub `src/Ebay/Tests.Frontend/OfficeApiHandler.cs` if it builds `LotForSaleResponse` payloads.
- No DB schema change.
