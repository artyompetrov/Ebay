## MODIFIED Requirements

### Requirement: Photo previews on the phone-oriented management page
The `MeasurementPhotos.razor` ("Фото измерений") page SHALL render each uploaded photo in its list as a thumbnail image rather than a plain filename link. The thumbnail SHALL NOT be a navigable link; hovering it SHALL preview the corresponding full-size photo in place on the same page, using CSS only (no JavaScript, no new tab, no navigation, no file download).

#### Scenario: Photo list shows thumbnails
- **WHEN** the "Фото измерений" page lists photos for a measurement
- **THEN** each list entry shows a thumbnail image (sourced from the thumbnail endpoint) for that photo, not just its filename

#### Scenario: Hovering a thumbnail previews the full photo in place
- **WHEN** staff hovers a photo's thumbnail on the "Фото измерений" page
- **THEN** the full-size original photo (sourced from the existing content endpoint) is displayed as an overlay on the same page, without opening a new tab, navigating away, or downloading a file

#### Scenario: Moving away from a thumbnail hides the preview
- **WHEN** staff moves the pointer away from a previewed thumbnail
- **THEN** the full-size preview is hidden again and the page remains on the "Фото измерений" view

### Requirement: Photos shown on the eBay listing description page
The eBay lot description page (the page whose rendered HTML is pulled into the live eBay listing) SHALL display a thumbnail for each of the uploaded photos for each measurement/tube it lists, arranged horizontally within that measurement's row, alongside the existing measurement curve plots. Thumbnails SHALL NOT be navigable links; hovering a thumbnail SHALL preview the corresponding full-size photo in place on the same page, using CSS only (no JavaScript, no new tab, no navigation, no file download), since this page is embedded directly into a live eBay listing and must never cause the viewer to leave or be redirected away from that listing.

#### Scenario: Measurement with photos
- **WHEN** the eBay description page is rendered for a lot whose measurements include one that has uploaded photos
- **THEN** the page includes a thumbnail `<img>` element for each of that measurement's photos, sourced from the thumbnail endpoint, arranged horizontally (side by side, not stacked vertically) within that measurement's row/tube

#### Scenario: Measurement with no photos
- **WHEN** the eBay description page is rendered for a measurement that has no uploaded photos
- **THEN** the page renders that measurement's row without any photo images and without errors

#### Scenario: Hovering a thumbnail previews the full photo in place
- **WHEN** a viewer of the eBay description page hovers one of a measurement's photo thumbnails
- **THEN** the corresponding full-size original photo (sourced from the existing content endpoint) is displayed as an overlay on the same page, without opening a new tab, navigating away, or downloading a file

#### Scenario: Thumbnail is not a clickable link
- **WHEN** a viewer of the eBay description page clicks (rather than hovers) a photo thumbnail
- **THEN** the click has no navigation effect — the viewer stays on the current eBay listing page
