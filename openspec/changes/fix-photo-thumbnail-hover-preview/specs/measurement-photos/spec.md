## MODIFIED Requirements

### Requirement: Photo previews on the phone-oriented management page
The `MeasurementPhotos.razor` ("Фото измерений") page SHALL render each uploaded photo in its list as a thumbnail image rather than a plain filename link. The thumbnail SHALL NOT be a navigable link; hovering or tapping/clicking it SHALL preview the corresponding full-size photo in place on the same page, centered in the viewport, using CSS only (no JavaScript, no new tab, no navigation, no file download).

#### Scenario: Photo list shows thumbnails
- **WHEN** the "Фото измерений" page lists photos for a measurement
- **THEN** each list entry shows a thumbnail image (sourced from the thumbnail endpoint) for that photo, not just its filename

#### Scenario: Hovering a thumbnail previews the full photo in place
- **WHEN** staff hovers a photo's thumbnail on the "Фото измерений" page
- **THEN** the full-size original photo (sourced from the existing content endpoint) is displayed as an overlay centered in the viewport, without opening a new tab, navigating away, or downloading a file

#### Scenario: Moving away from a thumbnail hides the preview
- **WHEN** staff moves the pointer away from a previewed thumbnail (and has not tapped/clicked it open)
- **THEN** the full-size preview is hidden again and the page remains on the "Фото измерений" view

#### Scenario: Tapping or clicking a thumbnail previews the full photo in place
- **WHEN** staff taps or clicks a photo's thumbnail on the "Фото измерений" page
- **THEN** the full-size original photo is displayed as an overlay centered in the viewport with a dimmed backdrop behind it, without opening a new tab, navigating away, or downloading a file, and the preview stays visible after the pointer moves away

#### Scenario: Tapping or clicking the backdrop closes the preview
- **WHEN** staff taps or clicks the dimmed backdrop behind an open preview
- **THEN** the full-size preview and its backdrop are hidden again and the page remains on the "Фото измерений" view

### Requirement: Photos shown on the eBay listing description page
The eBay lot description page (the page whose rendered HTML is pulled into the live eBay listing) SHALL display a thumbnail for each of the uploaded photos for each measurement/tube it lists, arranged horizontally within that measurement's row, alongside the existing measurement curve plots. Thumbnails SHALL NOT be navigable links; hovering or tapping/clicking a thumbnail SHALL preview the corresponding full-size photo in place on the same page, centered in the viewport, using CSS only (no JavaScript, no new tab, no navigation, no file download), since this page is embedded directly into a live eBay listing — viewed on both desktop and mobile — and must never cause the viewer to leave or be redirected away from that listing. When the lot has at least one measurement photo, the page SHALL also display a short instruction telling buyers to hover or tap a thumbnail to view it full-size; this instruction SHALL NOT be shown when the lot has no measurement photos at all.

#### Scenario: Measurement with photos
- **WHEN** the eBay description page is rendered for a lot whose measurements include one that has uploaded photos
- **THEN** the page includes a thumbnail `<img>` element for each of that measurement's photos, sourced from the thumbnail endpoint, arranged horizontally (side by side, not stacked vertically) within that measurement's row/tube

#### Scenario: Measurement with no photos
- **WHEN** the eBay description page is rendered for a measurement that has no uploaded photos
- **THEN** the page renders that measurement's row without any photo images and without errors

#### Scenario: Hovering a thumbnail previews the full photo in place
- **WHEN** a viewer of the eBay description page hovers one of a measurement's photo thumbnails
- **THEN** the corresponding full-size original photo (sourced from the existing content endpoint) is displayed as an overlay centered in the viewport, without opening a new tab, navigating away, or downloading a file

#### Scenario: Tapping or clicking a thumbnail previews the full photo in place (mobile-friendly)
- **WHEN** a viewer of the eBay description page (including on a phone, where hover does not exist) taps or clicks one of a measurement's photo thumbnails
- **THEN** the corresponding full-size original photo is displayed as an overlay centered in the viewport with a dimmed backdrop behind it, without opening a new tab, navigating away, or downloading a file, and the preview stays visible after the pointer/finger moves away

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
