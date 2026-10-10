## Context

See `proposal.md` - Why. The previous migration (`2026-09-24-complete-hexagonal-migration`) put every module into the `Server.Domain` / `Server.Application` / `Server.Adapters.*` shape; what is left is the residue recorded as exception lists in `ArchitectureTest`.

What each exception stands for today:

| Exception | Actual source |
|---|---|
| Root: `Duende.*` | `Program.ConfigureIdentity` |
| Root: `MassTransit.*` | `Program.ConfigureMassTransit` |
| App: `MassTransit.Abstractions` | `MeasurementPlotWarmupHostedService` only (`IPublishEndpoint`) |
| App: `Microsoft.Extensions.Hosting.Abstractions` | 6 hosted services + `Infrastructure/BackgroundTask` |
| App: `Caching.Abstractions`, `Primitives` | `IMemoryCache` in `MeasurementPhotoService`/`MeasurementPlotService`, `Caching/*` |
| App: `Options*`, `Configuration.Binder` | `BindConfiguration` for `EbayServerOptions` and `ImageCacheOptions` |
| App: `alglib.net` | `MeasurementApproximationService` |
| App: `ScottPlot` | `MeasurementPlotService.CreatePlot` |
| App: `HtmlSanitizer`, `AngleSharp` | `ProductDescriptionSanitizer` |
| Hosted services | 6 types under `Server.Application/HostedServices` |

Violations the test does not catch today:

- `Server.Adapters.Driven.EF.WriteModel` references `Server.Application` (for `EbayServerOptions` in `DbCache`).
- Driven ports `IPriceRecalculationPublisher` / `IMeasurementWatchedOnEbayPublisher` are implemented in an adapter named `Driving`.
- The two port assemblies are covered only by the `Server` prefix rule, so nothing stops them from gaining external references.

Constraints: `ReferenceTrimmer` fails the build on unused references, so every moved type must take its package reference with it; `BannedSymbols.txt` forbids `GetRequiredSection`/`ConfigurationBinder.Get`, options are bound with `AddOptions<T>().BindConfiguration(...).ValidateDataAnnotations().ValidateOnStart()`; `scripts/check-openspec-test-coverage` requires every spec scenario to stay mapped to a live test.

## Goals / Non-Goals

**Goals:**
- `ArchitectureTest` passes with these lists and no `TODO: current violations` comment:
  - root: `[]`;
  - application: `Microsoft.Extensions.DependencyInjection.Abstractions`, `Microsoft.Extensions.Logging.Abstractions`;
  - domain: `JetBrains.Annotations`, `alglib.net`, `HtmlSanitizer`, `AngleSharp`;
  - port assemblies: `[]`;
  - hosted services outside adapters: `[]`.
- `Program.cs` contains only `AddPlatform`, `Add*Adapter` calls, `AddApplication` and the HTTP pipeline.
- No driven adapter references `Server.Application`.

**Non-Goals:**
- Domain-event publishing from `WriteModelDbContext.SaveChangesAsync` via `IPublishEndpoint` stays. A port there would not decouple anything while the outbox tables live in the same `DbContext`.
- Merging the port assemblies into `Server.Domain`/`Server.Application` to mirror the template's project layout.
- Introducing driving-port interfaces for every use-case service; `Server.Adapters.Driving.WebApi` keeps using concrete application services.
- Replacing `ICacheStore` (the persistent Postgres cache) or unifying it with the in-memory cache.
- Any change to HTTP/message contracts, configuration keys or database schema.
- Cleaning up untracked leftover directories on developer machines (`Server.Application.Legacy`, `Server.Adapters.EF.*`, ...): they are not in git.

## Decisions

### Application may use logging abstractions
The template allows only `DependencyInjection.Abstractions` in the application layer. Here `Logging.Abstractions` is allowed as well: it is an IO-free abstraction, four use-case services log diagnostics, and a hand-written logger port would add a type without removing a dependency. *Alternative:* strict template list - rejected as cost without benefit.

### IO-free libraries may live in the domain; rendering libraries may not
`alglib.net` (RBF approximation of anode curves) and `HtmlSanitizer` (allow-list for product descriptions) express domain rules and perform no IO, so the code using them moves to `Server.Domain` and the libraries join the domain list. `ScottPlot` is also IO-free but stays out: it pulls native `SkiaSharp`, and how a chart is drawn is presentation, not model. *Alternative:* `ScottPlot` in the domain to avoid splitting `MeasurementPlotService` - rejected.

### Plot rendering behind a driven port
`Server.Adapters.Driven.Plotting` implements a rendering port declared in `Server.Application.Abstractions.Driven`. `MeasurementPlotService` keeps what is orchestration: loading measurements, approximation, quick-test numbers, min/max ranges, cache keys, publishing the "watched on eBay" event. The adapter receives already-prepared plot data and returns SVG. The minimum that clears the exception is `CreatePlot` (the only `ScottPlot` user); the BCL-only SVG helpers (`SvgMerger`, `QuickTestSvg`, `StatusSvg`, `NotEnoughTesterRangeSvg`, `BuildTubeInfoSvg`) are rendering too and move with it unless a helper turns out to be entangled with data loading - see Open Questions.

