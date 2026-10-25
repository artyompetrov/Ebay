# Tasks

## 1. Backend contract and stored lot

- [x] 1.1 Add `additionalProperties: false` to `LotInfo`, `LotInfoWithProductId`, `PurchaseInfo`, `PurchaseCalculationResult` and `CategoryValue` in `src/Ebay/Server.Contracts/WebApi/WebApi.yaml`; rebuild `Server.Adapters.Driving.WebApi` and `Server.Client` and verify the generated `LotInfo` classes (C# and `src/ChromeExtension/src/clients/Generated/EbayToolWebApiClient.ts`) have no additional-properties member and the solution builds
- [x] 1.2 Add a TODO next to `AddNewtonsoftJson()` in `Server.Adapters.Driving.WebApi/ServiceCollectionExtensions.cs` describing the System.Text.Json DTO / Newtonsoft serializer mismatch that leaks `additionalProperties` for other schemas; verify by reading the file
- [x] 1.3 Report `isRecent` as `purchase.Date >= titleChangeDate` in `ModelsExtensions.ToApiPurchaseInfo`; verified by 1.4 "Sale at the title change moment"
- [x] 1.4 Add `Tests.Integration/Tests/LotRegistrationTests.cs` (`[TestOf]`, `[OpenSpecScenario]`) covering "New lot is registered", "Stored lot is registered again", "Ignored lot is registered", "Sales before the title change are dropped", "Title changed since the last registration", "Sale at the title change moment" and "Reading a registered lot" (raw JSON via `HttpClient`); tag `LotTests.UpsertPurchase_UpdatesExistingPurchase_WhenOneAlreadyExistsForThatDate` with "Same sale submitted twice"; verify the tests pass

## 2. Extension: lot page status

- [x] 2.1 Create `src/ChromeExtension/src/siteProcessors/ebay/LotSyncStatus.ts` (no imports) with `isSameListing` and `getLotSyncStatus` per design decisions 1-2, and `tests/LotSyncStatus.test.ts` covering every scenario of "Lot page shows whether the stored lot matches eBay" and "Listing comparison covers eBay-owned fields" (the "Lot was just registered" case uses the stored lot and eBay lot from the reported log: nulls, `additionalProperties`, different key order, `productId`/`autoPcs`); verify `npm test` passes
- [x] 2.2 Use it in `EbaySiteProcessor.compareLotInfos`, mapping statuses to the existing colours; verify `npm run build` succeeds

## 3. Extension: sold search results

- [x] 3.1 Create `src/ChromeExtension/src/siteProcessors/ebay/SoldSearchResults.ts` with the result classification (first 10 non-ignored) and the selection of up to 5 lots to open, with `tests/SoldSearchResults.test.ts` covering every scenario of "Sold search results show which lots need registering" and "Lots needing registration open in batches"; verify `npm test` passes
- [x] 3.2 Use it in `EbaySiteProcessor.updateStatusInfinite` and the open-lots button handler; verify `npm run build` succeeds

## 4. Docs and checks

- [x] 4.1 Mention the `src/siteProcessors/ebay/` modules and the `ebay-lot-registration` spec in `src/ChromeExtension/AGENTS.md`; verify by reading the file
- [x] 4.2 Run `npm test && npm run build` in `src/ChromeExtension`, `dotnet test` for `Tests.Unit` and `Tests.Integration`, and `make agent-check`; verify all pass

## Workflow follow-up

- Sync the spec, archive the change, then run `make openspec-coverage-check`.
- Register a lot on eBay with the rebuilt extension and confirm the panel turns green and the tab closes.
