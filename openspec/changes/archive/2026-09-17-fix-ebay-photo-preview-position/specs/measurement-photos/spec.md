## MODIFIED Requirements

### Requirement: Photos shown on the eBay listing description page
The eBay lot description page (the page whose rendered HTML is pulled into the live eBay listing) SHALL display a thumbnail for each of the uploaded photos for each measurement/tube it lists, arranged horizontally within that measurement's row, alongside the existing measurement curve plots. Thumbnails SHALL NOT be navigable links; hovering or tapping/clicking a thumbnail SHALL preview the corresponding full-size photo in place on the same page, as an overlay anchored to that thumbnail, using CSS only (no JavaScript, no new tab, no navigation, no file download), since this page is embedded directly into a live eBay listing — viewed on both desktop and mobile — and must never cause the viewer to leave or be redirected away from that listing. When the lot has at least one measurement photo, the page SHALL also display a short instruction telling buyers to hover or tap a thumbnail to view it full-size; this instruction SHALL NOT be shown when the lot has no measurement photos at all. A thumbnail's on-page size SHALL be driven by the dimensions of the image actually returned for it (capped to a bounded display size for a real photo), rather than a fixed size independent of that image, so that a measurement whose tube has since been sold — and whose photo therefore no longer resolves to the real image — visually collapses away instead of leaving a same-size blank box where the photo used to be.

#### Scenario: Measurement with photos
- **WHEN** the eBay description page is rendered for a lot whose measurements include one that has uploaded photos
- **THEN** the page includes a thumbnail `<img>` element for each of that measurement's photos, sourced from the thumbnail endpoint, arranged horizontally (side by side, not stacked vertically) within that measurement's row/tube

#### Scenario: Measurement with no photos
- **WHEN** the eBay description page is rendered for a measurement that has no uploaded photos
- **THEN** the page renders that measurement's row without any photo images and without errors

#### Scenario: Hovering a thumbnail previews the full photo in place
- **WHEN** a viewer of the eBay description page hovers one of a measurement's photo thumbnails
- **THEN** the corresponding full-size original photo (sourced from the existing content endpoint) is displayed as an overlay anchored to that thumbnail, without opening a new tab, navigating away, or downloading a file

#### Scenario: Tapping or clicking a thumbnail previews the full photo in place (mobile-friendly)
- **WHEN** a viewer of the eBay description page (including on a phone, where hover does not exist) taps or clicks one of a measurement's photo thumbnails
- **THEN** the corresponding full-size original photo is displayed as an overlay anchored to that thumbnail with a dimmed backdrop behind it, without opening a new tab, navigating away, or downloading a file, and the preview stays visible after the pointer/finger moves away

#### Scenario: Tapping or clicking the backdrop closes the preview
- **WHEN** a viewer taps or clicks the dimmed backdrop behind an open preview
- **THEN** the full-size preview and its backdrop are hidden again and the viewer remains on the current eBay listing page

#### Scenario: Thumbnail is not a clickable link
- **WHEN** a viewer of the eBay description page clicks a photo thumbnail
- **THEN** the click has no navigation effect — the viewer stays on the current eBay listing page (only the local preview overlay opens)

#### Scenario: Instruction shown when the lot has photos
- **WHEN** the eBay description page is rendered for a lot that has at least one measurement photo
- **THEN** the page displays a short instruction telling buyers to hover or tap a thumbnail to view it full-size

#### Scenario: Instruction absent when the lot has no photos
- **WHEN** the eBay description page is rendered for a lot whose measurements have no uploaded photos at all
- **THEN** the page does not display the hover/tap instruction

#### Scenario: A sold measurement's photo no longer reveals the real photo
- **WHEN** a viewer of the eBay description page views or interacts with (hovers/taps) a photo thumbnail belonging to a measurement whose tube has since been sold
- **THEN** neither the thumbnail nor its full-size preview shows the real photo, and no broken-image indicator is shown, matching how this page already hides a sold measurement's price/curve charts
