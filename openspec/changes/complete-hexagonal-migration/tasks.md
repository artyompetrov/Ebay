## 1. Infrastructure helpers with no DB/Identity coupling

- [ ] 1.1 Move `DictionaryExtensions`, `EnumerableExtensions`, `ExceptionExtensions`, `HtmlUtilities`, `ModelsExtensions` from `Server.Application/Infrastructure` to the project of their actual (only) caller (`Server.Domain` if used by domain logic, otherwise the specific `Server.Application.New` or adapter project); delete the originals; verify `dotnet build` succeeds and existing unit tests referencing these helpers still pass.
- [ ] 1.2 Move `SvgMerger` to the adapter/service that owns SVG rendering (likely alongside `MeasurementPlotService`'s eventual new home from section 3); verify with its existing unit test (or add one if none exists) per the `write-tests` skill.
- [ ] 1.3 Grep every call site of `TransactionScopeFactory` and record the list in this task's PR description (do **not** delete or relocate it yet) - this list is the coupling map used by tasks 3.x-6.x to confirm each site's `ApplicationDbContext`/write-model pairing has been merged into a single commit before section 7 removes it.

## 2. LotDataExtractor and GeoIp (self-contained, no aggregate involvement)

- [ ] 2.1 Move the `LotDataExtractor` parsing rules (`ConditionExtractor`, `PcsExtractor`, `TestStateExtractor`, `ManualFieldsExtractor`, `ExtractorBase`, `IExtractor`, `ExtractFrom`, `ExtractionResult`) into `Server.Domain` if they encode business rules about lot condition/state, or into a new `Server.Application.New/LotDataExtractor` use-case service if they are pure orchestration with no reusable domain invariant; delete the legacy versions; verify with the existing unit tests for these extractors (move/rename them alongside, per `[TestOf(typeof(...))]`).
- [ ] 2.2 Add an `IShippingRatesService` port in `Server.Application.Abstractions.Driven` (if the shape differs from the legacy interface, keep the contract identical) and move `ShippingRatesService`'s HTTP-calling implementation to a `Server.Adapters.Driven.*` project (new or existing, matching its external dependency); verify existing tests for shipping-rate lookups still pass against the moved adapter.
- [ ] 2.3 Add an `IGeoIpService` port and move `GeoIpService`/`GeoIpLocation` to a driven adapter calling the external GeoIP source; verify with existing tests or add unit tests per `write-tests` for the adapter's parsing of a sample response.
- [ ] 2.4 Delete the now-empty `Server.Application/Services/LotDataExtractor` and `Server.Application/Services/GeoIp` folders; verify `dotnet build` succeeds with no remaining references.

## 3. Measurement- and TubeWorkingPoint-adjacent services (repositories already exist)

- [ ] 3.1 Change `MatchedMeasurementService` to depend on the existing `IMeasurementRepository`/use-case service in `Server.Application.New` instead of `ApplicationDbContext`; move it into `Server.Application.New`; verify existing `MeasurementServiceTests`-style unit tests pass unchanged (behavior must not change).
- [ ] 3.2 Change `MeasurementPlotService`/`IMeasurementPlotService` to depend on `IMeasurementRepository`/`IMeasurementInfoQueries` instead of `ApplicationDbContext`; move into `Server.Application.New`; verify existing plot-rendering tests (including the `DbCommandInterceptor`-based command-count tests from the `event-driven-image-cache-invalidation` change) still pass.
- [ ] 3.3 Change `MeasurementWatchedOnEbayHandler` to use the existing measurement repository/use-case service instead of `ApplicationDbContext`; keep it as (or move it alongside) the existing `MeasurementWatchedOnEbayConsumer` in `Server.Adapters.Driving.MassTransit`; verify with existing consumer/handler unit tests.
- [ ] 3.4 Change `TubeWorkingPointService` to use the existing `ITubeWorkingPointsRepository` instead of `ApplicationDbContext`; move into `Server.Application.New`; verify with existing tube-working-point tests, including the `[OpenSpecScenario]`-tagged ones for the `tube-working-point` capability.
- [ ] 3.5 Delete `Server.Application/Services/Measurement`, `Server.Application/Services/MeasurementPlot`, `Server.Application/Services/MeasurementWatching`, and `Server.Application/Services/TubeWorkingPointService.cs`; verify `dotnet build` succeeds and `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh` still passes for the `tube-working-point`/`measurement-*` capabilities.

## 4. PriceCalculator, EbayCurvesCacheWarmUp, and the leftover MatchedPairs consumer

- [ ] 4.1 Design (in `Server.Domain.Product`, extending the existing `Product` aggregate) whatever pricing-calculation domain rules `CalculateMetricsForProduct`/`CalculatePricesForAll`/`CalculatePricesForLot`/`CalculatePricesForProductConsumer` currently implement inline; verify with new domain unit tests covering the pricing rules extracted (this is the first module in this change to need real domain design work - keep the calculation results byte-identical to the legacy implementation and add characterization tests against legacy output before refactoring).
- [ ] 4.2 Add use-case services in `Server.Application.New` for each price-calculation scenario, backed by `IProductRepository`; add matching consumers in `Server.Adapters.Driving.MassTransit` replacing the legacy ones; verify with consumer unit tests plus an integration test that a calculation request produces the same result as before the move.
- [ ] 4.3 Move `CalculateEbayCurvesForMeasurement`/`CalculateEbayCurvesForMeasurementConsumer` to a use-case service + MassTransit consumer following the same pattern; verify with existing cache-warmup tests.
- [ ] 4.4 Delete the leftover `Server.Application/Consumers/MatchedPairs/CalculateMatchedPair.cs` (the calculator itself already lives in `Server.Application.New.MatchedPairs.MatchedPairsCalculator`); verify no remaining references and existing `matched-pair`/`measurement-matching` tests still pass.
- [ ] 4.5 Delete `Server.Application/Consumers` entirely; verify `dotnet build` succeeds and `Program.cs`'s `AddMassTransit` registers only the new consumers.

## 5. Hosted services

- [ ] 5.1 Move `ChipfindBackgroundTask`/`IChipfindAdapter`/`IEmailSender`/`SaleAdvertisement` into `Server.Application.New` (use-case/orchestration) plus `Server.Adapters.Driven.ChipFind` (already exists - confirm it can host the adapter implementation) and `Server.Adapters.Driven.Smtp` (confirm it already implements `IEmailSender`, otherwise add it there); register the hosted service from its new home in `Program.cs`; verify with existing `chipfind-monitoring` capability tests and `[OpenSpecScenario]` mappings.
- [ ] 5.2 Move `CurrencyRateBackgroundTask` to `Server.Application.New` + a driven adapter for the currency-rate source; verify with existing currency-rate tests.
- [ ] 5.3 Move `DbCacheCleanupHostedService` and the `Infrastructure/DbCache` type it cleans up to wherever `DbCache` itself ends up (see task 1.2/3.2 area - `DbCache` is used by `MeasurementPlotService`/`MeasurementPlotWarmupHostedService`); verify with existing cache-cleanup tests.
- [ ] 5.4 Move `MeasurementPlotWarmupHostedService` alongside the migrated `MeasurementPlotService` from task 3.2; verify with existing warmup tests.
- [ ] 5.5 Move `SaleAdvertisementCleanupBackgroundTask` alongside the migrated ChipFind module from task 5.1; verify with existing cleanup tests.
- [ ] 5.6 Delete `Server.Application/HostedServices`; verify `dotnet build` succeeds and `Program.cs` registers all hosted services from their new homes.

## 6. Controllers

- [ ] 6.1 Move `ProductPassportFileController` to a `Server.Adapters.Driving.WebApi` endpoint, following the `web-api` skill's conventions (OpenAPI contract in `Server.Contracts/WebApi/*.yaml`, manual adapter validation, status codes); verify with existing endpoint tests, preserving the exact route/response contract.
- [ ] 6.2 Move `MeasurementPageController`'s remaining endpoints (after the `[ResponseCache]` removal already done in `event-driven-image-cache-invalidation`) to `Server.Adapters.Driving.WebApi`; verify with existing endpoint tests.
- [ ] 6.3 Move `EbayController`/`EbayControllerImplementation`/`LotDataToExtract`/`NonOkHttpAnswerException`/`ErrorFilter` to `Server.Adapters.Driving.WebApi`, backed by use-case services in `Server.Application.New` for any business logic currently inline in `EbayControllerImplementation`; verify with existing eBay-extension endpoint tests (`chrome_extensions/*` per `AGENTS.md`'s local backend debugging checks).
- [ ] 6.4 Delete `Server.Application/Controllers`; verify `dotnet build` succeeds and every previously-legacy route still resolves (manual `curl` checks per `AGENTS.md`, plus existing integration tests).

## 7. Retire `ApplicationDbContext` and the legacy project

- [ ] 7.1 For each of `Product`, `Lot`, `IgnoredLot`, `Purchase`, `ClientError`, `ProductEmailSendHistory`, `Currency`, `CacheEntry`: add the table/mapping to `WriteModelDbContext` (or its read-model equivalent for pure read tables) via an EF migration in `Server.Adapters.Driven.EF.WriteModel.Migrations` that also copies existing rows from the legacy table; verify row counts match between old and new tables after the migration runs against a copy of production data.
- [ ] 7.2 Cut every remaining call site over to the new mapping (there should be none left outside sections 1-6's already-migrated code); drop the now-redundant `ProductMeasurement`/`TubeWorkingPoint`/`MatchedPairDifference` mappings from `ApplicationDbContext` (already fully owned by `WriteModelDbContext` since section 3); verify `dotnet build` succeeds with `ApplicationDbContext` reduced to Identity/IdentityServer concerns only.
- [ ] 7.3 Create a new dedicated Identity `DbContext` + migrations project (e.g. `Server.Adapters.Driven.EF.Identity`, per `design.md`'s Open Questions) hosting `ApplicationUser` and the Duende `OperationalStoreOptions` tables; migrate existing Identity data into it; verify a full login/token-refresh/logout cycle works against the new context before removing the old one (per `design.md`'s Risks).
- [ ] 7.4 Using the `TransactionScopeFactory` call-site map from task 1.3, confirm every site's legacy-context and write-model operations now commit through a single `WriteModelDbContext` save (from sections 3-6); delete `TransactionScopeFactory` and every remaining `TransactionScope` usage; verify with an integration test that a previously cross-context operation is now atomic via a single `SaveChangesAsync` call.
- [ ] 7.5 Delete `Server.Application/Data/ApplicationDbContext.cs`, `ApplicationUser.cs`, `CacheEntry.cs`, `Server.Application/Migrations`, `Server.Application/Areas/Identity`, and finally the empty `Server.Application` project itself; remove its reference from `Server.csproj`/`Ebay.slnx`; verify `dotnet build` succeeds for the whole solution with no reference to `Server.Application` remaining anywhere.

## 8. Documentation and final validation

- [ ] 8.1 Update `src/Ebay/AGENTS.md`'s "Module structure" and "DB migrations" sections to remove references to the now-deleted legacy `Server.Application`/`ApplicationDbContext` (module structure entry, legacy migrations command, legacy contract note if still applicable).
- [ ] 8.2 Run `./scripts/check-openspec-test-coverage/check-openspec-test-coverage.sh` and fix any missing/stale `[OpenSpecScenario]` mappings surfaced by moved code.
- [ ] 8.3 Run `./scripts/agent-check/agent-check.sh` from the repository root and confirm it passes end to end (build, tests, OpenSpec validation).
