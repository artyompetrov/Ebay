## Context

`ProductMeasurement` (`src/Ebay/Server.Domain/Measurements/ProductMeasurement.cs`) already has a `Location` property (storage location) that can be edited today from the office measurements table via `IMeasurementService.UpdateMeasurementLocation`, exposed only through the frozen Legacy contract (`Server.Contracts/Legacy/Ebay.yaml`, `EbayControllerImplementation.cs:497-505`). It has no notion of "when was this measurement last physically verified" — that is the gap this change fills with a new `InventoryDate` property and a dedicated scan-driven workflow.

The QR/barcode scanner is already wired twice: `Measurements.razor` and `MeasurementPhotos.razor` each inline their own `<div id="reader">` + scan button + `await Interop.StartQrScanner()` + `qrCodeData.Split('/').Last()` id-extraction. There is no shared Razor component for this today.

## Goals / Non-Goals

**Goals:**
- Add an "Инвентаризация" tab where scanning a measurement's QR code immediately stamps that measurement's `InventoryDate` to the current server time.
- After a scan, let staff see the scanned measurement's current storage location and optionally correct it, without leaving the tab or re-scanning.
- Reuse the existing `Interop.StartQrScanner()` / `html5-qrcode` mechanism as-is; do not introduce a second scanning library or a divergent id-parsing convention.
- Reuse the existing `Location`-update logic (`IMeasurementService.UpdateMeasurementLocation`) rather than re-implementing storage-location update rules.
- Since this is the third page to need QR scanning, extract the inline scan markup/logic into one shared Razor component so the new page does not add a third copy.

**Non-Goals:**
- Do not migrate the two existing pages (`Measurements.razor`, `MeasurementPhotos.razor`) onto the new shared scanner component in this change — reduces blast radius; tracked as a follow-up cleanup opportunity, not required for this feature to work correctly.
- Do not add inventory history/audit trail (who scanned, previous dates) — only the latest `InventoryDate` is kept, mirroring how `LastTimeWatchedOnEbay` already tracks only the latest timestamp.
- Do not change the Legacy contract or the existing office-table location editor; they keep working exactly as today.
- Do not add bulk/batch scanning or offline scanning support.

## Decisions

### 1. `InventoryDate` is a nullable `DateTimeOffset`, stamped server-side

Mirrors the existing `LastTimeWatchedOnEbay` pattern (`ProductMeasurement.cs:189-196`): a nullable `DateTimeOffset` set via a dedicated method (`MarkInventoried(DateTimeOffset scannedAtUtc)`) rather than a public setter, consistent with `AGENTS.md`'s "never `DateTime`" rule and the aggregate's existing style of exposing intent-revealing methods for state changes that matter to the domain (as opposed to the plain get/set used for the free-form `Location`/`MatchId`/`LotId` fields).

**Alternative considered:** `DateOnly`. Rejected — staff may scan the same shelf run more than once in a day and a full timestamp is more useful for later troubleshooting ("was this actually scanned this morning or is it stale from last week"), and it costs nothing extra.

### 2. One new endpoint for the scan action; reuse the existing endpoint pattern for location, added to the new contract

`POST /measurements/{measurementId}/inventory` (new, `Server.Contracts/WebApi/WebApi.yaml`) is called automatically right after a successful scan. It stamps `InventoryDate = DateTimeOffset.UtcNow` and returns the measurement's current `location` (plus id) in the response body, so the Inventory page can show/prefill the location field without an extra round trip. It does not itself change `Location`.

Optionally updating the location afterward reuses the *existing* `IMeasurementService.UpdateMeasurementLocation` application logic — no new location-update business rule is introduced. Because that logic today is reachable only from the frozen Legacy contract, this change adds a small new-contract endpoint, e.g. `PUT /measurements/{measurementId}/location`, in `WebApi.yaml`. This keeps "scan" and "correct location" as the two independent steps the workflow actually has, and avoids duplicating location-update rules for the sake of matching an unrelated frozen contract.

`UpdateMeasurementLocation` today throws `InvalidOperationException` when the measurement id is unknown (`MeasurementService.cs:60`), and its only current caller (the Legacy controller) does not translate that into anything — it simply propagates. `WebApiController` has no exception-to-HTTP-status translation anywhere (every existing 404 in that controller — e.g. `DeleteMeasurementPhoto`, `GetMeasurementPhotoContent` — comes from an application service returning `false`/`null` that the controller checks explicitly), so delegating straight to the throwing method would return an unhandled 500 instead of the contract's 404, exactly as flagged in review. The new endpoints must follow the same not-found-as-return-value convention already used throughout this controller instead of relying on exceptions:
- `RecordInventoryScan` returns a nullable result (`null` when the measurement id is unknown) instead of throwing; the controller maps `null` to `NotFound()`.
- The location endpoint calls a new `TryUpdateMeasurementLocation(string measurementId, string? location, CancellationToken) -> Task<bool>` that performs the same lookup/trim/clear logic as `UpdateMeasurementLocation` but returns `false` instead of throwing when the measurement is missing; the controller maps `false` to `NotFound()`. The existing `UpdateMeasurementLocation` is left untouched (still throwing) so the Legacy contract's behavior is not changed by this feature.

**Alternative considered:** Catch `InvalidOperationException` in the new controller actions and translate it to `NotFound()` there. Rejected — it would be the only exception-based 404 in a controller where every other endpoint uses explicit return-value checks, adding an inconsistent second convention for the same concern.