### Port assemblies stay and get tested
`Server.Application.Abstractions.Driven`/`.Driving` remain separate projects and are added to `ArchitectureTest` with an empty exception list. *Alternative:* the template layout (repository ports in the domain, query ports in the application, no port assemblies) - rejected: in the template a driven adapter references the whole application assembly to reach a query port, so isolation rests on discipline; here the compiler enforces it. Moving ~68 files would weaken that for a cosmetic match.

Placement rule to record in `AGENTS.md`: a port whose signature is needed by an aggregate lives in `Server.Domain` (today `IMeasurementFileParser`); every other driven port lives in `Server.Application.Abstractions.Driven`.

### Background jobs become a driving adapter
New project `Server.Adapters.Driving.BackgroundTasks` owns the `BackgroundTask` base class and five thin hosted services. Each one creates a scope, checks the local-run switch where it applies, and calls one application use-case method:

| Hosted service | Application side |
|---|---|
| ChipFind monitoring | new use-case service holding the current 190-line scenario |
| Currency rates | use-case service for refreshing rates |
| Sale advertisement cleanup | use-case method computing the staleness threshold and calling the repository |
| DB cache cleanup | use-case method calling `ICacheStore.RemoveOldVersionsAsync` |
| Measurement plot warmup | use-case method publishing warmup commands through a driven publisher port instead of `IPublishEndpoint` |

The adapter references `Server.Application` directly, as `Server.Adapters.Driving.WebApi` does. Intervals and error delays (`WellKnown.CurrencyRate`, `WellKnown.ChipFind`, `WellKnown.SaleAdvertisements` timing constants) are scheduling concerns and move to the adapter; business thresholds such as `RemoveAdvertisementAfter` stay in the application. Registration moves from `AddApplication` to `AddBackgroundTasksAdapter()`.

`MeasurementPhotoOriginalSizeBackfillHostedService` is deleted, not moved (see proposal and the `measurement-photos` delta).

### `EbayServerOptions` leaves the application
After the jobs move, no use-case service reads it. Its two settings are consumed by adapters, and each consumer declares its own options class bound to the existing `EbayServer` section, so configuration keys do not change:
- `IsLocalRun` - `Server.Adapters.Driving.BackgroundTasks` (skip jobs) and `Server.Adapters.Driven.EF.WriteModel` (`DbCache`);
- `TargetEmail` - `Server.Adapters.Driving.BackgroundTasks`, passed to the ChipFind use case as an argument.

This removes the `EF.WriteModel` -> `Server.Application` reference. *Alternative:* a shared options type in a port assembly - rejected: configuration is not a port.

### One bus adapter owning all bus configuration
`Server.Adapters.Driving.MassTransit` is renamed `Server.Adapters.MassTransit` with `Driving/` (consumers) and `Driven/` (publishers) folders. `AddMassTransitAdapter()` absorbs the whole `ConfigureMassTransit` body: consumer registration, SQL transport options, migration hosted service, scheduler, EF outbox. Because `AddEntityFrameworkOutbox<WriteModelDbContext>` needs the context type, the bus adapter references `Server.Adapters.Driven.EF.WriteModel`.

*Alternatives:* (a) the root passes an outbox callback - rejected, the root would still reference MassTransit types; (b) `EF.WriteModel` configures the bus - rejected, the EF adapter would have to know every consumer; (c) two projects (driving consumers, driven publishers) around one bus - rejected, it adds another cross-reference for no isolation gain. The adapter-to-adapter reference is accepted as an honest statement of what a transactional outbox is.

### Identity configuration moves into `Server.Adapters.Driven.EF.Identity`
`AddEfIdentityAdapter()` absorbs `ConfigureIdentity` (data protection, ASP.NET Identity, IdentityServer clients, JWT), `AuthorizationClientOptions` and the Chrome-extension client constants. The project already references Duende and owns `ApplicationUser`/`IdentityDbContext`. *Alternative:* a separate `Server.Adapters.Driving.Identity` - rejected: one file plus an adapter-to-adapter reference for a mechanism the application layer does not know about. `_LoginPartial.cshtml` and the `Microsoft.AspNetCore.Identity.UI` package stay in `Server` (framework assemblies, allowed in the root).

### Adapter-private caches are registered by their adapters
`AddGeoIpAdapter()` and `AddChipFindAdapter()` register their own keyed `IMemoryCache`. `Server.WellKnown.CacheServiceKeys` and its "must match the adapter's constant" comment are deleted.

### In-memory image cache behind a driven port
New port in `Server.Application.Abstractions.Driven` (`IMeasurementContentCacheAdapter`) with two operations: get-or-create a value tied to a measurement (key, factory, size selector) and invalidate everything for a measurement. A third operation, remove one entry by key, was added during implementation because `MeasurementPhotoService.DeleteAsync` evicts exactly the deleted photo's content and thumbnail entries; replacing that with a whole-measurement invalidation would have changed behavior. New adapter `Server.Adapters.Driven.MemoryCache` owns `MeasurementCacheInvalidationRegistry`, `MeasurementCacheInvalidationLease`, `MemoryCacheExtensions`, `ImageCacheOptions` (still bound to the `ImageCache` section) and the `MemoryCache` instance. The application keeps cache keys and the decisions about what is cacheable.

