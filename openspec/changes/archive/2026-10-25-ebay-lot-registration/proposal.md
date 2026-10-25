# Proposal

## Why

The Chrome extension registers eBay lots (listing details + purchase history) in our database and colours its panel to show whether the stored lot still matches eBay: green - in sync, yellow - eBay has sales we have not stored, red - listing details differ, white - lot not stored. Since the WebApi contract merge the panel stays red right after a successful registration, so the status is useless. Nothing describes the intended behaviour (including the rule that sales before the last title change are dropped because the seller may have sold something else under the same listing), so the regression went unnoticed and nothing tests it.

## What Changes

- Write down the lot registration behaviour as a new spec: what is stored, how the purchase history is cut at the title change date, and what each panel and search-results colour means.
- Fix the product-page sync status: compare an explicit set of listing fields by value instead of comparing `JSON.stringify` of the generated client objects, which now differ in key order, `null` vs. missing values and extra keys (`productId`, `autoPcs`, `additionalProperties`).
- Keep the existing "new sales" (yellow) rule - latest eBay sale with a price vs. latest stored sale with a price - but treat a stored `null` price as no price, as the eBay side already does.
- Keep the existing search-results colouring and form submission; only extract the decisions so they can be tested.
- Mark the lot schemas in `WebApi.yaml` (`LotInfo`, `LotInfoWithProductId`, `PurchaseInfo`, `PurchaseCalculationResult`, `CategoryValue`) `additionalProperties: false`, so neither the generated TypeScript client copies unknown keys nor the backend emits an `additionalProperties` field for them.
- Make `isRecent` consistent with what is stored: a purchase exactly at the title change date is kept, so it is reported as recent.
- Move the status decisions into DOM-free modules and cover every scenario with tests (extension: `node --test`; backend: unit and integration tests).

## Capabilities

### New Capabilities
- `ebay-lot-registration`: registering an eBay lot from the Chrome extension, the title-change cutoff of its purchase history, and the sync status the extension shows for it on the lot page and on sold-items search results.

### Modified Capabilities
<!-- none -->

## Impact

- `src/ChromeExtension/src/siteProcessors/EbaySiteProcessor.ts` (status comparison, form submit, search-results colouring) and new DOM-free modules under `src/ChromeExtension/src/siteProcessors/ebay/` with tests in `src/ChromeExtension/tests/`.
- `src/Ebay/Server.Contracts/WebApi/WebApi.yaml` (lot schemas); regenerated C# controller/client and TypeScript client. Unknown keys in requests are still ignored by the backend, so older extensions keep working.
- `src/Ebay/Server.Adapters.Driving.WebApi/Controllers/ModelsExtensions.cs` (`isRecent`).
- Tests in `src/Ebay/Tests.Unit` and `src/Ebay/Tests.Integration`.
- Out of scope: the backend serialises the System.Text.Json-generated DTOs with Newtonsoft.Json (`AddNewtonsoftJson`), which ignores `[JsonExtensionData]` and therefore leaks `additionalProperties` for every schema that allows extra keys; switching serializers changes request binding (e.g. the extension used to send `pcs` as a string) and is left as a TODO.
