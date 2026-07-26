## 1. Domain and storage

- [ ] 1.1 Add `ThumbnailContent` (`byte[]?`) to `MeasurementPhoto` (`Server.Domain/Measurements/MeasurementPhoto.cs`), set via `Create(...)` at construction time only (no mutator — thumbnails are never generated after upload).
- [ ] 1.2 Add an EF write-model migration for the new nullable column (`dotnet ef migrations add AddMeasurementPhotoThumbnail --project Server.Adapters.Driven.EF.WriteModel.Migrations --startup-project Server --context Server.Adapters.Driven.EF.WriteModel.WriteModelDbContext --output-dir Migrations/WriteModelDb`, run from `src/Ebay`). Existing rows get `NULL` — no backfill.

## 2. Thumbnail generation port and adapter

- [ ] 2.1 Add `IPhotoThumbnailGenerator` port to `Server.Application.Abstractions.Driven` with a method to produce a JPEG thumbnail (fixed longest-edge size, e.g. 400px) from original image bytes + content type.
- [ ] 2.2 Create adapter project `Server.Adapters.Driven.ImageProcessing`, add the SixLabors.ImageSharp package reference, implement `IPhotoThumbnailGenerator` (resize preserving aspect ratio, flatten transparency onto white, encode as JPEG).
- [ ] 2.3 Register the adapter's implementation as `Transient` in its `ServiceCollectionExtensions`, and wire that extension into the composition root (`Server`).

## 3. Application service and read queries

- [ ] 3.1 `MeasurementPhotoService.UploadAsync`: generate the thumbnail via `IPhotoThumbnailGenerator` and pass it into `MeasurementPhoto.Create(...)`.
- [ ] 3.2 Add `MeasurementPhotoService.GetThumbnailContentAsync(measurementId, photoId, cancellationToken)`: a pure read — return the stored thumbnail bytes (with `image/jpeg` content type), or `null`/not-found if the photo or its thumbnail doesn't exist. No generation, no write-model access, on this path.
- [ ] 3.3 Add `IMeasurementPhotoQueries.GetThumbnail(measurementId, photoId, cancellationToken)` returning a lightweight result (thumbnail bytes or null).
- [ ] 3.4 Implement it in `Server.Adapters.Driven.EF.ReadModel/Queries/MeasurementPhotoQueries.cs` as its own EF `.Select(...)` projection (same shape as `GetMetadataByMeasurementIds`) that selects only the `ThumbnailContent` column at the SQL level. Do not implement it by calling `Get`/loading `MeasurementPhotoInfo` (which carries `Content`) and reading one field off it — that fetches the full photo binary just to discard it.

## 4. API contract and controller

- [ ] 4.1 Add `GET /measurements/{measurementId}/photos/{photoId}/thumbnail/content` to `Server.Contracts/WebApi/WebApi.yaml` (served under the contract's existing `/api/webapi/v1` base path), mirroring the existing `/content` operation (binary response, 404 on missing photo/thumbnail), fixed `image/jpeg` response content type.
- [ ] 4.2 Implement the generated controller method on `WebApiController` calling `MeasurementPhotoService.GetThumbnailContentAsync`, returning 404 when the photo or its thumbnail doesn't exist.

## 5. Frontend: phone-oriented management page

- [ ] 5.1 In `Frontend/Pages/MeasurementPhotos.razor`, replace each list item's plain filename link with a thumbnail `<img>` (sourced from the new thumbnail endpoint) wrapped in the existing `<a href="{full content url}" target="_blank">`, keeping the filename visible (e.g. as `alt`/small caption) and the existing delete button untouched.
- [ ] 5.2 Add a small helper (mirroring `GetPhotoUrl`) to build the thumbnail URL, e.g. `GetThumbnailUrl(photoId)`.

## 6. eBay listing description page

- [ ] 6.1 In `EbayLotDescriptionPage.cshtml`, change the per-tube photo block from a vertical stack of full-size `<img class="measurement-photo">` to a horizontal flex row (`display: flex; flex-wrap: wrap; gap: 8px;`) of thumbnail images.
- [ ] 6.2 Point each thumbnail `<img>` at the new thumbnail endpoint and wrap it in `<a href="{existing full-content url}" target="_blank">` so clicking opens the full photo.
- [ ] 6.3 Update the `.measurement-photo` CSS rule (rename/adjust as needed) to a fixed thumbnail size instead of `max-width: 300px` full-size scaling.

## 7. Verification

- [ ] 7.1 Add/update unit tests for `MeasurementPhotoService` covering: thumbnail generated and stored on upload; `GetThumbnailContentAsync` returns the stored thumbnail; returns not-found when the photo (or its thumbnail) doesn't exist.
- [ ] 7.2 Add/update integration test coverage (`Tests.Integration`) for the new thumbnail endpoint: thumbnail for a freshly uploaded photo, 404 for a missing/nonexistent photo.
- [ ] 7.3 Run `./agent-check.sh` from the repository root before opening a PR.
