## Why

Buyers of used radio tubes want visual proof of the exact physical unit and its measurement setup before buying, not just the anode/grid curve plots. Upload, download, and delete plumbing for measurement photos was partially built (`MeasurementPhoto` aggregate, EF storage, upload/delete/content API endpoints, and a phone-oriented scan-and-upload page) but the feature was never wired end-to-end: staff have no way to manage photos from the office measurements table, and the eBay listing description page — the actual customer-facing surface — never shows the photos at all. This change finishes the feature so photos flow from phone capture to the live eBay listing.

## What Changes

- Let office staff open and manage a measurement's photos directly from the `Measurements.razor` product page (the internal measurements table), without needing to scan a barcode first — including deleting a previously uploaded photo.
- Show a photo count/indicator per row in `Measurements.razor` so staff know which measurements already have photos, backed by a new lightweight metadata-only query (avoids loading photo binary content just to count/list them).
- Render uploaded measurement photos on `EbayLotDescriptionPage.cshtml` (the page whose HTML is pulled into the eBay listing description) for each tube row, following the same `<img>`-per-item pattern already used for product passports.
- Add a `IMeasurementPhotoQueries` method to fetch photo metadata (no binary content) for one or many measurement ids in a single batched call, used by both the office page and the eBay description page to avoid N+1 queries and unnecessary content transfer.
- No changes to the existing phone scan-and-upload flow (`MeasurementPhotos.razor`) or the existing upload/delete/content API contracts — this change only adds consumers of the existing API plus the one new metadata query.

## Capabilities

### New Capabilities
- `measurement-photos`: End-to-end capability covering measurement photo upload (phone), storage, retrieval (metadata and binary content), display on the eBay listing description, and deletion from both the phone page and the internal office measurements page.

### Modified Capabilities
(none — no other existing spec'd capability changes requirements)

## Impact

- Affected code:
  - `src/Ebay/Server.Application.Abstractions.Driven/Abstractions/Queries/IMeasurementPhotoQueries.cs` — new batched metadata query method.
  - `src/Ebay/Server.Adapters.Driven.EF.ReadModel/Queries/MeasurementPhotoQueries.cs` — implementation of the new query.
  - `src/Ebay/Server.Adapters.Driving.WebApi/Pages/EbayLotDescriptionPage.cshtml` and `.cshtml.cs` — load and render measurement photos per tube row.
  - `src/Ebay/Frontend/Pages/Measurements.razor` — add photo count indicator and a management link per measurement row, including delete.
  - `src/Ebay/Frontend/Pages/MeasurementPhotos.razor` — allow entry via a direct measurement id (no forced barcode scan) so it can be opened from the office page.
  - `src/Ebay/Server.Contracts/WebApi/WebApi.yaml` and `WebApiController.cs` — new batched `GET /measurements/photos/counts` endpoint so `Measurements.razor` can show per-row counts in one call.
- No database schema changes expected (existing `MeasurementPhoto` table/aggregate already supports everything needed).
- No breaking changes to any existing contract — `WebApi.yaml` gains one new, additive endpoint; the legacy `Server.Contracts/Legacy/Ebay.yaml` (`MeasurementData`) is left untouched per project rules against adding new changes there.
