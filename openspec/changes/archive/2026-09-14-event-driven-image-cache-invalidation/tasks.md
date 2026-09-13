## 1. Domain: raise a status-changed event

- [x] 1.1 Replace `ProductMeasurement.MeasurementState`'s public setter with a `ChangeState(MeasurementState newState)` method that raises a new `MeasurementStateChanged(string MeasurementId)` domain event only when the value actually changes; verify with a unit test asserting the event is raised on a real transition and not raised when the same state is reassigned.
- [x] 1.2 Update `MeasurementService.UpdateMeasurementState` to call `ChangeState` instead of assigning the property; verify existing unit tests for `MeasurementService` still pass.

## 2. Messaging: deliver the event and consume it

- [x] 2.1 Add the `MeasurementStateChanged` message contract alongside the existing `MeasurementWatchedOnEbay` message, and a consumer registered in `Server.Adapters.Driving.MassTransit`, following the existing `MeasurementWatchedOnEbayConsumer`/handler pattern; verify with a unit test on the handler in isolation. (`MeasurementStateChanged` is the domain event itself — raised by `ProductMeasurement.ChangeState` and auto-published by `ApplicationDbContext`'s existing domain-event dispatch, same mechanism already used for `ProductUpdated`/`CalculatePricesForProductConsumer` — no separate message type needed.)
- [x] 2.2 Register the new consumer in `Program.cs`'s `AddMassTransit` configuration; verify the app starts and the consumer endpoint is registered (existing health-check/startup test, or a smoke test if none covers consumer registration).

## 3. Cache infrastructure: per-measurement invalidation

- [x] 3.1 Add a small registry (keyed by measurementId) that hands out a `CancellationTokenSource` per measurement and exposes "invalidate this measurement" (cancel + replace) and "get the current token" operations; verify with a unit test that requesting the token twice without invalidation returns tokens from the same source, and that invalidating replaces it with a fresh, non-cancelled one.
- [x] 3.2 Extend `MemoryCacheExtensions.GetOrCreateAsync` (or add an overload) to accept an optional invalidation token to register as an `ExpirationTokens` entry alongside the existing sliding expiration; verify with a unit test that cancelling the token evicts the entry immediately.
- [x] 3.3 Wire the new consumer/handler from task 2.1 to call the registry's invalidate operation for the event's measurementId.

## 4. Photos: cache the resolved outcome, drop the per-request status check

- [x] 4.1 Change `MeasurementPhotoService.GetContentAsync`/`GetThumbnailContentAsync` to cache the resolved outcome (real content or the shared sold-placeholder constant) keyed by photoId, registering the per-measurement invalidation token from task 3.1, instead of reading `MeasurementState` from the database on every call.
- [x] 4.2 Keep `DeleteAsync`'s targeted `_cache.Remove(...)` calls as-is, updated for route-scoped `measurementId + photoId` cache keys — these are an intentionally separate invalidation trigger (a specific photo was deleted) from the new per-measurement token (the measurement's status changed), and both coexist without conflict; verify existing `MeasurementPhotoServiceTests` still pass.
- [x] 4.3 Update the integration test `GetMeasurementPhotoContentAndThumbnail_ReturnPlaceholder_ForSoldMeasurement` (and its "unknown photo id" variant) to assert via `TestHelpers.RetryUntilValidationSuccessAsync` instead of asserting immediately after `UpdateMeasurementStateAsync`, since invalidation is now delivered asynchronously.
- [x] 4.4 Add an EF `DbCommandInterceptor` (or equivalent `IInterceptor`) to the integration test host that counts executed database commands, and use it to add a test proving the command count does not increase on a second request to already-resolved photo/thumbnail content, for both the "not sold" and "sold" outcomes (matches the new "Requests between status changes never re-check the database" scenario).

## 5. Plots: same treatment for eBay curves and tube description

- [x] 5.1 Change `MeasurementPlotService.PlotForEbay`/`GetEbayTubeDescription` to cache the resolved outcome (real SVG or the sold-status SVG) keyed per measurement/params, registering the same per-measurement invalidation token, instead of reading `MeasurementState` from the database on every call.
- [x] 5.2 Also cache the matched-pair measurement id list (currently fetched unconditionally via `GetMeasurementPairMeasurements` to build the cache key) per measurementId under the same per-measurement invalidation token, so a cache hit needs zero database calls, not just the sold-check.
- [x] 5.3 Replace direct `MatchId` assignment with `ProductMeasurement.ChangeMatchId(...)`, raise a `MeasurementMatchIdChanged` domain event with old/new match ids only when the normalized value actually changes, and consume that event to invalidate the changed measurement plus old/new matched-pair peers, since the cached matched-pair id list from 5.2 would otherwise never refresh; verify with unit tests.
- [x] 5.4 Reusing the `DbCommandInterceptor` from task 4.4, add a test proving the command count does not increase on a second request for a not-sold measurement's curve plot or tube-description image, and a test proving a status change invalidates a previously cached real plot so the next request returns the sold-status image (matches `measurement-plots` spec scenarios).

## 6. Remove the now-redundant web-api response cache

- [x] 6.1 Remove `[ResponseCache]` from `MeasurementPageController.GetEbayCurves` and `GetEbayTubeDescription`, and from `WebApiController.GetMeasurementPhotoContent` and `GetMeasurementPhotoThumbnailContent`, including the accompanying rationale comments in `WebApiController.cs` that explain the now-removed 5-minute cache bound; verify existing endpoint tests still pass and no `Cache-Control`/output-cache behavior is asserted anywhere that would now fail.

## 7. Document the caches left untouched

- [x] 7.1 Add a comment to `MeasurementPlotWarmupHostedService` explaining it protects against a slow first render after deploy by pre-populating the Postgres-backed `DbCache`, and is independent of the in-memory cache this change adds invalidation for.
- [x] 7.2 Add a comment to `DbCache` explaining its purpose (persistent, cross-restart cache for expensive-to-render plot/tube-description output) and that it is intentionally out of scope for this change.

## 8. Validate

- [~] 8.1 Run `./scripts/agent-check/agent-check.sh` from the repository root and confirm it passes. Skipped because the local Windows run invokes WSL `bash`, where `dotnet` is not installed; targeted builds/tests and OpenSpec validation were run separately.
