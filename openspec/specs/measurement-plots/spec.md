# measurement-plots Specification

## Purpose

Serving the rendered anode/grid curve plot and tube-description image for a measurement's eBay listing, from memory once resolved, while making sure a sold measurement stops showing its real curves to new visitors as soon as it is sold.

## Requirements

### Requirement: Cached serving of eBay curve and tube-description images
For a measurement that has not been sold, the system SHALL serve the eBay curve plot image and the tube-description image from an in-memory cache after the first successful retrieval, instead of re-reading measurement data from the database on every request. The system SHALL NOT re-check the measurement's sold/not-sold status against the database on every request. Instead, whenever the measurement's status changes, the system SHALL invalidate that measurement's cached plot/tube-description results so the next request re-resolves them, rather than relying on a per-request live status check.

#### Scenario: Repeated curve plot request served from cache
- **WHEN** the eBay curve plot image is requested twice for a measurement that has not been sold
- **THEN** the second request's image is served from the in-memory cache without re-reading measurement data from the database

#### Scenario: Repeated tube-description request served from cache
- **WHEN** the eBay tube-description image is requested twice for a measurement that has not been sold
- **THEN** the second request's image is served from the in-memory cache without re-reading measurement data from the database

#### Scenario: Requests between status changes never re-check the database
- **WHEN** a measurement's curve plot or tube-description image has already been resolved once for a measurement whose status has not changed since
- **THEN** subsequent requests return the cached result without a fresh database check of the measurement's status

#### Scenario: Sale still takes effect immediately despite cached images
- **WHEN** a measurement's curve plot or tube-description image has already been cached and the measurement is then sold
- **THEN** the cached result for that measurement is invalidated, and the next request for either image returns the sold-status image, not the previously cached real curves
