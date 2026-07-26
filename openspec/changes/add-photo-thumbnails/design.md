## Context

Measurement photos (`MeasurementPhoto` aggregate, `Server.Domain/Measurements/MeasurementPhoto.cs`) are stored as a single `byte[] Content` column with no derivative sizes. Today two surfaces render them:
- `MeasurementPhotos.razor` ("Фото измерений", phone-oriented upload/manage page): lists photos as plain filename links (`<a href="{content url}">{FileName}</a>`), no image preview at all.
- `EbayLotDescriptionPage.cshtml` (rendered into the live eBay listing): renders one full-size `<img class="measurement-photo">` per photo, stacked vertically inside the tube's `<td>` (`display: block; margin: 10px auto 0`), each pointing directly at the full-content endpoint (`/measurements/{measurementId}/photos/{photoId}/content`).

Both surfaces currently force every viewer (staff on a phone connection, or any buyer/eBay crawler loading the listing) to download the original, potentially multi-megabyte photo just to see a preview. There is no existing image-processing dependency anywhere in the solution (checked: no ImageSharp/SkiaSharp/System.Drawing usage).

## Goals / Non-Goals

**Goals:**
- Serve a small, size-capped preview ("thumbnail") of each photo by default on both surfaces, with the original full photo only loaded on click.
- Generate the thumbnail once, at upload time, and store it alongside the original.
- Keep the eBay description page's photo block horizontal per tube row instead of the current vertical stack.
- Avoid loading full photo `Content` when only a thumbnail is needed (same over-fetch concern already addressed for metadata in the prior `measurement-photos` change).

**Non-Goals:**
- No CDN, external image service, or client-side (browser) resizing — thumbnails are generated and served by the backend.
- No configurable thumbnail sizes/quality per surface — a single thumbnail size is used everywhere for this change.
- No change to the original photo storage format, the upload API contract, or the delete/reorder behavior.
- No admin tooling to force-regenerate thumbnails (e.g. after changing target size/quality later) — out of scope; would be a separate change if needed.
- No backfill for photos uploaded before this change — those simply have no thumbnail; requesting a thumbnail for them returns 404 like any other missing photo/thumbnail. If backfilling them ever matters, that's a separate change.

## Decisions

