## Context

See `proposal.md` for motivation. Relevant current-state facts this design builds on:

- `EbayLotDescriptionPage.cshtml` renders two real `<img>` tags per photo (thumbnail + full-size hover preview). Both are eagerly fetched by the browser on page load regardless of interaction.
- `WebApiController.GetMeasurementPhotoContent` / `GetMeasurementPhotoThumbnailContent` each run two live DB round trips per request: `IMeasurementInfoQueries.GetMeasurementInfo` (sold-state check) and a blob read (`IMeasurementPhotoQueries.Get` / `GetThumbnail`). Neither is cached or concurrency-limited today.
- `MeasurementPlotService` (curves/description SVGs) already solves a structurally identical problem via `DbCache` (a DB-persisted, 1-year-TTL cache keyed by content hash of inputs) gated by `DatabaseConcurrentAccessSemaphore` (`maxConcurrent = MaxPoolSize / 2`). `DbCache` lives directly in the legacy `Server.Application` project, which its own registration comment marks as "do not expand with new code."
- `IMemoryCache` is already registered (`builder.Services.AddMemoryCache()` in `Program.cs`) but nothing consumes it yet.
- `PhotoThumbnailGenerator` (`Server.Adapters.Driven.ImageProcessing`, behind port `IPhotoThumbnailGenerator`) already resizes/re-encodes at upload time for the thumbnail (max 400px long side, JPEG quality 75, via SkiaSharp). The "original" `Content` is stored as uploaded, with no size bound.
- Single app instance (docker-compose), single Postgres instance, `MaxPoolSize=60` in production, shared with EF writes, ASP.NET Identity, and MassTransit's SQL transport polling.
- Established precedent for one-time/idempotent startup work already exists in this codebase: `MeasurementPlotWarmupHostedService`, `DbCacheCleanupHostedService`, `SaleAdvertisementCleanupBackgroundTask`.

## Goals / Non-Goals

**Goals:**
- Reduce DB round trips per image request to just the live sold-state check on a cache hit.
- Reduce the number of image HTTP requests the browser issues per eBay page load.
- Bound stored "original" photo bytes so both DB storage and cache entries stay small, for new uploads and for photos already stored.

**Non-Goals:**
- Not changing the sold-state placeholder mechanism or its ~5 minute HTTP cache window - the live per-request check stays exactly as it is.
- Not introducing a distributed cache (Redis, etc.) - single app instance, no cross-instance coherence problem to solve.
- Not restructuring `DbCache` into a proper port/adapter - real cleanup, but a separate concern from this change; called out as a TODO.
- Not touching the internal staff "Фото измерений" page's hover-preview markup - the fan-out problem is specific to the public eBay page's traffic pattern.
- Not adding object storage/CDN for photo blobs - unnecessary once fan-out and blob size are fixed.

## Decisions

### 1. One shared `IMemoryCache` instance for both photos and curves, size-bounded
Register a single bounded cache (`MemoryCacheOptions.SizeLimit`) and use it from both `MeasurementPhotoService` (new) and `MeasurementPlotService` (as an L1 in front of the existing `DbCache`, which remains as the restart-durable L2). One shared budget is simpler to reason about and tune than two independently-sized caches competing for the same process memory. Every `Set` call must specify `SetSize(...)` in bytes (the actual payload length) - without it `SizeLimit` has nothing to evict against. Add `SlidingExpiration` so cold entries age out under the limit instead of the cache always filling to the ceiling with old listings nobody is viewing.

`IMemoryCache` is injected directly into `Server.Application` / `Server.Application.New` services with no bespoke port - it is a first-party, already-abstracted framework interface (same category as `ILogger`/`IOptions`, both already used directly in this codebase), not a genuine external-system boundary like EF/SkiaSharp/SMTP that this project reserves ports+adapters for.

Cache key shape: `photo-content:{photoId}` / `photo-thumb:{photoId}` for photos; the existing `DbCache` key strings for curves (reused as-is for the L1 key too, so both layers agree on identity).

**Alternative considered**: separate `IMemoryCache` instances per concern (independent size limits). Rejected for now - adds a second knob to tune with no clear benefit at current scale; revisit if one workload starves the other in practice.

### 2. Cache only the immutable bytes, never the sold/not-sold decision
`MeasurementPhotoService.GetContentAsync`/`GetThumbnailContentAsync` keep checking `IsHiddenFromPublicListing()` on every request, uncached. Only the real bytes returned from the "not hidden" branch go into the cache. This is what keeps the sold-placeholder swap prompt: a cache entry for a photo that later gets sold is simply never consulted again, because the state check now short-circuits to the placeholder before the cache lookup.

