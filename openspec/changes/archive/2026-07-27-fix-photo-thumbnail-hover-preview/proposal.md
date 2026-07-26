## Why

Clicking a measurement-photo thumbnail currently opens the full-size photo via `<a target="_blank">`, and because the content endpoint sets `Content-Disposition` to the original file name, the browser downloads it as a file instead of displaying it — on both the internal "Фото измерений" (`MeasurementPhotos.razor`) page and the public eBay lot description page (`EbayLotDescriptionPage.cshtml`). On the eBay page this is especially harmful: it can pull a buyer off the live listing page entirely, which must never happen. Both pages need a same-page, CSS-only hover preview instead of a click-through link, since the eBay page is embedded in eBay's listing HTML where `<script>` is stripped and only CSS/inline styles are reliable (the page already relies on this constraint for its checkbox-driven passport toggle).

## What Changes

- Remove the `<a href=... target="_blank">` wrapper around each photo thumbnail on both `MeasurementPhotos.razor` and `EbayLotDescriptionPage.cshtml`; thumbnails become plain, non-navigating elements.
- Add a shared, CSS-only (`:hover`, no JavaScript) hover-preview interaction: hovering a thumbnail shows the corresponding full-size photo (from the existing content endpoint) as an overlay on the same page; moving the pointer away hides it again. No navigation, new tab, or download occurs.
- Use the same hover markup/CSS pattern on both pages so the interaction is consistent.
- **BREAKING**: Removes the previous "click thumbnail to open full photo in a new tab" behavior described in the current `measurement-photos` spec; it is replaced by hover-to-preview in place.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `measurement-photos`: The "Photo previews on the phone-oriented management page" and "Photos shown on the eBay listing description page" requirements change from "clicking a thumbnail opens the full-size photo" to "hovering a thumbnail previews the full-size photo in place, via CSS only, with no page navigation."

## Impact

- Affected code: [MeasurementPhotos.razor](src/Ebay/Frontend/Pages/MeasurementPhotos.razor), [EbayLotDescriptionPage.cshtml](src/Ebay/Server.Adapters.Driving.WebApi/Pages/EbayLotDescriptionPage.cshtml).
- No API/contract changes — reuses the existing thumbnail and content endpoints as-is.
- No DB changes.
- Spec: `openspec/specs/measurement-photos/spec.md` gets a delta for the two affected requirements.
