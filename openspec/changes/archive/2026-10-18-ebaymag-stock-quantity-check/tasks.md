# Tasks

## 1. Backend: available quantity of a lot for sale

- [x] 1.1 Add required `availableQuantity` (integer, minimum 0) to `LotForSaleResponse` in `src/Ebay/Server.Contracts/WebApi/WebApi.yaml`; verify the solution builds and the regenerated C# and TypeScript clients (`src/ChromeExtension/src/clients/Generated/EbayToolWebApiClient.ts`) contain the field
- [x] 1.2 Add `AvailableQuantity` to `LotForSaleInfo` and compute it in `LotForSaleQueries` (both list and by-id projections) as the distinct count of `MatchId ?? Id` over measurements with `LotId == lot.Id` and state not `Sold`, in one SQL query; map it in `WebApiController.GetLotForSales`; verify the solution builds
- [x] 1.3 Add integration tests (new `Tests.Integration/Tests/LotForSaleAvailableQuantityTests.cs`, `[TestOf]` + `[OpenSpecScenario("lot-for-sale-listing", "Lot-for-sale available quantity", ...)]`) covering every scenario of that requirement, using `CreateLotForSale`, `UploadMeasurement`, `UpdateMeasurementLotId`, `UpdateMeasurementMatchId`, `UpdateMeasurementState`; verify they pass with `dotnet test`
- [x] 1.4 Update `Tests.Frontend/OfficeApiHandler.cs` or any other test stub building `LotForSaleResponse` if the new required field breaks it; verify `Tests.Frontend` passes

## 2. Chrome extension: quantity highlighting on ebaymag stock page

- [x] 2.1 In `EbayMagSiteProcessor`, replace the lot id `Set` with a `Map<string, number>` (lot id -> `availableQuantity`); verify `npm run build` in `src/ChromeExtension` succeeds
- [x] 2.2 Replace `highlightKnownSkuElements` with a per-row pass over `div[role="table"]`: find the `Quantity` column by header text, read SKU and quantity per row, apply green SKU for known lots and red / yellow / none on the quantity with a `title` tooltip ("Only N in stock" / "N in stock"), and remove extension-owned styles and tooltips (marked with a `data-*` attribute) when they no longer apply; skip rows whose quantity is not an integer; verify `npm run build` succeeds
- Skipped 2.3: Manually verify on https://ebaymag.com/stock with the rebuilt extension every scenario of `ebaymag-stock-quantity-check`: red for greater (including available 0), yellow for less, no highlight for equal and for unknown SKUs, highlight removed after the quantity is corrected (not done by the agent: no access to the live ebaymag account; the same scenarios were checked against the copied stock page markup in jsdom, the live check is left to the operator)

## 3. Integration checks

- [x] 3.1 Run `openspec validate ebaymag-stock-quantity-check --strict` and verify it passes
- Skipped 3.2: Run `./scripts/agent-check/agent-check.sh` from the repository root and verify it passes (all steps passed locally except the last one: the OpenSpec coverage checker's own tests fail on Windows with `spawnSync openspec ENOENT`, an environment issue unrelated to this change; CI on Linux runs it)

## Workflow follow-up

- Sync specs and archive the change, then run `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh` and fix missing or stale mappings before merging.
