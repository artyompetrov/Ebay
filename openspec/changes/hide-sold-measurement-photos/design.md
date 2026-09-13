## Context

See proposal.md - Why. Relevant current state:

- `MeasurementPlotService` (`Server.Application/Services/MeasurementPlot/MeasurementPlotService.cs`) already hides chart content for a sold measurement: `PlotForEbay` and `GetEbayTubeDescription` both inline the check `info.MeasurementState is not MeasurementState.Selling and not MeasurementState.Created` and return a small `StatusSvg(...)` placeholder instead of the real chart when it matches. `MeasurementState` has exactly three values (`Created`, `Selling`, `Sold`), so this condition is equivalent to `state == Sold`, just phrased less directly, and duplicated verbatim in two places in the same class.
- The photo endpoints have no such check at all. `WebApiController.GetMeasurementPhotoContent` calls `IMeasurementPhotoQueries.Get` directly from the controller (bypassing the Application layer entirely - a pre-existing layering violation), and `GetMeasurementPhotoThumbnailContent` calls `MeasurementPhotoService.GetThumbnailContentAsync`, which calls `IMeasurementPhotoQueries.GetThumbnail`. Neither consults `MeasurementState`.
- Both endpoints are `[AllowAnonymous]`, embedded as `<img>` src on `EbayLotDescriptionPage.cshtml`, which is rendered once at listing-creation time and pasted into eBay's listing editor. eBay never re-fetches that HTML; only these image endpoints are hit live, per real visitor, for the lifetime of the listing. This is what makes the chart's "swap to Sold after the fact" trick work at all, and is the same mechanism this change relies on for photos.
- `EbayLotDescriptionPage.cshtml`'s `.measurement-photo-thumb` CSS class currently forces `width: 100px; height: 100px; object-fit: cover;` on the thumbnail `<img>`, independent of the image actually returned. A tiny placeholder image served through this class would still occupy a full 100x100 box (just blank), rather than visually collapsing.

## Goals / Non-Goals

**Goals:**
- One shared, explicitly-named rule for "is this measurement hidden from the public listing", used identically by the existing chart code and the new photo code.
- Move the sold/not-sold decision (and the photo-fetching it guards) into the Application layer, so `WebApiController` contains no branching logic - it only translates an Application-layer result into an HTTP response.
- A placeholder response that is a real, valid, minimal image (correct content type for the endpoint), so browsers never show a broken-image icon.
- A thumbnail presentation that visually collapses for a hidden photo instead of leaving a same-size blank box.

**Non-Goals:**
- Changing anything about the internal office/phone photo management pages, upload, or deletion flows - those are staff-only, authenticated, and unaffected by "public listing visibility".
- Retroactively altering already-published eBay listings' HTML/CSS structure - only newly-generated listing pages get the new sizing behavior (see Risks below).
- Introducing a new domain/entity concept for "hidden" photos; this is a read-time projection of the existing `MeasurementState`, not new stored state.

## Decisions

**1. Shared domain predicate instead of two independent conditions.**
Add `MeasurementStateExtensions.IsHiddenFromPublicListing(this MeasurementState state) => state == MeasurementState.Sold` in `Server.Domain.Measurements`. `MeasurementPlotService` (both call sites) and the new photo-hiding check both call this one method. Alternative considered: leave the chart's existing `is not Selling and not Created` phrasing alone and just add a differently-worded `== Sold` check for photos. Rejected because the user explicitly asked for the two to be provably the same rule, and because the two phrasings would silently diverge if a fourth `MeasurementState` value is ever introduced.

