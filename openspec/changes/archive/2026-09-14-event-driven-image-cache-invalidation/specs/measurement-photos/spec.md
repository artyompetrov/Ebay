## MODIFIED Requirements

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
