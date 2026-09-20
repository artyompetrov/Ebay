## Purpose

End-to-end capability covering measurement photo upload (phone), storage, retrieval (metadata and binary content), display on the eBay listing description page, and deletion from both the phone page and the internal office measurements page. Buyers of used radio tubes want visual proof of the exact physical unit and its measurement setup before buying, not just the anode/grid curve plots.

## Requirements

### Requirement: Phone-based photo upload
Staff SHALL be able to identify a measurement by scanning its barcode with a phone camera and upload one or more photos for that measurement directly from the phone's camera roll or camera. The page SHALL automatically classify the current browser client as mobile or non-mobile without asking the user. For a client classified as mobile, the environment-facing barcode camera preview SHALL be displayed in its natural, non-mirrored orientation; for a client classified as non-mobile, the scanner preview SHALL retain its existing horizontally mirrored presentation. When the active camera track reports a zoom capability, the page SHALL present a manual zoom control alongside the scanner preview so staff can zoom in on a barcode instead of physically moving the phone closer than the camera can focus; when the active camera track does not report a zoom capability, the page SHALL NOT present a zoom control and scanning SHALL behave exactly as it did before this capability existed.

#### Scenario: Upload after scanning a barcode
- **WHEN** staff scans a measurement's barcode on the `/measurement-photos` page and then selects one or more photo files
- **THEN** each selected file is uploaded and associated with the scanned measurement id, and the page's photo list refreshes to include the new photos

#### Scenario: Upload blocked without a known measurement
- **WHEN** no measurement id has been established yet (no scan performed and no id supplied)
- **THEN** the upload control is disabled and no upload request is sent

#### Scenario: Rear-camera preview on a detected mobile client
- **WHEN** staff starts barcode scanning on a client that the browser identifies as mobile and the scanner requests the environment-facing camera
- **THEN** the page automatically displays the camera preview without horizontal mirroring and does not ask staff to choose a device type

#### Scenario: Scanner preview on a non-mobile client
- **WHEN** staff starts barcode scanning on a client that the browser identifies as non-mobile
- **THEN** the page automatically retains the existing horizontally mirrored scanner preview and does not ask staff to choose a device type

#### Scenario: Mobile detection compatibility fallback
- **WHEN** the browser does not expose its structured mobile-client indicator
- **THEN** the page determines mobile status using a browser-compatible client identification fallback and still starts the barcode scanner

#### Scenario: Zoom control shown when the camera supports zoom
- **WHEN** staff starts barcode scanning and the active camera track reports a zoom capability
- **THEN** the page displays a manual zoom control alongside the scanner preview

#### Scenario: Zoom control absent when the camera does not support zoom
- **WHEN** staff starts barcode scanning and the active camera track does not report a zoom capability
- **THEN** the page does not display a zoom control, and scanning proceeds exactly as it did before this capability existed

#### Scenario: Adjusting the zoom control changes the live preview
- **WHEN** staff adjusts the zoom control while the camera supports zoom
- **THEN** the requested zoom level is applied to the running camera track so the live scanner preview reflects the new zoom level without restarting the camera

### Requirement: Photo thumbnail generated on upload
When a measurement photo is uploaded, the system SHALL generate a size-capped thumbnail from it and store the thumbnail alongside the original.

#### Scenario: Thumbnail created at upload time
- **WHEN** staff uploads a photo for a measurement
- **THEN** the system generates a size-capped thumbnail from the uploaded content and stores it together with the photo, without a separate request

### Requirement: Bounded original photo size
When a measurement photo is uploaded, the system SHALL cap the stored "original" content to a bounded maximum resolution and encoded quality, re-encoding it if the uploaded file exceeds that bound, instead of storing the uploaded bytes unmodified regardless of size. Measurement photos stored before this bound existed SHALL be brought within the same bound by a one-time migration.

#### Scenario: Uploading a photo above the bound
- **WHEN** staff uploads a photo whose resolution or file size exceeds the configured bound
- **THEN** the system stores a re-encoded version of the photo within the bound as the "original" content, rather than the unmodified uploaded bytes

#### Scenario: Uploading a photo within the bound
- **WHEN** staff uploads a photo whose resolution and file size are already within the configured bound
- **THEN** the system stores the photo without unnecessary re-encoding beyond what upload processing already does

#### Scenario: Previously stored photo exceeding the bound is migrated
- **WHEN** the one-time migration runs against measurement photos stored before this bound existed
- **THEN** every stored "original" photo content that exceeds the bound is replaced with a re-encoded version within the bound, and photos already within the bound are left unchanged

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

### Requirement: Photo binary retrieval
The system SHALL expose an API endpoint that returns the raw binary content of a single measurement photo by measurement id and photo id. When the photo's measurement has been sold, the endpoint SHALL NOT return the real photo content; it SHALL instead return a placeholder image that is a valid, displayable image (so it does not trigger a browser broken-image indicator).

#### Scenario: Fetch existing photo content
- **WHEN** a client requests `GET /measurements/{measurementId}/photos/{photoId}/content` for a photo that exists and whose measurement has not been sold
- **THEN** the response body is the photo's binary content with its stored content type

#### Scenario: Fetch missing photo content
- **WHEN** a client requests photo content for a measurement id or photo id that does not exist
- **THEN** the system SHALL respond with 404 Not Found

#### Scenario: Fetch photo content for a sold measurement
- **WHEN** a client requests photo content for a photo whose measurement has been sold
- **THEN** the response is a valid, displayable placeholder image and not the photo's real binary content