**2. Enforce the rule in `MeasurementPhotoService` (Application layer), not in the controller.**
`MeasurementPhotoService` already injects `IMeasurementQueries`. Add `GetContentAsync(measurementId, photoId, ct)` alongside the existing `GetThumbnailContentAsync`, both returning a small result carrying content bytes and content type (e.g. `MeasurementPhotoContent(byte[] Content, string ContentType)`). Each method: looks up `MeasurementInfo` via `IMeasurementQueries`, and if `IsHiddenFromPublicListing()` is true, returns the placeholder result without touching `IMeasurementPhotoQueries` at all; otherwise it fetches the real bytes as today. `WebApiController.GetMeasurementPhotoContent` is changed to call the service instead of `IMeasurementPhotoQueries.Get` directly (fixing the pre-existing layering violation), and both controller actions become a straight `File(result.Content, result.ContentType)` (404 only for "measurement or photo not found" at all, which is orthogonal to the sold check). Alternative considered: check the state in the controller and short-circuit before calling the service. Rejected - that would put a business rule (what "sold" means for public visibility) in a driving adapter, which this project's hexagonal architecture (AGENTS.md) reserves for the Application layer.
Placeholder bytes are a fixed constant with no I/O and no external system involved, so they are built directly inside `MeasurementPhotoService`, following the existing precedent of `MeasurementPlotService.StatusSvg` (a comparable trivial placeholder builder that already lives directly in an Application service rather than behind a driven port).

**3. Placeholder is a real minimal transparent image, not a text/SVG substitution.**
Both endpoints currently declare binary raster content types (thumbnail is hardcoded `image/jpeg`; full content uses the photo's stored content type). The placeholder is a real, tiny, fully transparent 1x1 raster image (a constant byte array) served as `image/png` for both endpoints when hidden. A transparent pixel avoids any visible colored block once stretched or scaled by CSS, and a real raster image avoids a content-type mismatch that an SVG substitute would introduce on an endpoint whose declared type is a raster format.

**4. Thumbnail sizing becomes image-driven instead of a fixed CSS box.**
Replace `.measurement-photo-thumb`'s `width: 100px; height: 100px; object-fit: cover;` with a bounding box that caps size but does not force it: `max-width: 100px; max-height: 100px; width: auto; height: auto;`. Effects:
- A real photo still displays capped at roughly the same visual scale as today (aspect-preserved fit-within-box rather than a cropped square - a minor, acceptable visual change from today's `cover` cropping).
- A hidden measurement's 1x1 placeholder renders at its true near-1-pixel intrinsic size, genuinely collapsing both the visible area and the hoverable/tappable target, instead of leaving a blank 100x100 box.
Alternative considered: keep the fixed box and rely solely on transparency to "hide" the photo. Rejected per explicit feedback - a same-size fully-transparent box still occupies layout space and remains a full-size hover/tap target, which reads as a bug (or at best a hidden Easter egg) more than "the photo disappeared".

**5. Scope covers both endpoints.**
Both `GetMeasurementPhotoContent` (full-size, used by the hover/tap overlay) and `GetMeasurementPhotoThumbnailContent` get the same treatment, so a viewer cannot recover the real photo through the full-size path once the tube is sold.

## Risks / Trade-offs

- [Already-published eBay listings keep the old fixed-size CSS baked into their pasted HTML forever, since that HTML is never re-fetched by eBay] → Accept as a known limitation. Endpoint-level hiding (placeholder instead of real bytes, no broken-image icon) still applies to old listings; only the "collapses to near-nothing" visual refinement is limited to listings generated after this change ships.
- [A real photo's thumbnail visually changes from a cropped square to an aspect-preserved fit-within-box] → Acceptable, minor, and matches the explicit decision behind it; flagged here so it isn't mistaken for a regression during review.
- [Skipping the `IMeasurementPhotoQueries` call entirely when hidden means a nonexistent photo id on a sold measurement returns the placeholder rather than 404] → Accepted: once a measurement is sold, distinguishing "photo id never existed" from "photo id existed but is now hidden" has no public-facing value, and avoiding the extra existence lookup keeps the hidden path cheap and simple.

## Migration Plan

No data migration. This is a pure read-path and presentation change:
1. Ship the domain predicate, service changes, and controller changes together (behavior change is atomic per deploy).
2. Ship the CSS change in the same deploy, since it only affects pages rendered after deploy.
3. No rollback complexity beyond a normal revert - no persisted state is introduced.