1. **Add a `ThumbnailContent byte[]?` column to the `MeasurementPhoto` aggregate, generated once at upload time.**
   The aggregate already owns `Content`; storing the thumbnail alongside it (same table, same lifecycle, deleted together) is simpler than a separate table and keeps the aggregate boundary unchanged. `MeasurementPhoto.Create(...)` computes and stores the thumbnail as part of creation — there is no other write path that sets it, and no lazy/on-read generation. Photos uploaded before this change was deployed simply have `ThumbnailContent == null` and are not backfilled (see Non-Goals).
   - *Alternative considered*: separate `MeasurementPhotoThumbnail` table/aggregate. Rejected — no independent lifecycle or ownership need; would add a join for a 1:1 relationship that gains nothing.
   - *Alternative considered*: compute thumbnails on every request, no storage. Rejected — repeats CPU-bound resize work on every page view of the eBay description page (which has no caching layer for this content, per the prior design's accepted risk), for an image that never changes after upload.

2. **Thumbnail generation is a new port (`IPhotoThumbnailGenerator` in `Server.Application.Abstractions.Driven`) implemented by a new adapter project using SixLabors.ImageSharp.**
   `Server.Application.New` must not reference adapters directly (hexagonal rule in `src/Ebay/AGENTS.md`), so the resize operation is abstracted behind a port: `byte[] CreateThumbnail(byte[] originalContent, string contentType)`, producing a JPEG capped at a fixed longest-edge dimension (400px) and quality (75), regardless of the original format (including already-small images — the operation still normalizes to JPEG so the serving endpoint has one predictable content type to return). Implemented in a new `Server.Adapters.Driven.ImageProcessing` project, registered `Transient` (stateless, no fields) per the project's default DI rule.
   - *Alternative considered*: SkiaSharp. Rejected — pulls in platform-specific native asset packages (`SkiaSharp.NativeAssets.Linux`/`.Win32`) that complicate the existing single `Dockerfile` build across environments; ImageSharp is pure managed code, simpler to reference from one adapter project regardless of target OS.
   - *Alternative considered*: `System.Drawing.Common`. Rejected — Microsoft explicitly discourages non-Windows use and it is unsupported in Linux containers, which this solution's `Dockerfile` targets.

3. **Thumbnail retrieval is a plain read: return the stored thumbnail, or 404 if the photo or its thumbnail doesn't exist.**
   `MeasurementPhotoService` gets a new method, `GetThumbnailContentAsync(measurementId, photoId, cancellationToken)`, backed by a dedicated query, `IMeasurementPhotoQueries.GetThumbnail(measurementId, photoId)`. This is implemented as its own EF `.Select(...)` projection against `ReadDbContext` — the same pattern already used by `GetMetadataByMeasurementIds` — so the generated SQL selects only the `ThumbnailContent` column for the matching row. It does **not** load `MeasurementPhotoInfo`/the full row (with `Content`) and filter/project in memory, and it does not go through `IMeasurementPhotoRepository` or the write-model aggregate at all — this is a read-model-only path. No generation happens on read — a photo uploaded before this change (or, in principle, any row where `ThumbnailContent` is null) simply resolves to "not found" for the thumbnail endpoint, same as a nonexistent photo id.
   - *Alternative considered*: generate-and-persist lazily on first read for photos missing a thumbnail. Rejected per explicit scope decision — existing photos are not being carried forward with thumbnails; keeping the read path a pure query (no write-model dependency, no mutation-on-read) is simpler and matches how every other read in this capability behaves.
   - *Alternative considered*: reuse `IMeasurementPhotoQueries.Get(measurementId, photoId)` (which returns `MeasurementPhotoInfo`, including `Content`) and just read `.ThumbnailContent` off it / ignore `Content`. Rejected — that fetches the full binary from Postgres over the wire only to discard it, the exact over-fetch problem `GetMetadataByMeasurementIds` was already introduced to avoid for metadata; the thumbnail path needs its own equally narrow projection.

4. **New endpoint: `GET /api/webapi/v1/measurements/{measurementId}/photos/{photoId}/thumbnail/content`, mirroring the existing full-content endpoint's shape.**
   Added to `Server.Contracts/WebApi/WebApi.yaml` alongside the existing `/measurements/{measurementId}/photos/{photoId}/content` operation (both are exposed under the `/api/webapi/v1` base path already configured for this contract's `servers:` entry), same 404-if-missing semantics, response content type `image/jpeg` (since Decision 2 always normalizes to JPEG). `WebApiController` calls the new `MeasurementPhotoService.GetThumbnailContentAsync`.
   - *Alternative considered*: query-string flag on the existing content endpoint (e.g. `?size=thumbnail`). Rejected — the existing endpoint's contract/response schema is documented as "photo binary" with the stored content type; overloading it with a derived, always-JPEG variant behind a query flag is less discoverable and mixes two different caching/response-type concerns on one operation.

5. **Frontend rendering: both surfaces point `<img src>` at the new thumbnail endpoint and wrap the image in an `<a href="{full-content endpoint}">`.**
   - `MeasurementPhotos.razor`: replace the `<a>{FileName}</a>` list item content with `<a href="@GetPhotoUrl(photo.Id)" target="_blank"><img src="@GetThumbnailUrl(photo.Id)" ... /></a>`, keeping the filename as the image's `alt`/a small caption next to it, and keeping the existing delete button.
   - `EbayLotDescriptionPage.cshtml`: wrap the per-tube photo loop in a flex container (`display: flex; flex-wrap: wrap; gap: 8px;`) replacing the current `display: block` vertical stack, with each `<img class="measurement-photo-thumb">` now sized to the thumbnail's fixed dimensions and wrapped in `<a href="{full-content url}" target="_blank">`.
   - No JavaScript lightbox/modal is introduced — "click to see full photo" is a plain link navigation (new tab), consistent with how the existing passport gallery and this page's other full-size images already behave (`target="_blank"` link pattern already used elsewhere on this page and on `MeasurementPhotos.razor`).

## Risks / Trade-offs

- [Risk] Photos uploaded before this change have no thumbnail, so their list/gallery entries on both surfaces would show a broken image if pointed at the thumbnail endpoint → *Mitigation*: accepted as-is per explicit scope decision (no backfill); this is a one-time cosmetic gap for old photos that resolves itself as old measurements get re-photographed or as a future change adds backfill if it turns out to matter.
- [Risk] Normalizing all thumbnails to JPEG discards transparency for any non-JPEG originals (unlikely for camera photos, but possible if a staff member uploads a PNG/screenshot) → *Mitigation*: acceptable for this use case (photos of physical tubes, not graphics needing transparency); flattening onto a white background before JPEG encoding avoids a black-background artifact.
- [Risk] Adding a new image-processing NuGet dependency increases build/publish size and introduces a third-party license (ImageSharp's Six Labors Split License) → *Mitigation*: ImageSharp is free for this project's use (not a paid/commercial-scale product); flagged here for visibility, no action needed unless the project's licensing posture changes.
- [Trade-off] Storing the thumbnail as a second `byte[]` column on the same row grows the `MeasurementPhoto` table size per photo → acceptable since a 400px-capped JPEG is a small fraction (typically single-digit KB to low tens of KB) of the original photo size already stored in the same row.

## Migration Plan

- EF write-model migration adds the nullable `ThumbnailContent` (and stores its content type as always `image/jpeg`, so no separate content-type column is needed for the thumbnail) to the existing `MeasurementPhoto` table — additive, no data loss, no downtime. Existing rows get `NULL` and are left as-is; no data backfill script.
- Deploy order: domain/migration change → thumbnail-generation port + adapter → `MeasurementPhotoService` upload changes → new WebApi contract endpoint + controller wiring → `MeasurementPhotos.razor` → `EbayLotDescriptionPage.cshtml`. Each step is additive; the frontend/page changes are only meaningful once the endpoint exists, but shipping them together in one change is fine since there's no independent rollout need.
- Rollback: revert the relevant commit(s). The added `ThumbnailContent` column can remain (nullable, unused) if only the frontend/endpoint parts are rolled back; a full rollback including the migration is a standard EF migration revert.

## Open Questions

- None outstanding.
