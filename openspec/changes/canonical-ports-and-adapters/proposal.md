## Why

`Tests.Unit/Architecture/ArchitectureTest.cs` guards the ports-and-adapters layering, but it only passes because of long exception lists: 6 external assemblies allowed in the composition root, 14 in `Server.Application`, and 6 hosted services allowed to live outside adapter assemblies. Each entry is a real violation - bus and identity configuration in `Program.cs`, hosted services, in-memory cache mechanics, options binding and a plotting library inside the application layer. The reference microservice template (`dotnet-microservice-template`) shows the target: an empty root list, a one-entry application list, no hosted-service exceptions. This change removes the violations instead of continuing to list them.

## What Changes

- Tighten `ArchitectureTest` to the target lists and extend it to the two port assemblies (`Server.Application.Abstractions.Driven`, `Server.Application.Abstractions.Driving`), which today are not checked at all:
  - composition root: no external assemblies beyond the framework and `Server.Platform`;
  - `Server.Application`: only `Microsoft.Extensions.DependencyInjection.Abstractions` and `Microsoft.Extensions.Logging.Abstractions`;
  - `Server.Domain`: only IO-free libraries that help express the model (`JetBrains.Annotations`, `alglib.net`, `HtmlSanitizer` and its `AngleSharp` dependency);
  - port assemblies: no external assemblies;
  - no hosted services outside adapter assemblies, with no exceptions.
- Move the five background jobs out of `Server.Application` into a new driving adapter `Server.Adapters.Driving.BackgroundTasks`; their scenario logic becomes application use-case services, the adapter keeps only scheduling, scoping and the "local run" switch.
- Move message bus configuration (consumers, transport, scheduler, outbox) out of `Program.cs` into the bus adapter, renamed from `Server.Adapters.Driving.MassTransit` to `Server.Adapters.MassTransit` because it holds both consumers (driving) and publishers (driven).
- Move identity/authorization configuration (`ConfigureIdentity`, `AuthorizationClientOptions`, Chrome-extension client constants) out of `Program.cs` into `Server.Adapters.Driven.EF.Identity`.
- Move keyed `IMemoryCache` registrations for GeoIp and ChipFind out of `Program.cs` into their adapters, removing the duplicated cache-key constants.
- Move IO-free computation into `Server.Domain`: curve approximation (`alglib.net`) and product-description sanitization (`HtmlSanitizer`).
- Move SVG plot rendering (`ScottPlot`) out of `MeasurementPlotService` into a new driven adapter `Server.Adapters.Driven.Plotting` behind a port; the application service keeps orchestration.
- Move the in-memory image cache (per-measurement invalidation registry, leases, cache policy, size-limit options) out of `Server.Application` into a new driven adapter `Server.Adapters.Driven.MemoryCache` behind a port.
- Remove `EbayServerOptions` and all options binding from `Server.Application`; remove the `Server.Adapters.Driven.EF.WriteModel` -> `Server.Application` project reference.
- Delete the obsolete one-time `MeasurementPhotoOriginalSizeBackfillHostedService`, its registration, its supporting query and its test - it has completed in production.
- Rename `AddApplicationNewServices` to `AddApplication`.
- No intended change in externally observable behavior: HTTP contracts, message contracts, configuration keys and database schema stay as they are. Any behavior difference found along the way is a bug to fix, not a feature to ship silently.

## Capabilities

### New Capabilities
(none - layering rules are an internal constraint enforced by `ArchitectureTest` and documented in `AGENTS.md`, not externally observable behavior.)

### Modified Capabilities
- `measurement-photos`: the "Bounded original photo size" requirement drops the one-time migration of previously stored photos (sentence and scenario), because the migration has run and its code is being deleted.

## Impact

- **Projects added**: `Server.Adapters.Driving.BackgroundTasks`, `Server.Adapters.Driven.Plotting`, `Server.Adapters.Driven.MemoryCache`.
- **Project renamed**: `Server.Adapters.Driving.MassTransit` -> `Server.Adapters.MassTransit` (namespaces, `Ebay.slnx`, references in `Server` and tests).
- **Projects changed**: `Server` (`Program.cs` shrinks to `AddPlatform` + `Add*Adapter` + `AddApplication` + pipeline; `MassTransit.SqlTransport.PostgreSQL` package reference leaves), `Server.Application` (package references shrink to two), `Server.Domain` (gains `alglib.net`, `HtmlSanitizer`), `Server.Application.Abstractions.Driven` (new ports), `Server.Adapters.Driven.EF.Identity`, `Server.Adapters.Driven.EF.WriteModel`, `Server.Adapters.Driven.GeoIp`, `Server.Adapters.Driven.ChipFind`.
- **Tests**: `ArchitectureTest` rewritten to the target lists; unit tests for moved classes follow them (cache registry, sanitizer, approximation, plot service); every existing `[OpenSpecScenario]` mapping must keep pointing at a live test.
- **Docs**: `src/Ebay/AGENTS.md` (module structure, hexagonal rules, placement rule for ports and for IO-free libraries in the domain).
- **Deployment**: none expected - configuration sections (`EbayServer`, `ImageCache`, `AuthorizationClient`) keep their keys.
