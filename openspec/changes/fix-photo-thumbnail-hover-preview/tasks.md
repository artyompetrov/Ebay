## 1. Фото измерений page (MeasurementPhotos.razor)

- [ ] 1.1 Remove the `<a href="@GetPhotoUrl(photo.Id)" target="_blank">` wrapper around each photo thumbnail; the thumbnail `<img>` is no longer inside a link.
- [ ] 1.2 Add a hover-preview container (`.photo-hover`) around each thumbnail holding the thumbnail `<img>` and a second, initially-hidden full-size `<img>` sourced from `GetPhotoUrl(photo.Id)`.
- [ ] 1.3 Add CSS rules in the page's existing `<style>` block: `.photo-hover { position: relative; }`, hidden-by-default full-size image (`visibility: hidden; opacity: 0; position: absolute; ...; pointer-events: none;`), and a `:hover` rule that reveals it (`visibility: visible; opacity: 1;`), with a `max-width`/`max-height` cap and a `z-index` above the surrounding list.
- [ ] 1.4 Confirm the file name (`@photo.FileName`) and delete button remain visible/functional next to the thumbnail as before.

## 2. eBay lot description page (EbayLotDescriptionPage.cshtml)

- [ ] 2.1 Remove the `<a href="...{photo.Id}/content" target="_blank">` wrapper around each `.measurement-photo-thumb` thumbnail.
- [ ] 2.2 Wrap each thumbnail in the same `.photo-hover` container pattern (reusing the same class names/CSS shape as the Фото измерений page for consistency), containing the thumbnail `<img>` and a hidden full-size `<img>` sourced from the existing `.../content` URL.
- [ ] 2.3 Add the equivalent CSS rules to this page's existing `<style>` block (same hover/visibility/positioning approach), keeping the preview capped in size so it can't blow out the table layout, and scoped so it doesn't rely on any JavaScript.
- [ ] 2.4 Verify the `.measurement-photos` flex row layout (horizontal arrangement of thumbnails per measurement) is unaffected by the new wrapper markup.

## 3. Verification

- [ ] 3.1 Run the app locally, open "Фото измерений" for a measurement with photos, and confirm hovering a thumbnail shows the full photo in place with no new tab and no download, and moving away hides it.
- [ ] 3.2 Render `EbayLotDescriptionPage` for a lot with measurement photos (e.g. via the local endpoint) and confirm the same hover behavior, with no navigation on click.
- [ ] 3.3 Confirm both pages still render correctly for measurements with zero photos (no errors, no stray hover containers).
- [ ] 3.4 Run `./agent-check.sh` from the repo root before opening the PR.
