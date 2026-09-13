## Why

Buyers decide whether to purchase based on how fast a tube's photos and measurement curves load, so every request for that content should be served from memory. Today, serving a photo/thumbnail or an eBay curve/tube-description image still requires a live database read on every request (to check whether the measurement has been sold) plus, on a cache miss, another database read for the bytes themselves; and a `[ResponseCache]` HTTP-level cache sits in front of that, which can serve real (pre-sale) bytes for up to 5 minutes after a measurement is marked sold. We need the opposite trade-off: serve fully from memory once warm, but make a sale visible to new visitors immediately, not after a cache expires.

## What Changes

- Remove the `[ResponseCache]` attribute from the state-dependent endpoints (`GET /m/{measurementId}/ebay_curves`, `GET /m/{measurementId}/ebay_tube_description`, `GET .../photos/{photoId}/content`, `GET .../photos/{photoId}/thumbnail/content`). **BREAKING** for any external client relying on the `Cache-Control`/output-cache behavior these attributes currently produce.
- Stop checking the measurement's sold/not-sold status against the database on every request. Instead, cache the resolved outcome (real content vs. sold placeholder) in memory after first resolution, keyed per measurement, so repeat requests never touch the database.
- Introduce a domain event raised when a measurement's status changes (any transition, not just "became sold"), delivered through the existing outbox/MassTransit pipeline, consumed by a handler that invalidates the in-memory cache entries tied to that measurement so the very next request re-resolves them.
- Encapsulate `ProductMeasurement.MeasurementState` behind a domain method instead of a public setter, since raising the domain event requires the aggregate itself to know when its state changes.
- Add explanatory comments to `MeasurementPlotWarmupHostedService` (protects against a slow first render after deploy by pre-populating the Postgres-backed `DbCache`) and to `DbCache` (a separate, persistent, cross-restart cache — not part of this change, kept as-is) so their purpose isn't confused with the in-memory cache this change adds invalidation for.

## Capabilities

### New Capabilities
- `measurement-plots`: caching and sold-visibility behavior for the eBay curve and tube-description plot images served for a measurement (mirrors the equivalent, already-specified behavior for photos).

### Modified Capabilities
- `measurement-photos`: the "Cached serving of photo and thumbnail content" requirement changes from "the sold/not-sold check runs on every request" to "the cache is invalidated immediately when the measurement's status changes, so no per-request database check is needed."

## Impact

- `Server.Adapters.Driving.WebApi.Controllers.WebApiController` and `Server.Application.Controllers.MeasurementPageController`: remove `[ResponseCache]` attributes.
- `Server.Application.New.MeasurementPhotoService` and `Server.Application.Services.MeasurementPlot.MeasurementPlotService`: replace the live per-request status check with a cached, event-invalidated resolution.
- `Server.Domain.Measurements.ProductMeasurement`: replace the public `MeasurementState` setter with a domain method that raises a state-changed domain event.
- `Server.Application.New.MeasurementService.UpdateMeasurementState`: calls the new domain method instead of assigning the property.
- New MassTransit consumer + handler that invalidates the shared in-memory cache on the state-changed event.
- No changes to `DbCache` or `MeasurementPlotWarmupHostedService` behavior — comments only.
