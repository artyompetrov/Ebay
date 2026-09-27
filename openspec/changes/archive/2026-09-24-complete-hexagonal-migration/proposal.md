## Why

The codebase is mid-migration from a legacy layered `Server.Application` assembly to a ports-and-adapters architecture (`Server.Domain` + `Server.Application.New` + `Server.Application.Abstractions.*` + `Server.Adapters.*`). The target pattern - command/query split, aggregates that mutate state first and conditionally raise domain events, and automatic domain-event publishing to MassTransit from the write-model unit of work - is only fully in place end-to-end (domain rules, ports, use-case service, *and* persistence on the target `WriteModelDbContext`) for `LotForSale` and `MeasurementPhoto`. `ProductMeasurement`, `TubeWorkingPoint`, `MatchedPairDifference`, and `Product` already have domain types and repository *interfaces* in the target shape, but their repository *implementations* (`MeasurementRepository`, `TubeWorkingPointsRepository`, `MatchedPairDifferenceRepository`, `ProductRepository`) still take a constructor dependency on the legacy `ApplicationDbContext`, not `WriteModelDbContext` - so migrating their call sites to "use the existing repository" is necessary but not sufficient; the repositories themselves still need to move. Everything else (controllers, background workers, message consumers, and the legacy `ApplicationDbContext` itself) still lives in `Server.Application` and does not follow the pattern at all. This split means two different architectural styles, two EF contexts, and duplicated conventions coexist indefinitely unless the migration is finished deliberately, module by module.

## What Changes

- Migrate each remaining legacy module out of `Server.Application` into the target layering: domain rules into `Server.Domain`, repository/query ports into `Server.Application.Abstractions.Driven`/`.Driving`, use-case services into `Server.Application.New`, and adapters (EF, MassTransit, WebApi, SMTP, HTTP) into the matching `Server.Adapters.*` project - deleting the legacy equivalent in the same phase so old and new never coexist for the same responsibility.
- Retire the legacy `ApplicationDbContext` (and its `Migrations/`) once every table/entity it owns has a home in `WriteModelDbContext`/`ReadModel`, including ASP.NET Identity (`ApplicationUser`) and `CacheEntry`.
- Move the legacy `Controllers/*` (MVC-style) to Web API adapters in `Server.Adapters.Driving.WebApi`, following the `web-api` skill's conventions.
- Move the legacy `Consumers/*` (PriceCalculator, EbayCurvesCacheWarmUp, the leftover `MatchedPairs/CalculateMatchedPair.cs`) to `Server.Adapters.Driving.MassTransit` consumers backed by `Server.Application.New` use-case services, matching the existing `MeasurementStateChangedConsumer` pattern.
- Move the legacy `HostedServices/*` (ChipFind, Currencies, DbCache cleanup, measurement-plot warmup, sale-advertisement cleanup) to hosted services registered from their owning adapter/application project instead of `Server.Application`.
- Move the legacy `Services/*` (GeoIp, LotDataExtractor, MatchedMeasurementService, MeasurementPlotService, MeasurementWatchedOnEbayHandler, TubeWorkingPointService) into domain logic + application use-case services + adapters per the same rule.
- Retire `Server.Application/Infrastructure/*` general-purpose helpers by moving each to the layer that actually owns it (domain, a specific application service, or a small shared adapter utility) rather than a legacy grab-bag.
- Delete `Server.Application` once empty, and remove it from `Server.csproj`/`Program.cs`/the solution.
- No intended change in externally observable behavior anywhere in this migration - it is a pure architecture change. Any behavior difference found along the way is a bug to fix, not a feature to ship silently.
- **BREAKING** for internal wiring only if a module's DI registration or route moves between assemblies in a way that changes a public contract; the proposal instructs preserving existing HTTP contracts and message contracts byte-for-byte unless a specific task says otherwise.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
(none - this is a pure internal refactor; no `openspec/specs/**` requirement changes. See `skip_specs: true` in `.openspec.yaml`.)

## Impact

- `Server.Application` (legacy assembly): shrinks phase by phase, deleted at the end.
- `Server.Domain`, `Server.Application.New`, `Server.Application.Abstractions.Driven`, `Server.Application.Abstractions.Driving`: gain new aggregates/ports/use-case services per migrated module.
- `Server.Adapters.Driven.EF.WriteModel`, `Server.Adapters.Driven.EF.ReadModel`, `Server.Adapters.Driven.EF.WriteModel.Migrations`: gain the tables currently owned by the legacy `ApplicationDbContext`/`Migrations`, including `ProductMeasurement`, `TubeWorkingPoint`, `MatchedPairDifference`, and `Product` - these already have target-shape repository interfaces but their implementations must be repointed from `ApplicationDbContext` to `WriteModelDbContext` as part of this migration, not assumed already done.
- `Server.Adapters.Driving.WebApi`: gains endpoints currently served by legacy MVC controllers.
- `Server.Adapters.Driving.MassTransit`: gains consumers currently registered from `Server.Application`.
- New/renamed adapters as needed per module: e.g. a GeoIp HTTP adapter, an SMTP-backed email sender (`Server.Adapters.Driven.Smtp` already exists and may already cover `IEmailSender`), a shipping-rates adapter.
- `Server`: composition root wiring (`Program.cs`) updated as each module moves; legacy `Server.Application` project reference removed at the end.
- No database schema changes beyond moving tables from the legacy `dbo`-ish schema (owned by `ApplicationDbContext`) to the `wm` write-model schema/read-model equivalents - each such move is its own migration, reviewed for data-preserving behavior.
- `openspec/specs/**`: unaffected (see Capabilities above); `src/Ebay/AGENTS.md` already documents the target pattern this change completes.
