## 1. Bounded original photo encoding

- [ ] 1.1 Add a bounded "original" encoding profile to the image-processing adapter (`Server.Adapters.Driven.ImageProcessing`, alongside the existing thumbnail profile: long side capped at 2000px, JPEG quality 85) and verify with a unit test (mirroring `PhotoThumbnailGeneratorTests`) covering both an oversized image being resized within bound and an already-small image passing through without unnecessary re-encoding.
- [ ] 1.2 Wire `MeasurementPhotoService.UploadAsync` to run uploaded content through the bounded-original encoder before storing `Content`, and verify via `MeasurementPhotoServiceTests` that an oversized upload is stored within bound while thumbnail generation behavior is unchanged.

## 2. Backfill existing oversized photos

- [ ] 2.1 Add an idempotent startup hosted service (mirroring `MeasurementPlotWarmupHostedService`) that scans `MeasurementPhoto` rows whose stored `Content` exceeds the bound from 1.1, re-encodes them with the same encoder, and updates the row in place; verify with an integration test seeding an oversized photo row and asserting it is within bound after the service runs once, while an already-compliant row is left byte-for-byte unchanged.
- [ ] 2.2 Register the new hosted service in DI (`Server.Application.New` service registration) and verify the app still starts cleanly with the seeded integration test database.

## 3. In-memory cache for photo content/thumbnail

- [ ] 3.1 Add an options class (`SectionName`, `SizeLimit`/related knobs) for the shared `IMemoryCache` budget per the project's Configuration And Options convention, bind it via `AddOptions<T>().BindConfiguration(...)`, and verify with a unit test that validation/defaults behave as expected.
- [ ] 3.2 Update `MeasurementPhotoService.GetContentAsync` / `GetThumbnailContentAsync` to keep the `IsHiddenFromPublicListing()` check live and uncached, and to serve/populate the real bytes through `IMemoryCache` (with `SetSize` set to the payload length and a `SlidingExpiration`) only on the non-hidden branch; verify with a unit test asserting the underlying `IMeasurementPhotoQueries.Get`/`GetThumbnail` call happens at most once across two consecutive requests for the same non-sold photo.
- [ ] 3.3 Verify with a unit test that the placeholder branch (sold measurement) never reads from or writes to the cache, so cached bytes can never leak past a sale and a later state change is never masked by a stale cache entry.
- [ ] 3.4 Update `MeasurementPhotoService.DeleteAsync` to evict both the content and thumbnail cache entries for the deleted photo id after the delete succeeds, and verify with a unit test that a previously cached photo's bytes are no longer served after deletion.

## 4. In-memory L1 cache in front of the curves/description `DbCache`

- [ ] 4.1 Wrap `MeasurementPlotService`'s existing `DbCache.GetOrCreateAsync` calls with an `IMemoryCache` lookup keyed on the same cache key string (populated from the `DbCache` result on miss, reusing the shared cache from Section 3), and verify with a unit test asserting the underlying `DbCache`/query path is not re-invoked on a second in-process call for the same key.
- [ ] 4.2 Verify (via existing or adjusted tests for `PlotForEbay` / `GetEbayTubeDescription`) that the sold-state short-circuit still runs before any cache lookup, so behavior for a sold measurement is unchanged.

## 5. Deferred loading of the full-size hover image

- [ ] 5.1 Change `EbayLotDescriptionPage.cshtml` so each photo's full-size preview is rendered as a `background-image` inside an inline `<style>` block scoped to that photo's existing `:checked` toggle, instead of a real `<img src>`, while the thumbnail stays a real eagerly-loaded `<img>`; verify with a test asserting the rendered HTML contains the thumbnail's `<img src="...">` but references the full-content URL only inside a CSS rule, not as an `<img src>`.
- [ ] 5.2 Manually verify against a real (or sandboxed) eBay listing description that the per-photo `<style>` block survives eBay's description sanitizer and that hover/tap-to-preview still behaves exactly as before (centered overlay, dimmed backdrop on tap, no navigation). This is the one item design.md flags as needing a real-listing check rather than just local rendering - do not mark it done on local testing alone.

## 6. Cross-cutting verification

- [ ] 6.1 Run `./scripts/agent-check/agent-check.sh` from the repository root and confirm it passes.
- [ ] 6.2 Run `openspec validate optimize-ebay-lot-images --strict` and confirm it still passes after any wording adjustments made while implementing.
- [ ] 6.3 Load the eBay description page locally for a lot with several photos and confirm, via browser dev tools' network tab, that the number of image requests on initial load matches the new expectation (one request per thumbnail, zero for full-size images until a hover/tap), and that a sold measurement's photos still resolve to the placeholder.
