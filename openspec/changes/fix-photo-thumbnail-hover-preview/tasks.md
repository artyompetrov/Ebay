## 1. Фото измерений page (MeasurementPhotos.razor)

- [x] 1.1 Remove the `<a href="@GetPhotoUrl(photo.Id)" target="_blank">` wrapper around each photo thumbnail; the thumbnail `<img>` is no longer inside a link.
- [x] 1.2 Add a hover-preview container (`.photo-hover`) around each thumbnail holding the thumbnail `<img>` and a second, initially-hidden full-size `<img>` sourced from `GetPhotoUrl(photo.Id)`.
- [x] 1.3 Add CSS rules in the page's existing `<style>` block: `.photo-hover { position: relative; }`, hidden-by-default full-size image (`visibility: hidden; opacity: 0; position: absolute; ...; pointer-events: none;`), and a `:hover` rule that reveals it (`visibility: visible; opacity: 1;`), with a `max-width`/`max-height` cap and a `z-index` above the surrounding list.
- [x] 1.4 Confirm the file name (`@photo.FileName`) and delete button remain visible/functional next to the thumbnail as before.

## 2. eBay lot description page (EbayLotDescriptionPage.cshtml)

- [x] 2.1 Remove the `<a href="...{photo.Id}/content" target="_blank">` wrapper around each `.measurement-photo-thumb` thumbnail.
- [x] 2.2 Wrap each thumbnail in the same `.photo-hover` container pattern (reusing the same class names/CSS shape as the Фото измерений page for consistency), containing the thumbnail `<img>` and a hidden full-size `<img>` sourced from the existing `.../content` URL.
- [x] 2.3 Add the equivalent CSS rules to this page's existing `<style>` block (same hover/visibility/positioning approach), keeping the preview capped in size so it can't blow out the table layout, and scoped so it doesn't rely on any JavaScript.
- [x] 2.4 Verify the `.measurement-photos` flex row layout (horizontal arrangement of thumbnails per measurement) is unaffected by the new wrapper markup.

## 3. Verification

- [~] 3.1 Run the app locally, open "Фото измерений" for a measurement with photos, and confirm hovering a thumbnail shows the full photo in place with no new tab and no download, and moving away hides it. (Blocked: page requires real staff login via IdentityServer; no test credentials available in this session. Verified the identical `.photo-hover`/`.photo-hover-full` CSS block live on the eBay page instead — see 3.2.)
- [x] 3.2 Render `EbayLotDescriptionPage` for a lot with measurement photos (e.g. via the local endpoint) and confirm the same hover behavior, with no navigation on click. Verified live against real DB data (product `d3391b24-b782-4fb9-b619-3c470e529163`, measurement `34KVLCE`): hovering the thumbnail reveals the full-size photo overlay in place, moving away hides it, and no `<a>`/`target="_blank"` wraps the thumbnails.
- [x] 3.3 Confirm both pages still render correctly for measurements with zero photos (no errors, no stray hover containers). Confirmed by inspection: the hover container is only emitted inside the `@foreach`/`foreach` photo loop, so zero photos means zero containers; also verified live for other measurements on the same eBay page render with no console/network errors.
- [ ] 3.4 Run `./agent-check.sh` from the repo root before opening the PR. (running)

## 4. Larger, viewport-centered, tap-friendly preview (refinement)

- [x] 4.1 Enlarge the preview: cap it at `max-width: 90vw; max-height: 90vh` instead of a small fixed pixel size, on both pages.
- [x] 4.2 Center the preview on the viewport (`position: fixed; top/left: 50%; transform: translate(-50%, -50%)`) instead of anchoring it to the thumbnail's position, on both pages.
- [x] 4.3 Add a checkbox-hack (hidden `<input type="checkbox">` + `<label>`) per photo so tapping/clicking the thumbnail opens the preview and keeps it open after the pointer moves away — needed because the eBay page is viewed on phones, where `:hover` doesn't exist.
- [x] 4.4 Add a dimmed full-viewport backdrop (`<label>` bound to the same checkbox) shown only while the preview is open via tap/click, so tapping anywhere on the backdrop closes it again.
- [x] 4.5 Verify live in the browser at both desktop and mobile viewport sizes: hover-to-preview (desktop), tap-to-open persisting after pointer-away, and tap-backdrop-to-close, all with no navigation.

## 5. Buyer-facing instruction on the eBay page

- [x] 5.1 On `EbayLotDescriptionPage.cshtml`, add a short instruction line ("Hover over or tap a tube's photo thumbnail to view it full-size") telling buyers how to use the preview, shown only when `Model.PhotosByMeasurementId.Count > 0` (i.e. the lot actually has at least one measurement photo).
- [x] 5.2 Verify live that the instruction is absent for a lot/measurement selection with zero photos and present (once, above the table) when photos exist. Confirmed via curl against real DB data: present for product `d3391b24-...` (has photos), absent for product `8b356327-...` (measurements rendered with no photos).
