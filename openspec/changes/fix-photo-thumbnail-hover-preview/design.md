## Context

Two pages render measurement-photo thumbnails as `<a href="{content-url}" target="_blank"><img src="{thumbnail-url}"></a>`:
- [MeasurementPhotos.razor](src/Ebay/Frontend/Pages/MeasurementPhotos.razor) — internal "Фото измерений" staff page (Blazor WebAssembly).
- [EbayLotDescriptionPage.cshtml](src/Ebay/Server.Adapters.Driving.WebApi/Pages/EbayLotDescriptionPage.cshtml) — server-rendered Razor Page whose HTML is pulled directly into a live public eBay listing description.

Clicking the link opens a new tab that downloads the photo as a file rather than displaying it, because the content endpoint (`WebApiController`, `File(photo.Content, photo.ContentType, photo.FileName)`) sets `Content-Disposition` with a filename, which most browsers treat as an attachment. On the eBay page this is worse than a UX papercut: it risks pulling a buyer away from (or triggering an unexpected download on) the live listing page, which must never happen.

The eBay page's HTML is embedded into eBay's listing template. eBay strips `<script>` tags from listing HTML, so any interaction must be CSS-only — the page already relies on this constraint elsewhere (the passport section uses a `<input type="checkbox"> + <label> + :checked` toggle with no JS). The fix must work the same way and reuse that proven constraint.

## Goals / Non-Goals

**Goals:**
- Replace the click-to-new-tab-then-download behavior with a same-page, CSS-only (no JavaScript) full-size preview on both pages.
- Support both desktop mouse users (hover) and touch/mobile users (tap), since the eBay page will actually be viewed on phones as part of a live listing.
- Use one consistent hover/tap-preview markup/CSS pattern on both pages so behavior and styling stay in sync.
- Guarantee that hovering or tapping never navigates the page, opens a new tab, or triggers a file download.
- Keep reusing the existing thumbnail and content endpoints unchanged.

**Non-Goals:**
- No new API endpoints or contract changes.
- No JavaScript-based lightbox/modal (ruled out by the eBay `<script>`-stripping constraint; also keeps the internal page consistent with the eBay page rather than diverging).
- No pinch-zoom or gesture support inside the preview itself — the preview is a static, capped-size image, not a full image viewer.

## Decisions

### 1. Pure CSS hover, no anchor/navigation at all
Drop the `<a target="_blank">` wrapper entirely. Each thumbnail becomes a small container (`<span>`/`<div>`) holding the thumbnail `<img>` plus a second, normally-hidden `<img>` pointing at the existing full-content URL. The container gets `position: relative`; the full-size `<img>` gets `position: absolute`, `visibility: hidden; opacity: 0`, and a `:hover`-triggered sibling rule flips it to visible. This removes the download-as-attachment problem as a side effect, since there is no longer any navigation or link-following involved — the full image loads as a normal inline `<img>`, same as the thumbnail already does.

**Alternative considered**: keep the `<a target="_blank">` but fix `Content-Disposition` on the server to `inline` so it displays instead of downloading. Rejected as insufficient on its own — the user explicitly wants no navigation/new tab at all on either page, and the eBay page must not risk leaving the listing under any circumstance.

### 2. Same markup/CSS pattern duplicated on both pages, not a shared asset
The two pages have no shared build/asset pipeline: `MeasurementPhotos.razor` is Blazor WebAssembly, and `EbayLotDescriptionPage.cshtml`'s HTML must be fully self-contained (inline `<style>`) since it's extracted and embedded into eBay's listing template, not served from this app's own `wwwroot`. The fix duplicates the same class names and CSS rules (e.g. `.photo-hover`, `.photo-hover__full`) in each page's own `<style>` block, matching the existing pattern where each page already carries its own inline styles (`.measurement-photo-thumbnail` in the Razor component, `.measurement-photo-thumb` in the eBay page).

### 3. Checkbox-hack for tap support, combined with `:hover` for desktop
A thumbnail-sized hover target is too small to be legible once enlarged, and `:hover` alone doesn't exist on touch devices — but the eBay page is primarily going to be viewed on phones. Each photo gets a hidden `<input type="checkbox">` plus two `<label for="...">` elements (one wrapping the thumbnail, one acting as a full-viewport backdrop), reusing the exact same checkbox-hack technique the page's passport section already uses for its expand/collapse toggle. The full-size preview is shown when its container is `:hover`-ed (desktop mouse, no click needed) **or** when its checkbox is `:checked` (tap/click, any device — toggles open on first tap, closed on a second tap or a tap on the backdrop). This keeps the interaction entirely CSS-driven while giving touch users an equivalent, discoverable way to preview a photo. Clicking still never navigates or downloads anything — it only flips a local checkbox.

### 4. Viewport-centered, larger overlay with a dimming backdrop
The preview is `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)`, capped at `max-width: 90vw; max-height: 90vh` — centered on the visible viewport rather than anchored to the thumbnail's position, and sized close to the full viewport rather than a small fixed pixel cap. This makes the photo actually legible (the original small, thumbnail-anchored popup was hard to see) regardless of where the thumbnail sits on the page or how small the viewport is (phones). A semi-transparent fixed backdrop (`rgba(0,0,0,0.6)`) appears only for the tap/click (`:checked`) path — not on hover, to avoid dimming the whole page on a passing desktop mouseover — both to visually set the preview apart from the page and to give touch users an obvious "tap anywhere to close" affordance.

## Risks / Trade-offs

- [Risk] eBay's listing template CSS is not fully known/controlled by us. `position: fixed` is normally relative to the viewport, but it becomes relative to the nearest ancestor with a `transform`/`filter`/`perspective` instead if one exists upstream in eBay's own template — which would break the centering. → Mitigation: verified locally that our own markup introduces no such ancestor; flagged as a residual risk to visually confirm once deployed inside a real eBay listing template, since that's not something we control or can fully test in isolation.
- [Trade-off] The checkbox-hack pattern (hidden `<input>` + `display:none`) removes the checkbox from the keyboard tab order, so keyboard-only users lose a way to trigger the preview via keyboard. → Mitigation: this matches the pre-existing, accepted trade-off of the passport-toggle pattern already shipped on this same page; not a new regression introduced by this change, and hovering still works for mouse users regardless.
- [Trade-off] Duplicating the CSS pattern in two places instead of one shared stylesheet risks the two pages drifting apart over time. → Mitigation: keep the rule set small and call it out explicitly in code comments/tasks so future edits touch both.

## Migration Plan

No data or API migration. Deploy as a normal frontend/page change:
1. Update `EbayLotDescriptionPage.cshtml` markup/CSS.
2. Update `MeasurementPhotos.razor` markup/CSS.
3. Manually verify on the phone-oriented page and by rendering the eBay description page HTML in a browser (no automated visual test exists for either).
Rollback is a plain revert of these two files; no schema or endpoint changes to unwind.

## Open Questions

None outstanding — exact preview pixel size is an implementation detail, not a decision blocking implementation.
