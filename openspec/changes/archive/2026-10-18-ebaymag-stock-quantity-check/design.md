# Design

## Context

See proposal.md - Why. Current state relevant to the approach:

- `LotForSale` (write model) has no quantity. Measurements reference a lot through `ProductMeasurement.LotId` (the 7-character lot-for-sale id) and group into matched sets through `MatchId`. The lot description page already groups a lot's measurements by `MatchId`, one group per "Match#" row.
- `GET /webapi/v1/lot-for-sales` is served by `WebApiController.GetLotForSales` -> `LotForSaleService.GetLotForSalesAsync` -> `ILotForSaleQueries.GetLotForSalesAsync` (EF read model, views `wm.LotForSales` and `wm.ProductMeasurements` in `ReadDbContext`).
- The contract is `src/Ebay/Server.Contracts/WebApi/WebApi.yaml`; NSwag regenerates the controller base, the C# client and the extension's TypeScript client during the build.
- `EbayMagSiteProcessor` loads the lot list once, then every second colours SKU elements (`div[role="button"]` with 7-character text) green when the text is a known lot id. It never removes the colour.
- ebaymag stock table markup (copied from the live page): `div[role="table"]` -> `div[role="row"]` -> `div[role="cell"]`. The first row is the header with cell texts `Title`, `SKU`, `Quantity`, shop columns, `Shipping`. In data rows the SKU cell holds `div[role="button"]` with the SKU text and the Quantity cell holds `<button>` with the number. Class names are obfuscated and unstable.

## Goals / Non-Goals

**Goals:**
- One request gives the extension everything it needs: ids and available quantities of all lots.
- The count is computed in the database in one query, without loading measurements into memory.

**Non-Goals:**
- No periodic refresh of the lot list: the operator reloads the page (confirmed with the user).
- No handling of incomplete matched sets (part of a `MatchId` group `Sold`). That is an operator error; the group is counted as one unit as long as any of its measurements is not `Sold`.
- No change to the lot-for-sale write model, no new table or migration.
- No editing of quantities on ebaymag; the extension only highlights.

## Decisions

1. **Field on the existing list response, not a new endpoint.** Add required `availableQuantity: integer (minimum 0)` to `LotForSaleResponse`. The extension already calls `GetLotForSales`; a per-lot endpoint would mean one request per row. The Blazor frontend shares the response type and simply ignores the field for now.
2. **Count in the read-model query.** `LotForSaleInfo` gets `int AvailableQuantity`. `LotForSaleQueries.GetLotForSalesAsync` (and `GetLotForSaleByIdAsync`, which projects to the same record) compute it as a correlated subquery over `ProductMeasurements`: `LotId == lot.Id && MeasurementState != Sold`, then `Select(m => m.MatchId ?? m.Id).Distinct().Count()`. Measurement ids and match ids live in different id spaces in practice, and even a collision only merges an unmatched tube into a set of the same lot; accepted for simplicity. Alternative considered: compute in `LotForSaleService` from `IMeasurementQueries` per lot - N+1 queries and duplicated filtering, rejected.
3. **Filter by `LotId` only.** A lot id is globally unique, so product/state filters add nothing. "Not `Sold`" covers `Created` and `Selling`, as agreed with the user, independent of the lot's own `MeasurementState`.
4. **Extension: column lookup by header text.** Find the row whose cells (`div[role="cell"]` or `div[role="columnheader"]`, excluding cells nested in other cells) contain exactly `SKU` and `Quantity`, take those column indexes, then read the SKU and quantity cells of every `div[role="row"]` on the page by index. Alternative - "cell right after the SKU cell" - is simpler but breaks silently if ebaymag reorders columns; header lookup fails visibly (nothing highlighted) instead. Matching the header by text ties us to the English UI, which is what the account uses.
5. **Extension: idempotent row rendering.** Each 1-second pass computes the desired state of every row (SKU: green or none; quantity: red / yellow / none, with tooltip via `title`) and applies it. On first highlight the element's original inline `color` and `title` are saved in a `data-ebay-tool-highlight` attribute; clearing restores them, so ebaymag's own values are never lost. The existing green SKU logic moves into this per-row pass, which also fixes stale green on reused rows.
6. **Data structure in the extension.** Replace `Set<string>` of lot ids with `Map<string, number>` (lot id -> available quantity); the description-sync code path is unchanged.

## Risks / Trade-offs

- [ebaymag markup changes (roles, header text)] -> highlighting stops instead of showing wrong colours; the existing SKU heuristic already carries the same risk. Keep selectors in one place.
- [Quantity cell text is not a plain integer (empty, "-")] -> skip the quantity highlight for that row (empty quantity was seen in the copied markup).
- [Stale stock while the page stays open] -> accepted; operator reloads the page.
- [ebaymag re-renders and drops our inline style] -> the 1-second pass re-applies it, as today.
- [Correlated subquery per lot] -> number of lots is small (tens to hundreds); a single SQL statement. Revisit only if the list endpoint gets slow.

## Migration Plan

Additive contract change. Deploy the backend first; an old extension ignores the new field. The new extension requires the new backend (a missing `availableQuantity` would read as `undefined`); the extension and backend ship from the same repo and release together. Rollback: revert both.
