## ADDED Requirements

### Requirement: Deferred loading of the full-size preview image on the eBay listing description page
On the eBay listing description page, the full-size preview image for a measurement photo SHALL NOT be requested over the network when the page loads. It SHALL be requested only once a viewer actually interacts with that photo's thumbnail (hover on desktop, tap on mobile). The thumbnail image itself SHALL still load with the page as today.

#### Scenario: Full-size image not requested on page load
- **WHEN** the eBay description page is rendered and loaded by a viewer's browser who has not interacted with any photo thumbnail
- **THEN** no network request for any photo's full-size content endpoint has been made, while each photo's thumbnail has loaded

#### Scenario: Full-size image requested only on interaction
- **WHEN** a viewer hovers or taps a specific photo's thumbnail for the first time
- **THEN** the browser requests that photo's full-size content endpoint at that point, and the existing in-place preview behavior (centered overlay, dimmed backdrop on tap, CSS-only, no navigation) continues to work as already specified

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

### Requirement: Cached serving of photo and thumbnail content
For a measurement that has not been sold, the system SHALL serve a photo's full content and thumbnail content from an in-memory cache after the first successful retrieval, instead of re-reading the binary content from the database on every request. The sold/not-sold check itself SHALL continue to run on every request so a measurement that becomes sold still stops exposing the real photo/thumbnail without waiting on the cache to expire.

#### Scenario: Repeated content request served from cache
- **WHEN** a photo's full content is requested twice for a measurement that has not been sold
- **THEN** the second request's binary content is served from the in-memory cache without re-reading it from the database

#### Scenario: Repeated thumbnail request served from cache
- **WHEN** a photo's thumbnail content is requested twice for a measurement that has not been sold
- **THEN** the second request's thumbnail content is served from the in-memory cache without re-reading it from the database

#### Scenario: Sale still takes effect immediately despite cached bytes
- **WHEN** a measurement's photo content has already been cached and the measurement is then sold
- **THEN** the next request for that photo's content or thumbnail returns the placeholder image, not the cached real bytes
