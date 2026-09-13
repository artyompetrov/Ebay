## Why

After adding measurement-photo thumbnails/full photos to the eBay lot description page, that page got much slower and some images intermittently fail to load. Every photo renders two real `<img>` tags (thumbnail + full-size hover preview), both eagerly fetched by the browser regardless of whether the visitor ever hovers; each of those requests runs two uncached, unthrottled database round trips (a live sold-state check plus a raw blob read). Under concurrent visitors this fans out into a burst of DB-bound requests that can exhaust the Postgres connection pool, so some images time out instead of loading. This needs fixing without weakening the existing "sold tube swaps to a placeholder within ~5 minutes" behavior, since the eBay page itself is static and only the image endpoints can reflect state changes after eBay last fetched it.

## What Changes

- Serve resolved photo/thumbnail bytes (and rendered curve/description graphics) from an in-memory cache after the first fetch, bounded by a size limit and eviction policy, so repeat requests for the same non-sold photo/graphic don't repeat a database read. The live sold-state check stays uncached so the placeholder swap still takes effect promptly.
- Stop eagerly loading the full-size hover-preview image: replace its `<img src>` with a CSS-only (`:checked`-driven `background-image`) mechanism so the browser only fetches it when a viewer actually hovers/taps, instead of on every page load.
- Cap the stored "original" photo to a bounded resolution/quality at upload time (mirroring the existing thumbnail generator's approach), instead of storing whatever the phone camera produced. Migrate previously uploaded photos to the same bound.

## Capabilities

### New Capabilities
_None._

### Modified Capabilities
- `measurement-photos`: the full-size preview on the eBay description page is no longer fetched until the viewer interacts with a thumbnail; photo/thumbnail content is served from an in-memory cache rather than a live database read on every request; stored original photo content is bounded to a maximum resolution/quality, both for newly uploaded photos and for photos already stored before this change.

## Impact

- `Server.Adapters.Driving.WebApi/Controllers/WebApiController.cs` (photo content/thumbnail endpoints)
- `Server.Application.New/MeasurementPhotoService.cs`
- `Server.Adapters.Driving.WebApi/Pages/EbayLotDescriptionPage.cshtml` (hover-preview markup/CSS)
- `Server.Adapters.Driven.ImageProcessing` (upload-time compression, reused/extended for the "original" bound)
- `Server.Application/Services/MeasurementPlot/MeasurementPlotService.cs` (adds an in-memory cache layer in front of the existing `DbCache`; implementation detail, no spec-level behavior change)
- A one-off migration/backfill for existing `MeasurementPhoto` rows whose stored content exceeds the new bound
- DI registration (`IMemoryCache` usage) in `Server.Application.New` / `Server.Application`
