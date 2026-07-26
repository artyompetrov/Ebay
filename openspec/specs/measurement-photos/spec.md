## Purpose

End-to-end capability covering measurement photo upload (phone), storage, retrieval (metadata and binary content), display on the eBay listing description page, and deletion from both the phone page and the internal office measurements page. Buyers of used radio tubes want visual proof of the exact physical unit and its measurement setup before buying, not just the anode/grid curve plots.

## Requirements

### Requirement: Phone-based photo upload
Staff SHALL be able to identify a measurement by scanning its barcode with a phone camera and upload one or more photos for that measurement directly from the phone's camera roll or camera.

#### Scenario: Upload after scanning a barcode
- **WHEN** staff scans a measurement's barcode on the `/measurement-photos` page and then selects one or more photo files
- **THEN** each selected file is uploaded and associated with the scanned measurement id, and the page's photo list refreshes to include the new photos

#### Scenario: Upload blocked without a known measurement
- **WHEN** no measurement id has been established yet (no scan performed and no id supplied)
- **THEN** the upload control is disabled and no upload request is sent

### Requirement: Photo binary retrieval
The system SHALL expose an API endpoint that returns the raw binary content of a single measurement photo by measurement id and photo id.

#### Scenario: Fetch existing photo content
- **WHEN** a client requests `GET /measurements/{measurementId}/photos/{photoId}/content` for a photo that exists
- **THEN** the response body is the photo's binary content with its stored content type

#### Scenario: Fetch missing photo content
- **WHEN** a client requests photo content for a measurement id or photo id that does not exist
- **THEN** the system SHALL respond with 404 Not Found

### Requirement: Batched photo metadata query
The system SHALL provide a read query that returns photo metadata (id, file name, order) without binary content for one or many measurement ids in a single call, so consumers that only need to know whether/how many photos exist do not pay the cost of loading photo binary content.

#### Scenario: Query metadata for multiple measurements at once
- **WHEN** a caller requests photo metadata for a list of measurement ids
- **THEN** the system SHALL return, for each measurement id that has photos, the photo id, file name, and order, without loading any photo's binary content

#### Scenario: Query metadata for a measurement with no photos
- **WHEN** a caller requests photo metadata for a measurement id that has no uploaded photos
- **THEN** the system SHALL return an empty result for that measurement id rather than an error

### Requirement: Photos shown on the eBay listing description page
The eBay lot description page (the page whose rendered HTML is pulled into the live eBay listing) SHALL display the uploaded photos for each measurement/tube it lists, alongside the existing measurement curve plots.

#### Scenario: Measurement with photos
- **WHEN** the eBay description page is rendered for a lot whose measurements include one that has uploaded photos
- **THEN** the page includes an `<img>` element for each of that measurement's photos, sourced from the photo content endpoint, positioned with that measurement's row/tube

#### Scenario: Measurement with no photos
- **WHEN** the eBay description page is rendered for a measurement that has no uploaded photos
- **THEN** the page renders that measurement's row without any photo images and without errors

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
