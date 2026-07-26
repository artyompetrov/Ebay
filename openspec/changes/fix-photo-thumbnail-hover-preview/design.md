## Context

Two pages render measurement-photo thumbnails as `<a href="{content-url}" target="_blank"><img src="{thumbnail-url}"></a>`:
- [MeasurementPhotos.razor](src/Ebay/Frontend/Pages/MeasurementPhotos.razor) — internal "Фото измерений" staff page (Blazor WebAssembly).
- [EbayLotDescriptionPage.cshtml](src/Ebay/Server.Adapters.Driving.WebApi/Pages/EbayLotDescriptionPage.cshtml) — server-rendered Razor Page whose HTML is pulled directly into a live public eBay listing description.

Clicking the link opens a new tab that downloads the photo as a file rather than displaying it, because the content endpoint (`WebApiController`, `File(photo.Content, photo.ContentType, photo.FileName)`) sets `Content-Disposition` with a filename, which most browsers treat as an attachment. On the eBay page this is worse than a UX papercut: it risks pulling a buyer away from (or triggering an unexpected download on) the live listing page, which must never happen.

The eBay page's HTML is embedded into eBay's listing template. eBay strips `<script>` tags from listing HTML, so any interaction must be CSS-only — the page already relies on this constraint elsewhere (the passport section uses a `<input type="checkbox"> + <label> + :checked` toggle with no JS). The fix must work the same way and reuse that proven constraint.

## Goals / Non-Goals

**Goals:**
- Replace the click-to-new-tab-then-download behavior with a same-page, CSS-only (`:hover`, no JavaScript) full-size preview on both pages.
- Use one consistent hover-preview markup/CSS pattern on both pages so behavior and styling stay in sync.
- Guarantee that hovering (or failing to hover, e.g. on touch devices) never navigates the page, opens a new tab, or triggers a file download.
- Keep reusing the existing thumbnail and content endpoints unchanged.

**Non-Goals:**
- No new API endpoints or contract changes.
- No JavaScript-based lightbox/modal (ruled out by the eBay `<script>`-stripping constraint; also keeps the internal page consistent with the eBay page rather than diverging).
- No solution for touch-only devices beyond "safely does nothing" — pinch-zoom-free full-size preview on touch is out of scope.

## Decisions

### 1. Pure CSS hover, no anchor/navigation at all
Drop the `<a target="_blank">` wrapper entirely. Each thumbnail becomes a small container (`<span>`/`<div>`) holding the thumbnail `<img>` plus a second, normally-hidden `<img>` pointing at the existing full-content URL. The container gets `position: relative`; the full-size `<img>` gets `position: absolute`, `visibility: hidden; opacity: 0`, and a `:hover`-triggered sibling rule flips it to visible. This removes the download-as-attachment problem as a side effect, since there is no longer any navigation or link-following involved — the full image loads as a normal inline `<img>`, same as the thumbnail already does.

**Alternative considered**: keep the `<a target="_blank">` but fix `Content-Disposition` on the server to `inline` so it displays instead of downloading. Rejected as insufficient on its own — the user explicitly wants no navigation/new tab at all on either page, and the eBay page must not risk leaving the listing under any circumstance.

### 2. Same markup/CSS pattern duplicated on both pages, not a shared asset
The two pages have no shared build/asset pipeline: `MeasurementPhotos.razor` is Blazor WebAssembly, and `EbayLotDescriptionPage.cshtml`'s HTML must be fully self-contained (inline `<style>`) since it's extracted and embedded into eBay's listing template, not served from this app's own `wwwroot`. The fix duplicates the same class names and CSS rules (e.g. `.photo-hover`, `.photo-hover__full`) in each page's own `<style>` block, matching the existing pattern where each page already carries its own inline styles (`.measurement-photo-thumbnail` in the Razor component, `.measurement-photo-thumb` in the eBay page).

### 3. Overlay positioning and non-interference
The full-size preview `<img>` uses `pointer-events: none` so it can never itself capture hover/click and can't be dragged/right-clicked-to-open by accident, and a `z-index` high enough to sit above surrounding table content. Size is capped with `max-width`/`max-height` (e.g. ~320–400px) rather than intrinsic photo size, so a large upload can't blow out the layout.

## Risks / Trade-offs

- [Risk] eBay's listing template CSS is not fully known/controlled by us; an ancestor element with `overflow: hidden` could clip the absolutely-positioned preview. → Mitigation: keep the preview capped in size and prefer `position: absolute` anchored close to the thumbnail (not `position: fixed`, which needs JS to track cursor); note this as a residual risk to check visually after deploying to a real listing, not something CSS alone can fully guarantee against an unknown parent.
- [Risk] Hover has no equivalent on touch-only devices (mobile eBay app/browser), so touch users get no full-size preview at all. → Mitigation: acceptable per Non-Goals — this is strictly better than today's behavior (no accidental download/navigation), and thumbnails remain visible at their existing size.
- [Trade-off] Duplicating the CSS pattern in two places instead of one shared stylesheet risks the two pages drifting apart over time. → Mitigation: keep the rule set small and call it out explicitly in code comments/tasks so future edits touch both.

## Migration Plan

No data or API migration. Deploy as a normal frontend/page change:
1. Update `EbayLotDescriptionPage.cshtml` markup/CSS.
2. Update `MeasurementPhotos.razor` markup/CSS.
3. Manually verify on the phone-oriented page and by rendering the eBay description page HTML in a browser (no automated visual test exists for either).
Rollback is a plain revert of these two files; no schema or endpoint changes to unwind.

## Open Questions

None outstanding — exact preview pixel size is an implementation detail, not a decision blocking implementation.