### 3. Cache invalidation on delete
`MeasurementPhotoService.DeleteAsync` evicts both the content and thumbnail cache entries for the deleted `photoId` after the delete succeeds. No invalidation is needed for the order-shifting side effect on other photos - order is not part of the cached value.

### 4. Deferred full-size image: CSS `background-image` instead of `<img src>`
Replace the full-size preview's `<img class="photo-hover-full" src="...">` with a `background-image` declared in a small inline `<style>` block scoped to that photo's existing `:checked` checkbox toggle (the same checkbox-driven pattern the page already uses for the hover/tap preview and the passport section). Browsers do not eagerly fetch a `background-image` referenced only inside a selector that has not matched yet, unlike a literal `<img src>`, which always fetches on parse. The thumbnail stays a real `<img>` since it must always render.

**Risk called out explicitly**: this depends on eBay's listing-description sanitizer preserving a `<style>` block per photo. The page already relies on `<style>` + checkboxes elsewhere (photo-hover, passport toggle) and that already works in production, so this is a reasonable bet - but it should be verified against a real eBay listing before this is considered done, not just trusted from local rendering.

### 5. Bounded original size via the existing image-processing adapter
Add a second bound to `Server.Adapters.Driven.ImageProcessing` (same adapter/port family as `IPhotoThumbnailGenerator`, same SkiaSharp toolset) rather than a new adapter project - this is the same external capability (image encode/decode), just a second output profile. Proposed bound: **long side capped at 2000px, JPEG quality 85** - generous enough to preserve the tube/getter-flash/print detail buyers zoom in on, while eliminating multi-megabyte phone-camera originals. Applied at upload time before storing `Content`; a photo already within bound is stored without re-encoding.

### 6. One-time migration as an idempotent startup hosted service
Follow the existing pattern (`MeasurementPlotWarmupHostedService`, `DbCacheCleanupHostedService`): a hosted service that, on startup, scans `MeasurementPhoto` rows whose `Content` exceeds the bound, re-encodes them with the same adapter used for new uploads, and updates the row. Rows already within bound are skipped, making repeated runs (every deploy) a cheap no-op after the first pass - no separate "did this already run" marker needed, and no manual/ops-triggered script to remember to run.

**Alternative considered**: a manually-triggered one-off script/endpoint. Rejected - this project already has a working convention for exactly this shape of task, and idempotent-by-comparison is simpler than idempotent-by-marker.

## Risks / Trade-offs

- [Risk] eBay's sanitizer strips the per-photo `<style>` block or the `:checked` selector → Mitigation: verify against a real listing before rollout; if it fails, the fallback is `loading="lazy"` on the `<img>` (weaker, browser-heuristic-dependent, but zero backend risk) rather than reverting to fully eager loading.
- [Risk] Unbounded `IMemoryCache` growth across many listings/photos over time → Mitigation: explicit `SizeLimit` + per-entry `Size` + `SlidingExpiration`, covered by requirement scenarios in the spec delta.
- [Risk] A wiring bug caches the placeholder instead of real bytes (or vice versa), silently breaking the sold-swap guarantee → Mitigation: the cache is only ever populated from the "not hidden" branch's return value, never from the placeholder branch; add a unit test asserting the placeholder path never touches the cache.
- [Risk] Recompressing originals is lossy and irreversible → Mitigation: bound chosen (2000px/quality 85) to stay visually indistinguishable for this use case; confirm with the user before implementing since it can't be cheaply undone later.
- [Risk] Startup migration re-encoding rows concurrently with a staff upload/delete → Mitigation: idempotent per-row check-then-update is safe to race with a delete (harmless update-then-delete) and safe to race with a fresh upload (new uploads are already within bound, so the migration is a no-op for them).

## Migration Plan

- Ship order: the bounded-encoder change and the startup backfill service ship together (backfill reuses the same encoding constants as new uploads). The memory-cache and deferred-loading changes are independent and can ship in the same or a separate deploy.
- Rollback: the cache and deferred-loading changes are purely additive/behavioral and safe to revert independently with no data impact. The backfill is a one-way data change (recompression is lossy); if a rollback is ever needed, it requires restoring affected rows from a DB backup rather than an automated reversal.