### Requirement: Photo thumbnail retrieval
The system SHALL expose an API endpoint that returns the stored thumbnail image for a measurement photo, by measurement id and photo id. When the photo's measurement has been sold, the endpoint SHALL NOT return the real thumbnail; it SHALL instead return a placeholder image that is a valid, displayable image (so it does not trigger a browser broken-image indicator).

#### Scenario: Fetch thumbnail for an uploaded photo
- **WHEN** a client requests `GET /api/webapi/v1/measurements/{measurementId}/photos/{photoId}/thumbnail/content` for a photo that exists and whose measurement has not been sold
- **THEN** the response body is the stored thumbnail image with content type `image/jpeg`

#### Scenario: Fetch missing photo's thumbnail
- **WHEN** a client requests a thumbnail for a measurement id or photo id that does not exist
- **THEN** the system SHALL respond with 404 Not Found

#### Scenario: Fetch thumbnail for a sold measurement
- **WHEN** a client requests the thumbnail for a photo whose measurement has been sold
- **THEN** the response is a valid, displayable placeholder image and not the stored thumbnail's real content

### Requirement: Cached serving of photo and thumbnail content
For a measurement that has not been sold, the system SHALL serve a photo's full content and thumbnail content from an in-memory cache after the first successful retrieval, instead of re-reading the binary content from the database on every request. The system SHALL NOT re-check the measurement's sold/not-sold status against the database on every request. Instead, whenever the measurement's status changes, the system SHALL invalidate that measurement's cached photo/thumbnail results so the next request re-resolves them, rather than relying on a per-request live status check.

#### Scenario: Repeated content request served from cache
- **WHEN** a photo's full content is requested twice for a measurement that has not been sold
- **THEN** the second request's binary content is served from the in-memory cache without re-reading it from the database

#### Scenario: Repeated thumbnail request served from cache
- **WHEN** a photo's thumbnail content is requested twice for a measurement that has not been sold
- **THEN** the second request's thumbnail content is served from the in-memory cache without re-reading it from the database

#### Scenario: Requests between status changes never re-check the database
- **WHEN** a photo's content or thumbnail has already been resolved once for a measurement whose status has not changed since
- **THEN** subsequent requests return the cached result without a fresh database check of the measurement's status

#### Scenario: Sale still takes effect immediately despite cached bytes
- **WHEN** a measurement's photo content has already been cached and the measurement is then sold
- **THEN** the cached result for that measurement's photos is invalidated, and the next request for that photo's content or thumbnail returns the placeholder image, not the previously cached real bytes

### Requirement: Batched photo metadata query
The system SHALL provide a read query that returns photo metadata (id, file name, order) without binary content for one or many measurement ids in a single call, so consumers that only need to know whether/how many photos exist do not pay the cost of loading photo binary content.

#### Scenario: Query metadata for multiple measurements at once
- **WHEN** a caller requests photo metadata for a list of measurement ids
- **THEN** the system SHALL return, for each measurement id that has photos, the photo id, file name, and order, without loading any photo's binary content

#### Scenario: Query metadata for a measurement with no photos
- **WHEN** a caller requests photo metadata for a measurement id that has no uploaded photos
- **THEN** the system SHALL return an empty result for that measurement id rather than an error

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

### Requirement: Deferred loading of the full-size preview image on the eBay listing description page
On the eBay listing description page, the full-size preview image for a measurement photo SHALL NOT be requested over the network when the page loads. It SHALL be requested only once a viewer actually interacts with that photo's thumbnail (hover on desktop, tap on mobile). The thumbnail image itself SHALL still load with the page as today.

#### Scenario: Full-size image not requested on page load
- **WHEN** the eBay description page is rendered and loaded by a viewer's browser who has not interacted with any photo thumbnail
- **THEN** no network request for any photo's full-size content endpoint has been made, while each photo's thumbnail has loaded

#### Scenario: Full-size image requested only on interaction
- **WHEN** a viewer hovers or taps a specific photo's thumbnail for the first time
- **THEN** the browser requests that photo's full-size content endpoint at that point, and the existing in-place preview behavior (centered overlay, dimmed backdrop on tap, CSS-only, no navigation) continues to work as already specified

### Requirement: Photo management from the internal office measurements page
Staff SHALL be able to see whether a measurement has photos and delete a previously uploaded photo from the internal office measurements page (the per-product measurements table), without needing to scan a barcode.

#### Scenario: Photo indicator on measurement row
- **WHEN** the office measurements table is displayed for a product
- **THEN** each measurement row shows an indicator of how many photos (if any) are attached to that measurement

#### Scenario: Open photo management for a specific measurement
- **WHEN** staff activates the photo indicator/link for a measurement row
- **THEN** the system opens a view listing that measurement's photos, identified directly by its measurement id, without requiring a barcode scan

#### Scenario: Delete a photo from the office view
- **WHEN** staff deletes a photo from the photo management view opened from the office measurements page
- **THEN** the photo is removed and no longer appears in the photo list, in the photo count indicator, or on the eBay description page

### Requirement: Photo deletion re-orders remaining photos
When a photo is deleted, the system SHALL keep the remaining photos' display order contiguous (no gaps), regardless of whether the deletion was initiated from the phone page or the office measurements page.

#### Scenario: Delete a photo that is not last in order
- **WHEN** a photo with a given order position is deleted and other photos exist with a higher order position
- **THEN** each of those higher-order photos has its order decremented by one, and the deleted photo's id no longer resolves to any photo
