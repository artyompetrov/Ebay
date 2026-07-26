## Context

Most of the plumbing for measurement photos already exists:
- Domain aggregate `MeasurementPhoto` (`Server.Domain/Measurements/MeasurementPhoto.cs`), EF write-model storage and migration.
- `MeasurementPhotoService` with `UploadAsync`/`DeleteAsync` (including order-shifting on delete).
- `IMeasurementPhotoQueries` with `GetByMeasurementId`, `Get`, `GetNextOrder` — all returning/using `MeasurementPhotoInfo`, which carries the photo's binary `Content` even when only metadata is needed.
- Web API endpoints already wired in `WebApiController`: `GetMeasurementPhotos`, `UploadMeasurementPhoto`, `DeleteMeasurementPhoto`, `GetMeasurementPhotoContent`, all present in `WebApi.yaml`.
- `MeasurementPhotos.razor`: a phone-oriented page that requires scanning a barcode to establish the measurement id, then supports multi-file upload (`capture="environment"`) and delete, listing photos via `GetMeasurementPhotosAsync`.

What's missing is the *consumption* side: the eBay-facing description page never queries or renders photos, and the office measurements table (`Measurements.razor`) has no entry point into photo management at all — the only existing entry point requires a phone and a barcode scan.

There is a precedent to follow for both gaps: `EbayLotDescriptionPage.cshtml` already renders a similar per-item image gallery for product passports (`Model.Passports`, loaded via `IPassportQueries.GetPassports(productId, ...)` and rendered as `<img>` tags pointing at a content endpoint). Measurement photos should follow the same shape, scoped per-measurement instead of per-product.

## Goals / Non-Goals

**Goals:**
- Show uploaded measurement photos on the actual eBay listing description page, per tube/measurement row.
- Let office staff view and delete a measurement's photos from the internal measurements table without a phone/barcode.
- Avoid N+1 queries and avoid transferring photo binary content when only metadata (existence/count/filename/order) is needed.

**Non-Goals:**
- No changes to the existing phone scan-and-upload UX itself (still barcode-first) beyond allowing it to also accept a measurement id passed directly (e.g. via route/query parameter), so the office page can deep-link into it.
- No changes to the public Web API contract's shape for upload/delete/content endpoints — those are already correct and sufficient.
- No image resizing/thumbnailing/CDN work — photos are served as-is through the existing content endpoint, same as passports today.
- No change to how photos are stored (byte[] column via EF) — out of scope; if this becomes a performance problem at scale it is a separate change.

## Decisions

1. **Add a metadata-only, batchable query instead of reusing `GetByMeasurementId`.**
   `GetByMeasurementId` returns `MeasurementPhotoInfo`, which includes `Content` (byte[]). The existing `WebApiController.GetMeasurementPhotos` already discards `Content` after fetching it — that's wasted I/O today and it would get worse if the eBay description page called the same method once per measurement per page render. Instead, add `IMeasurementPhotoQueries.GetMetadataByMeasurementIds(IReadOnlyList<string> measurementIds, CancellationToken)` returning a new lightweight record (`MeasurementPhotoMetadata(Guid Id, string MeasurementId, string FileName, int Order)`, no `Content`), implemented as a single EF projection query (`.Select(...)` before materializing) across all requested measurement ids. Both the office page indicator and the eBay description page use this one method; the existing `GetByMeasurementId`/`Get` stay as-is for the phone page's own list view and for the content-serving endpoint respectively.
   - *Alternative considered*: keep using `GetByMeasurementId` per measurement and just ignore `Content`. Rejected — doesn't fix the underlying over-fetch (root cause per project engineering rules) and doesn't solve N+1 for the description page, which lists many measurements per lot.

2. **eBay description page: batch-load photo metadata once per page render, keyed by measurement id.**
   `EbayLotDescriptionPage.OnGet` already loads `Measurements` (a list of `MeasurementInfoWithSimilarMeasurements`) and `Passports` up front. Add one more call: `GetMetadataByMeasurementIds` over all `Measurements` ids, producing a `Lookup<string, MeasurementPhotoMetadata>` exposed as a page property (e.g. `PhotosByMeasurementId`). The `.cshtml` then renders `<img src="{baseUrl}/measurements/{measurementId}/photos/{photoId}/content">` per photo in the existing per-tube `<td>`, mirroring the passport `<img>` block already in the same file.
   - *Alternative considered*: per-measurement query call inside the Razor loop. Rejected — reintroduces N+1 against the same DB the passports/measurements queries already avoid.

