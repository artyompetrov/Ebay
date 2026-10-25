# Design

## Context

See proposal.md - Why. Current state that shapes the approach:

- `EbaySiteProcessor.compareLotInfos` builds `toJSON()` of the stored lot and of the lot read from eBay, blanks a few keys and compares the two `JSON.stringify` strings. Since the extension moved to the merged `EbayToolWebApiClient`, the generated `LotInfo` allows extra keys: `init()`/`toJSON()` first copy every own property in insertion order, then the declared ones. The stored lot keeps the order of the HTTP response plus `"additionalProperties":{}` and `null` values; the eBay lot keeps assignment order plus `productId`/`autoPcs` copied from the form by `handleSubmit`. The strings never match.
- The backend emits `"additionalProperties":{}` because NSwag generates System.Text.Json DTOs (`[JsonExtensionData]`) while MVC serialises with Newtonsoft.Json (`AddNewtonsoftJson`), which treats the dictionary as an ordinary property.
- The "new sales" check compares max sale dates, but filters stored sales by `price !== undefined` (stored `null` passes) and eBay sales the same way (missing price fails), so a newest sale without a price makes the lot yellow forever.
- Title change cutoff already works on the backend (`LotService.UpsertLotInfoAsync` skips and `Lot.RemovePurchasesBefore` deletes earlier sales) and in the extension (`waitForPurchaseHistoryAndTitleDate` filters); only `isRecent` uses `<` while storage keeps the boundary sale.
- Extension tests can only load DOM-only modules without extensionless imports (`src/ChromeExtension/AGENTS.md`), so the generated client cannot be imported from tested code.

## Goals / Non-Goals

**Goals:**
- Every scenario of `ebay-lot-registration` maps to an automated test.
- Status decisions live in pure modules that take plain data, so tests do not need the generated client, `chrome.*` or eBay pages.

**Non-Goals:**
- Replacing Newtonsoft.Json with System.Text.Json in the backend (left as a TODO, see Risks).
- Parsing eBay purchase-history and revision-history pages (no fixtures yet; behaviour unchanged).
- Changing panel layout or the shipping-country choice.

## Decisions

1. **Explicit field list instead of serialised-object comparison.** New `src/siteProcessors/ebay/LotSyncStatus.ts` exports a structural `ComparableLot` interface (the eBay-owned fields plus `purchaseHistory: {date, price?}[]`), `isSameListing(stored, page)` and `getLotSyncStatus(stored | undefined, page): 'notStored' | 'listingDiffers' | 'newSales' | 'inSync'`. `null`/`undefined` are normalised, dates are compared via `Date.parse`. `EbaySiteProcessor` maps the status to the existing colours and sets `_serverAndEbayAreEqual` for `inSync`. Alternative - sort keys and strip extras before `JSON.stringify` - still breaks on `null` vs. missing and on any new optional field, and keeps the rule implicit.
2. **"New sales" rule kept as is.** The latest date among sales with a price is compared on both sides, as before; the only change is that a stored `null` price counts as no price (before, `null !== undefined` let unpriced stored sales into the maximum). The operator asked not to change the existing logic beyond the red-status fix.
3. **Form submission untouched.** `handleSubmit` still copies form fields into `_lotInfo`; with `additionalProperties: false` the generated `toJSON()` sends only declared fields, so `autoPcs`/`productId` no longer reach the backend anyway.
4. **Sold search results logic extracted unchanged.** New `src/siteProcessors/ebay/SoldSearchResults.ts` exports the colour classification (keeping the `ceil(days) > 0` rule and the first-10 limit) and the selection of up to 5 lot ids to open; `updateStatusInfinite` and the button handler call it.
5. **`additionalProperties: false` on the lot schemas** (`LotInfo`, `LotInfoWithProductId`, `PurchaseInfo`, `PurchaseCalculationResult`, `CategoryValue`) in `WebApi.yaml`. This removes the extension-data members from both generated C# DTOs and the TypeScript classes, which fixes the leak for these responses without touching the serializer. Newtonsoft ignores unknown request members by default, so extensions still sending `autoPcs`/`productId` keep working. Alternative - drop `AddNewtonsoftJson` - fixes all schemas but changes request binding for every endpoint (e.g. numbers sent as strings), too broad for this change.
6. **`isRecent = purchase.Date >= titleChangeDate`** in `ModelsExtensions.ToApiPurchaseInfo`, matching what `LotService` stores.
7. **Backend tests**: new `Tests.Integration/Tests/LotRegistrationTests.cs` covers registration, the cutoff, the boundary sale, un-ignoring and the raw response JSON (read with `HttpClient` to see actual keys); the per-date identity scenario maps to the existing `LotTests.UpsertPurchase_UpdatesExistingPurchase_WhenOneAlreadyExistsForThatDate`.

## Risks / Trade-offs

- [Other schemas still leak `additionalProperties` through Newtonsoft] → TODO next to `AddNewtonsoftJson` in `Server.Adapters.Driving.WebApi/ServiceCollectionExtensions.cs` describing the mismatch.
- [Removing extension-data members from C# DTOs breaks code that reads `AdditionalProperties` on them] → grep `Frontend`, tests and adapters for it while regenerating; none found during planning.
- [Changed generated client bumps the extension version] → expected; the CI image hash covers it.
- [Float equality on prices] → values come from the same eBay decimal strings on both sides; kept exact.
