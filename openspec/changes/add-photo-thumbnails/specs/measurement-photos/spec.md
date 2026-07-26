## ADDED Requirements

### Requirement: Photo thumbnail generated on upload
When a measurement photo is uploaded, the system SHALL generate a size-capped thumbnail from it and store the thumbnail alongside the original.

#### Scenario: Thumbnail created at upload time
- **WHEN** staff uploads a photo for a measurement
- **THEN** the system generates a size-capped thumbnail from the uploaded content and stores it together with the photo, without a separate request

### Requirement: Photo thumbnail retrieval
The system SHALL expose an API endpoint that returns the stored thumbnail image for a measurement photo, by measurement id and photo id.

#### Scenario: Fetch thumbnail for an uploaded photo
- **WHEN** a client requests `GET /api/webapi/v1/measurements/{measurementId}/photos/{photoId}/thumbnail/content` for a photo uploaded after thumbnail generation was introduced
- **THEN** the response body is the stored thumbnail image with content type `image/jpeg`

#### Scenario: Fetch missing photo's thumbnail
- **WHEN** a client requests a thumbnail for a measurement id or photo id that does not exist
- **THEN** the system SHALL respond with 404 Not Found

### Requirement: Photo previews on the phone-oriented management page
The `MeasurementPhotos.razor` ("Фото измерений") page SHALL render each uploaded photo in its list as a thumbnail image rather than a plain filename link, and clicking the thumbnail SHALL open the corresponding full-size photo.

#### Scenario: Photo list shows thumbnails
- **WHEN** the "Фото измерений" page lists photos for a measurement
- **THEN** each list entry shows a thumbnail image (sourced from the thumbnail endpoint) for that photo, not just its filename

#### Scenario: Clicking a thumbnail opens the full photo
- **WHEN** staff clicks a photo's thumbnail on the "Фото измерений" page
- **THEN** the full-size original photo (sourced from the existing content endpoint) opens

## MODIFIED Requirements

### Requirement: Photos shown on the eBay listing description page
The eBay lot description page (the page whose rendered HTML is pulled into the live eBay listing) SHALL display a thumbnail for each of the uploaded photos for each measurement/tube it lists, arranged horizontally within that measurement's row, alongside the existing measurement curve plots. Clicking a thumbnail SHALL open the corresponding full-size photo.

#### Scenario: Measurement with photos
- **WHEN** the eBay description page is rendered for a lot whose measurements include one that has uploaded photos
- **THEN** the page includes a thumbnail `<img>` element for each of that measurement's photos, sourced from the thumbnail endpoint, arranged horizontally (side by side, not stacked vertically) within that measurement's row/tube

#### Scenario: Measurement with no photos
- **WHEN** the eBay description page is rendered for a measurement that has no uploaded photos
- **THEN** the page renders that measurement's row without any photo images and without errors

#### Scenario: Clicking a thumbnail opens the full photo
- **WHEN** a viewer of the eBay description page clicks one of a measurement's photo thumbnails
- **THEN** the corresponding full-size original photo (sourced from the existing full-content endpoint) opens
