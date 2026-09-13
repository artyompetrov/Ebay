## 1. Shared domain rule

- [x] 1.1 Add `MeasurementStateExtensions.IsHiddenFromPublicListing(this MeasurementState state)` (`state == MeasurementState.Sold`) in `Server.Domain.Measurements`; verify with a new unit test class (`[TestOf(typeof(MeasurementStateExtensions))]`) covering all three enum values.
- [x] 1.2 Replace the duplicated inline check `info.MeasurementState is not MeasurementState.Selling and not MeasurementState.Created` in `MeasurementPlotService.PlotForEbay` and `MeasurementPlotService.GetEbayTubeDescription` with `info.MeasurementState.IsHiddenFromPublicListing()`; verify existing chart-related tests (e.g. `Tests.Integration/Tests/ProductMeasurementFlowTests.cs`) still pass unchanged.

## 2. Application-layer photo service

- [x] 2.1 Add a `MeasurementPhotoContent(byte[] Content, string ContentType)` result type (or equivalent) alongside `MeasurementPhotoService`.
- [x] 2.2 Add a transparent 1x1 PNG byte-array constant and `image/png` content type to `MeasurementPhotoService` as the placeholder, following the existing pattern of trivial placeholder builders such as `MeasurementPlotService.StatusSvg`.
- [x] 2.3 Add `MeasurementPhotoService.GetContentAsync(measurementId, photoId, cancellationToken)`: look up `MeasurementInfo` via `IMeasurementQueries`; return `null` if the measurement does not exist; return the placeholder result if `IsHiddenFromPublicListing()`; otherwise fetch the real photo via `IMeasurementPhotoQueries.Get` and return its content/content type, or `null` if the photo does not exist.
- [x] 2.4 Change `MeasurementPhotoService.GetThumbnailContentAsync` to the same shape: return the placeholder result when hidden, otherwise fetch via `IMeasurementPhotoQueries.GetThumbnail` and return it with `image/jpeg`, or `null` if missing.
- [x] 2.5 Add unit tests for both service methods (`[TestOf(typeof(MeasurementPhotoService))]`) covering: not-sold measurement returns real content, sold measurement returns the placeholder without calling `IMeasurementPhotoQueries`, and unknown measurement/photo returns `null`.

## 3. Thin controller

- [x] 3.1 Change `WebApiController.GetMeasurementPhotoContent` to call `MeasurementPhotoService.GetContentAsync` instead of `IMeasurementPhotoQueries.Get` directly, returning `NotFound()` when the result is `null` and `File(result.Content, result.ContentType)` otherwise; remove the now-unused direct `IMeasurementPhotoQueries` dependency from the controller if nothing else in it uses it. (Note: `IMeasurementPhotoQueries` is still used by `GetMeasurementPhotoCounts`/deletion-order logic elsewhere in the controller, so the field itself is kept; only the now-unused `ThumbnailContentType` constant was removed.)
- [x] 3.2 Change `WebApiController.GetMeasurementPhotoThumbnailContent` to use the content type returned by `MeasurementPhotoService.GetThumbnailContentAsync` instead of the hardcoded `ThumbnailContentType` constant, removing that constant if it becomes unused; verify the controller has no remaining state/branching logic beyond translating the service result to an HTTP response.

## 4. eBay listing page thumbnail sizing

- [x] 4.1 In `EbayLotDescriptionPage.cshtml`, replace `.measurement-photo-thumb`'s `width: 100px; height: 100px; object-fit: cover;` with `max-width: 100px; max-height: 100px; width: auto; height: auto;`; verify visually (or via a rendered-HTML snapshot check) that a normal photo still displays capped at roughly the same scale.

## 5. Integration coverage

- [x] 5.1 Extend `Tests.Integration/Tests/MeasurementPhotosFlowTests.cs` with cases for a sold measurement: `GET .../photos/{photoId}/content` and `GET .../photos/{photoId}/thumbnail/content` both return 200 with a valid image body that is not the real photo's bytes (and not a 404, not an error), while the same requests for a non-sold measurement remain unchanged (existing behavior, already covered by the pre-existing tests in this file). Also covers a sold measurement with an unknown photo id still returning the placeholder (200) rather than 404, per the accepted design trade-off.
- [x] 5.2 Add a case confirming a sold measurement's photo/thumbnail response content type is a valid image type (e.g. `image/png`) so no client would treat it as a broken image.

## 6. Final checks

- [x] 6.1 Run `./scripts/agent-check/agent-check.sh` from the repository root and resolve any findings before considering the change complete.
- [x] 6.2 Apply the same `[ResponseCache(Duration = 60 * 5)]` (Release-only, `#if !DEBUG`) policy already used for the state-dependent chart endpoints (`MeasurementPageController.GetEbayCurves`/`GetEbayTubeDescription`) to `WebApiController.GetMeasurementPhotoContent` and `GetMeasurementPhotoThumbnailContent`, so a cache cannot keep serving pre-sale photo bytes indefinitely after the measurement is sold.