**Alternative considered:** A single combined `POST /measurements/{measurementId}/inventory` endpoint that both stamps the date and optionally accepts a location in the same call. Rejected — the requirement is explicitly two steps ("scan, then optionally correct location"), and staff should see the *current* location before deciding whether to change it; a combined endpoint would force the client to guess a location value up front instead of reading it back first.

**Alternative considered:** Reuse the Legacy `UpdateMeasurementLocation` operation's generated client directly from the new Inventory page. Rejected — `AGENTS.md` reserves `Legacy/Ebay.yaml` as frozen/no new usage, and mixing legacy- and new-contract generated clients on one page adds inconsistency for no benefit.

### 3. Extract a shared scanner Razor component now (rule of three)

A new `Frontend/Shared/QrScannerButton.razor` (name indicative) wraps the scan button, `<div id="reader">` host, and the `Interop.StartQrScanner()` call, exposing a simple callback (`OnScanned: EventCallback<string>`) with the same `.../Split('/').Last()` id-extraction convention already used by the two existing pages. `Inventory.razor` is the first consumer. This satisfies `AGENTS.md`'s "avoid copy-pasting; reuse existing solutions" now that a third inline copy would otherwise be created, while keeping the existing two pages untouched (see Non-Goals) to limit review/regression surface.

**Alternative considered:** Copy the existing inline pattern a third time, matching current (duplicated) precedent exactly. Rejected — directly conflicts with the project's DRY rule now that the duplication would reach three call sites.

### 4. Migrate `InventoryDate` through the migrations pipeline that actually owns the table today (legacy), not `WriteModelDbContext`

`MeasurementRepository` (`Server.Adapters.Driven.EF.WriteModel/Repositories/MeasurementRepository.cs`) is physically placed in the write-model adapter project, but it injects and queries the legacy `ApplicationDbContext` (`Server.Application/Data/ApplicationDbContext.cs:213`, table `ProductMeasurements`, schema `public`) — `WriteModelDbContext` does not map `ProductMeasurement` at all. This is a pre-existing architectural gap (the repository's location suggests it belongs to the `wm` write model, but its persistence has not actually been migrated there yet), not something introduced by this change.

Fully migrating `ProductMeasurement` (plus its `Product` foreign key and the two `MatchedPairDifference` foreign keys onto it, see `ApplicationDbContext.cs:108-133,191-199`) to `WriteModelDbContext`/schema `wm` would be the architecturally "correct" end state per `AGENTS.md`'s DB-migrations rules, but it is a large, higher-risk data/schema migration unrelated to the inventory-scanning feature itself, so it is **out of scope for this change** and tracked below as a TODO rather than silently worked around.

For this change, `InventoryDate` is added as a plain nullable `timestamptz` column on `ProductMeasurement` via the **legacy** migrations pipeline (`Server.Application/Migrations`, `dotnet ef migrations add ... --project Server.Application --startup-project Server`), because that is the context that actually owns the table today — adding the column anywhere else (including `WriteModelDbContext`) would either create an unused duplicate table or make the context that really serves reads/writes for this aggregate query a column it doesn't have, exactly as flagged in review. No backfill is needed — existing rows get `NULL` (never inventoried), which is a valid, meaningful state ("not yet counted").

**TODO (out of scope for this change):** Migrate `ProductMeasurement`'s persistence (and `MeasurementRepository`) from the legacy `ApplicationDbContext` to `WriteModelDbContext`/schema `wm`, resolving the mismatch between where the repository lives and where its data actually is.

## Risks / Trade-offs

- [Risk] Scanning the wrong/unrelated QR code (e.g., a lot barcode instead of a measurement one) could silently stamp the wrong aggregate. → Reuse the exact same id-extraction and lookup-or-404 behavior already used by `Measurements.razor`/`MeasurementPhotos.razor`; unknown ids surface a visible "measurement not found" error instead of failing silently.
- [Risk] Two independent calls (scan-stamp, then optional location update) instead of one atomic call means a client crash between them could leave `InventoryDate` stamped without a location correction being applied. → Acceptable: the location update is explicitly optional and independent in the requirements; nothing is lost, staff can just re-open the page and fix the location separately.
- [Trade-off] Not migrating the two existing scanner usages onto the new shared component leaves the codebase with old-pattern and new-pattern scanning side by side for now. → Tracked as a deliberate, scoped-down follow-up rather than expanding this change's blast radius.
- [Trade-off] `InventoryDate` is added via the legacy migrations pipeline rather than `WriteModelDbContext`, because that is where `ProductMeasurement` is actually persisted today. → Explicitly called out as an accepted, scoped exception (not a silent workaround) with the full aggregate migration to `wm` tracked as a follow-up TODO; see Decision 4.

## Migration Plan

1. Add `InventoryDate` + `MarkInventoried` to `ProductMeasurement`; add the EF write-model migration for the new column.
2. Add `RecordInventoryScan` (or similarly named) use case to `IMeasurementService`/`MeasurementService`, and a new-contract `PUT /measurements/{measurementId}/location` endpoint that delegates to the existing `UpdateMeasurementLocation`.
3. Add the two `WebApi.yaml` paths, regenerate NSwag client/server code, wire both into `WebApiController`.
4. Add the shared scanner Razor component and the new `Inventory.razor` page; add the "Инвентаризация" nav entry.
5. Verify end-to-end: scan → date stamped → location shown → optional location edit persists.

Rollback is a plain revert; the new column is additive and nullable, so no destructive data migration is involved either way.

## Open Questions

None.
