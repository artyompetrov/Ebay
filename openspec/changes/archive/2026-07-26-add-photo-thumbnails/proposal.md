## Why

Measurement photos are currently served and displayed at their original, full-resolution size everywhere they appear. On the internal "Фото измерений" (`MeasurementPhotos.razor`) page, uploaded photos aren't shown at all — only a filename link — so staff can't visually confirm what was uploaded without opening each file. On the public eBay listing description page, photos are rendered full-size and stacked vertically per tube row, which makes the listing heavy (every viewer downloads full images just to see a gallery) and pushes the layout down awkwardly. We need a thumbnail concept so smaller preview images are shown by default, with the full photo only loaded when a buyer or staff member actually wants to see it.

## What Changes

- Introduce a thumbnail concept for measurement photos: a small, size-capped derivative generated once at upload time and served through a dedicated endpoint (`GET /api/webapi/v1/measurements/{measurementId}/photos/{photoId}/thumbnail/content`), separate from the existing full-content endpoint.
- `MeasurementPhotos.razor` ("Фото измерений"): render each photo as a thumbnail image in the list (instead of a bare filename link); clicking the thumbnail opens the full photo (existing full-content link behavior, now triggered from the image itself).
- `EbayLotDescriptionPage.cshtml`: replace the current vertical stack of full-size `<img>` tags per tube row with a horizontal row of thumbnails; clicking a thumbnail navigates to the full-size photo in a new tab.
- `ThumbnailContent` is a required field, like `Content` — there is no real photo data in production yet, so this change does not need to handle photos without a thumbnail.
- No changes to the existing upload/delete API contracts or to how the original photo content is stored — this change only adds a thumbnail derivative and its serving endpoint.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `measurement-photos`: add a thumbnail derivative generated at upload time, a new endpoint to retrieve it, and change both the office `MeasurementPhotos.razor` page and the `EbayLotDescriptionPage.cshtml` listing to display thumbnails (horizontally, on the eBay page) instead of full-size images, with click-through to the full photo.

## Impact

- Affected code:
  - `src/Ebay/Server.Domain/Measurements/MeasurementPhoto.cs` — add thumbnail content storage on the aggregate.
  - `src/Ebay/Server.Adapters.Driven.EF.WriteModel.Migrations` — new migration adding the thumbnail column.
  - `src/Ebay/Server.Application.Abstractions.Driven` — new port for generating a thumbnail from image bytes; new/updated models and query methods for thumbnail retrieval.
  - New adapter project (e.g. `Server.Adapters.Driven.ImageProcessing`) implementing the thumbnail-generation port using an image-resizing library.
  - `src/Ebay/Server.Application.New/MeasurementPhotoService.cs` — generate thumbnail on upload; read-only lookup for existing thumbnails (no generation on read).
  - `src/Ebay/Server.Adapters.Driven.EF.ReadModel/Queries/MeasurementPhotoQueries.cs` — query to fetch only thumbnail bytes (no full `Content`).
  - `src/Ebay/Server.Contracts/WebApi/WebApi.yaml` and `WebApiController.cs` — new `GET /api/webapi/v1/measurements/{measurementId}/photos/{photoId}/thumbnail/content` endpoint.
  - `src/Ebay/Frontend/Pages/MeasurementPhotos.razor` — render thumbnails in the photo list.
  - `src/Ebay/Server.Adapters.Driving.WebApi/Pages/EbayLotDescriptionPage.cshtml` — horizontal thumbnail row with click-through to full photo, replacing the current vertical full-size stack.
- No breaking changes to any existing endpoint; the new thumbnail endpoint is additive.
- New third-party dependency: a managed image-resizing library (decision and choice recorded in `design.md`).