3. **Office page entry point: deep-link into the existing phone page by measurement id, don't build a second photo UI.**
   `MeasurementPhotos.razor` already has the full list/upload/delete UX; duplicating it inline in `Measurements.razor`'s table would violate DRY. Instead:
   - Change the page route/parameter handling so `MeasurementPhotos.razor` can accept a measurement id up front (e.g. `/measurement-photos/{measurementId?}` or a query string), skipping the barcode-scan step and loading photos immediately via the existing `LoadPhotosAsync`.
   - In `Measurements.razor`, add a photo-count badge/link per row (e.g. "📷 3") that navigates to that URL in a new tab, following the same `NavLink ... target="_blank"` pattern already used for the `/m/{measurement.MeasurementId}` curves link on the same row.
   - *Alternative considered*: inline modal/expand-in-row photo manager inside `Measurements.razor`. Rejected for this change — bigger UI surface, and the phone page already provides a working, tested management UX; reusing it is simpler and keeps one place to fix future photo-UX bugs (DRY).

4. **Contract impact: `Measurements.razor` is Blazor WebAssembly, so the photo count needs a real API call — add a new batched endpoint to `WebApi.yaml`, not a field on the legacy `MeasurementData` contract.**
   Unlike `EbayLotDescriptionPage.cshtml` (a server-rendered Razor Page that can call `IMeasurementPhotoQueries` in-process), `Measurements.razor` runs in the browser and can only reach the backend through a generated client. `MeasurementData` is defined in `Server.Contracts/Legacy/Ebay.yaml`, and `src/Ebay/AGENTS.md` is explicit that new API functionality only goes into `Server.Contracts/WebApi/*.yaml` — the legacy contract takes no new changes. So instead of extending `MeasurementData`:
   - Add a new `WebApi.yaml` operation, e.g. `GET /measurements/photos/counts?measurementIds=...` (repeated query parameter), returning `MeasurementPhotoCountResponse[]` (`measurementId`, `photoCount`) — same style/tag as the existing `/measurements/{measurementId}/photos` group.
   - Implement it on `WebApiController` by calling `GetMetadataByMeasurementIds` once and grouping by measurement id (same batching property as originally planned, just exposed through the new-contracts surface instead of the legacy one).
   - `Measurements.razor` already injects `WebApiClient` (used today for lot-for-sale operations); after loading `_allMeasurements` via `EbayClient.GetMeasurementsAsync`, it makes one additional `WebApiClient` call with all their ids and joins the counts into a client-side `Dictionary<string, int>` used only for rendering the badge — `MeasurementData` itself is untouched.
   - *Alternative considered*: add `PhotoCount` directly to `MeasurementData` (avoids a second client call). Rejected — violates the project's explicit "no new changes to `Legacy/Ebay.yaml`" rule; the one extra batched `WebApiClient` call is a small, already-established pattern (the page already mixes `EbayClient` and `WebApiClient` calls) and keeps the legacy contract frozen as intended.

## Risks / Trade-offs

- [Risk] Adding photos to the eBay description page increases the page's HTML size and the number of embedded images pulled by eBay's crawler/CDN when the listing is viewed → *Mitigation*: reuse the exact same `<img src=".../content">` pattern already proven for passports; no eager base64 inlining, browser/CDN caches images independently, and there is no plot-style SVG caching needed since original photos are static uploads.
- [Risk] `GetMetadataByMeasurementIds` executed inside `EbayLotDescriptionPage.OnGet` runs on every page hit (this page isn't behind the same `DbCache` as the plot/description SVG endpoints) → *Mitigation*: it's a single indexed lookup by measurement id list (same performance class as the existing `Passports`/`Measurements` queries already done unconditionally on this page); no new caching layer is introduced in this change, consistent with how passports work today. If load becomes an issue, caching can be added later following the `DbCache` pattern already used in `MeasurementPlotService`.
- [Risk] Deep-linking `MeasurementPhotos.razor` by measurement id from the office page bypasses the barcode-scan "did I pick the right physical tube" safeguard the phone flow was designed around → *Mitigation*: the office page already knows the correct measurement id for each row (it's the source of truth being displayed), so there's no ambiguity to resolve via scanning in that entry path; scanning stays the default/primary entry when opened without a preset id.
- [Trade-off] Reusing the phone page for office-triggered management (Decision 3) means office staff use a phone-styled photo list/upload UI on desktop too → acceptable since the existing list/delete UI (`<ul class="list-group">`) is not phone-specific, only the barcode scanner and camera-capture upload control are phone-oriented, and those remain usable (file picker) from desktop as well.

## Migration Plan

- No database schema migration needed — `MeasurementPhoto` storage already exists.
- Deploy order: backend query addition (`GetMetadataByMeasurementIds` + record) → `EbayLotDescriptionPage` changes → `MeasurementPhotos.razor` route/param change → `Measurements.razor` UI addition. Each step is additive and independently safe to ship; no flag/rollback beyond normal revert needed since no existing behavior is removed or altered.
- Rollback: revert the relevant commit(s); no data migration to undo.

## Open Questions

- None outstanding — the one open item from an earlier draft of this design (how `Measurements.razor` gets photo counts without per-row round-trips) is resolved by Decision 4 (`PhotoCount` folded into the existing `MeasurementData` contract).