This is the least essential slice: `IMemoryCache` is itself an IO-free abstraction, and the port is close to a rename of it. It is done because it removes lease/change-token mechanics and options binding from the application and empties the root; it is sequenced last so the rest of the change does not depend on it. `ICacheStore` is untouched - a different cache with different semantics (persistent, TTL, versioned).

### One change, six pull requests
Each slice leaves the build and all tests green and shortens the exception lists in the same PR that removes the violation:

1. Test tightening and cleanup: port assemblies added to `ArchitectureTest`; backfill service deleted with the `measurement-photos` delta.
2. `Server.Adapters.Driving.BackgroundTasks`; `EbayServerOptions` and the `EF.WriteModel` -> `Server.Application` reference removed.
3. Clean root: bus adapter rename and configuration, identity configuration, adapter cache registrations.
4. IO-free libraries into the domain: approximation, sanitizer.
5. `Server.Adapters.Driven.Plotting`.
6. `Server.Adapters.Driven.MemoryCache`.

Slices 2-6 are independent of each other except that 5 and 6 both edit `MeasurementPlotService`; 5 goes first. *Alternative:* six OpenSpec changes - rejected: five of them would have no spec delta and would exist only as `skip_specs` shells.

## Risks / Trade-offs

- [Moving tests breaks `[OpenSpecScenario]` mappings, CI fails on coverage] -> Move the attribute with the test in the same commit; run `scripts/check-openspec-test-coverage` at the end of every slice. Affected today: `MeasurementPhotoServiceTests` (5), `MeasurementStateChangedHandlerTests`, `MeasurementMatchIdChangedHandlerTests`, `ProductDescriptionSanitizerTests` (3), `MeasurementPhotosFlowTests` (backfill mapping removed with the spec scenario).
- [`MeasurementPhotoServiceTests` currently exercise a real `MemoryCache`; with a faked port they stop proving eviction/invalidation behavior] -> Keep those assertions as adapter tests against the real implementation; service tests assert only what the service decides (key, cacheability, invalidation call).
- [Bus configuration moved wholesale changes consumer/endpoint registration order or options] -> Move the method body unchanged, then verify with `Tests.Integration` flows that publish and consume; no edits to consumer options in this change.
- [Renaming the bus adapter assembly changes MassTransit endpoint or message type names] -> Endpoint names derive from consumer class names and message URNs from message types in `Server.Application.Abstractions.Driving`, which do not move; consumer class names stay. Confirm on the first run that no new queues/topics appear in the SQL transport tables.
- [Identity move changes data-protection or client setup and invalidates sessions/tokens] -> Move the code unchanged; `SetApplicationName("EbayHelper")`, key directory and client ids are untouched.
- [Two options classes bound to one `EbayServer` section drift apart] -> Each declares only the property it uses; `TargetEmail` keeps `ValidateOnStart` in its owner.
- [Domain now depends on `HtmlSanitizer`/`AngleSharp` upgrades] -> Accepted; the sanitizer already had a justified exception, only its layer changes.
- [`ReferenceTrimmer` fails mid-move on leftover package references] -> Remove the package reference in the same commit as the last usage.
- [Adapter-to-adapter reference `MassTransit` -> `EF.WriteModel` becomes a precedent] -> Record in `AGENTS.md` that it is the single allowed case and why.

## Migration Plan

Pure code move, deployed slice by slice through the normal pipeline; no data migration and no configuration change. Rollback is reverting the slice's PR. After the last slice: sync specs, archive the change, then run `scripts/check-openspec-test-coverage` and `scripts/agent-check/agent-check.sh`.

## Open Questions

- Exact shape of the plot-rendering port: one method per rendered artifact or one coarse "render merged plot" method. Decided while splitting `MeasurementPlotService`; it does not affect the layer lists or the slice order.
  - **Resolved:** one method per rendered artifact - `IPlottingAdapter.RenderMeasurementPlot(MeasurementPlotRenderRequest)` (quick-test block, anode and grid plots, the "not enough tester range" warning, merged into one SVG), `RenderStatus(string)` and `RenderTubeInfo(TubeInfoRenderRequest)`. The request models (`MeasurementPlotRenderRequest`, `PlotAxisRanges`, `QuickTestValues`, `PlotLayout`, `TubeInfoRenderRequest`) live in `Server.Application.Abstractions.Driven.Models` and carry only BCL and domain types (the parsed `AnodeCurvesBase`/`GridCurvesBase`).
- Whether any BCL-only SVG helper has to stay in the application because it is entangled with data loading. Does not affect the `ScottPlot` exception either way.
  - **Resolved:** none is entangled - every helper (`SvgMerger`, quick-test, status, tester-range, tube-info) receives already prepared values, so all of them moved to `Server.Adapters.Driven.Plotting`. The application keeps loading, approximation, quick-test numbers, axis ranges, RMSE aggregation over the matched pair and cache keys.
