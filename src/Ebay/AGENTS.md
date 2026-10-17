# AGENTS.md for src/Ebay

Rules for the C# backend and Blazor frontend in `src/Ebay`.

## Code style
- Before making changes to C# code, study not only `src/.editorconfig` but also `src/Ebay/Directory.Build.props`.
- Use `System.Text.Json` for new C# contracts/clients.
- For testable code in domain/application, avoid unnecessary dependencies on static methods.
- In `Server.Application`, document all `public` types and `public` members with XML comments (`///`).
- Use `DateTimeOffset` and `DateOnly` for date/time; do not use `DateTime`.
- Place business rules in `Server.Domain`; adapters contain only input/output translation.
- Don't widen member visibility just for the sake of tests.

## Build and quality
- `src/Ebay/Directory.Build.props` enables strict checks (nullable, warnings as errors).
- Basic build check: `cd /workspace/Ebay/src/Ebay && dotnet build`.
- `ReferenceTrimmer` is a `GlobalPackageReference` (`Directory.Packages.Global.props`), so it applies to every project and an unused `ProjectReference`/`PackageReference` fails the build (warnings as errors). If a reference is only used indirectly (e.g. loaded by reflection/assembly name, or provides build-only output like static web assets) and can't be removed, keep it but suppress the specific rule with `NoWarn="RT0002"`/`NoWarn="RT0003"` (or `TreatAsUsed="true"` for a package pinned only to fix a transitive vulnerability) directly on that `<ProjectReference>`/`<PackageReference>`, with a comment explaining why.

## Module structure
- `Frontend` — Blazor WebAssembly.
- `Frontend/Tests` — dependency-free frontend JavaScript tests, run with Node's built-in test runner.
- `Server` — backend host (composition root). It only assembles the app: adapters and platform assemblies are wired through their `Add*`/`Map*` extension methods; it must not register logging, telemetry, metrics or health checks itself.
- `Server.Platform` — platform assembly with a deliberately narrow scope: host-wide setup (ASPNETCORE_ env config, strict DI validation), logging, OpenTelemetry/OTLP export, (future) metrics/tracing and health checks. Plugged in once with `builder.AddPlatform()` right after `CreateBuilder` and `app.MapPlatform()`; new cross-cutting platform registrations go here, not into `Server/Program.cs`.
- `Server.Contracts` — OpenAPI contracts.
- `Server.Application` — application layer (use-case services, ports).
- `Server.Domain` — domain model.
- `Server.Adapters.*` — adapters, including `Server.Adapters.Driven.EF.Identity` (ASP.NET Identity + Duende IdentityServer's operational store).
- `Server.Adapters.MassTransit` — message bus adapter. It holds both sides of the bus: consumers (driving) under `Driving/` and publishers implementing driven ports under `Driven/`, and owns the whole bus configuration (`AddMassTransitAdapter()`: consumers, SQL transport, scheduler, EF outbox). It references `Server.Adapters.Driven.EF.WriteModel` - the single allowed adapter-to-adapter reference, because the transactional outbox (`AddEntityFrameworkOutbox<WriteModelDbContext>`) needs the write-model `DbContext` type and its publishers enqueue messages into a unit of work's outbox via `WriteModelOutbox.GetPublishEndpoint(unitOfWork)`. Don't add other adapter-to-adapter references.
- Identity/authorization configuration (data protection, ASP.NET Identity, IdentityServer clients, JWT, `AuthorizationClientOptions`) lives in `Server.Adapters.Driven.EF.Identity` behind `AddEfIdentityAdapter()`/`UseEfIdentityAdapterAuthentication()`, not in `Program.cs`.
- Adapter-private caches (e.g. GeoIp, ChipFind keyed `IMemoryCache`) are registered by their own adapter's `Add*Adapter()`.
- `Server.Adapters.Driven.Plotting` — SVG rendering of measurement plots, status labels and tube-info cards (`ScottPlot`) behind `IPlottingAdapter`; `MeasurementPlotService` only orchestrates (loading, approximation, axis ranges, cache keys).
- `Server.Adapters.Driven.PostgreSql` — `PostgreSqlOptions` (the `ConnectionStrings` section, `ConnectionStrings__DefaultConnection`) for the shared PostgreSQL database; every adapter that connects to it (EF read/write model, EF Identity, MassTransit SQL transport, design-time migration factories) calls the idempotent `AddPostgreSqlOptions()` and reads `IOptions<PostgreSqlOptions>`.
- `Server.Adapters.Driven.MemoryCache` — process-wide in-memory cache for measurement-bound content (photo/thumbnail bytes, rendered eBay plots) behind `IMeasurementContentCacheAdapter`: size limit (`ImageCache` section), sliding expiration and per-measurement invalidation. The application decides keys and what is cacheable; `ICacheStore` (persistent Postgres cache) is a different port.
- `Server.Adapters.Driving.BackgroundTasks` — driving adapter for periodic/startup background jobs (ChipFind monitoring, currency rates, sale advertisement cleanup, DB cache cleanup, measurement plot warmup). Each hosted service injects its (singleton) application use-case service, applies the `EbayServer:IsLocalRun` switch where relevant, and calls one use-case method; scheduling constants live here, business thresholds stay in `Server.Application`. Hosted services (`IHostedService`) live only in adapter assemblies.
- `Tests.Unit`, `Tests.Integration`, `Tests.Explicit` — test projects.
- `Tests.Frontend` — bUnit component tests and Playwright Chromium checks of rendered photo previews. Install Chromium with the generated `playwright.ps1` after building.
- `Tests.Shared` — shared test infrastructure referenced by the test projects above; `OpenSpecScenarioAttribute` and shared browser assertions (see the `write-tests` skill).

## Code generation
- Single contract: `src/Ebay/Server.Contracts/WebApi/WebApi.yaml` (OpenAPI 3.1). All backend routes are grouped under the shared `/api` server root, with each endpoint keeping its own literal `ebay/v1/...`/`webapi/v1/...` path prefix so existing routes/URLs stay unchanged.
- NSwag code generation runs automatically via MSBuild targets during the build, from this single document, for both the driving controller (`Server.Adapters.Driving.WebApi/ControllerGenerationConfig.json`, abstract `WebApiControllerBase` implemented by `WebApiController`) and the C#/TypeScript clients (`Server.Client/ClientGeneration.WebApi.json`, also feeding `src/ChromeExtension/src/clients/Generated/EbayToolWebApiClient.ts`).
- `WebApiController` is the single driving adapter for the whole contract; it must not contain command-use-case logic, only map HTTP↔application and delegate to `Server.Application` services (see the "Layer-specific rules" root `AGENTS.md` entry).

## Local backend debugging
- Run: `dotnet run --launch-profile Server --project /workspace/Ebay/src/Ebay/Server/Server.csproj`.
- Use `launchSettings.json` for backend runtime settings; don't use `appsettings*.json`.
- Use PostgreSQL on port `15432` for the local DB (running the app manually).
- `Tests.Integration` gets its PostgreSQL from `PostgresTestServer`: a Testcontainers `postgres:16` container by default (Docker is the only prerequisite), or the server in `EBAY_TESTS_POSTGRES_CONNECTION_STRING` if set (optional override, e.g. the local `15432` DB; CI doesn't set it and uses Testcontainers on the runner's Docker). Each fixture creates and drops its own scratch database; don't connect tests to the shared `ebay` database. Don't disable Testcontainers cleanup (`WithCleanUp(false)` is banned).
- In cloud sandboxes `init.sh` starts `dockerd`, and the Claude hook sets `TESTCONTAINERS_HUB_IMAGE_NAME_PREFIX=mirror.gcr.io` because anonymous Docker Hub pulls get HTTP 429 there.
- For eventual consistency in integration tests, use `Tests.Integration/TestHelpers.RetryUntilValidationSuccessAsync`.
- Useful API checks:
  - `curl -i http://127.0.0.1:5080/chrome_extensions/auth`
  - `curl -i http://127.0.0.1:5080/chrome_extensions/<extension>.xml`

## DB migrations
- DB infrastructure lives in the owning DB adapter, not in `Server.Application`.
- DbContexts are never injected directly. `WriteModelDbContext` and `ReadDbContext` are registered with `AddPooledDbContextFactory` (no constructor dependencies beyond `DbContextOptions`); `IdentityDbContext` with `AddDbContextFactory` (its constructor also takes `IOptions<OperationalStoreOptions>`, which pooling doesn't support). Read-model queries create a context per call (`await using var dbContext = await factory.CreateDbContextAsync(ct)`, `NoTracking` via options); the write model goes through `IWriteModelUnitOfWorkFactory`. The scoped context registration the factories add is consumed only by library code (MassTransit's EF bus outbox inside `WriteModelUnitOfWork`, ASP.NET Identity/Duende stores).
- For the write model, use:
  - `WriteModelDbContext`: `Server.Adapters.Driven.EF.WriteModel/WriteModelDbContext`
  - migrations project: `Server.Adapters.Driven.EF.WriteModel.Migrations`
  - DB schema: `wm`
- For Identity (ASP.NET Identity + Duende IdentityServer's operational store), use:
  - `IdentityDbContext`: `Server.Adapters.Driven.EF.Identity/IdentityDbContext`
  - migrations project: `Server.Adapters.Driven.EF.Identity.Migrations`
  - DB schema: `public` (unprefixed `AspNet*`/`PersistedGrants`/`DeviceCodes`/`Keys` tables, per ASP.NET Identity/Duende's own convention)
- Create migrations only via the EF CLI (not manually).
- Each migrations project references `Microsoft.EntityFrameworkCore.Design` with `PrivateAssets=all` (so it doesn't leak into the runtime app), which means that reference does not flow transitively into `Server` - using `Server` as `--startup-project` fails with "doesn't reference Microsoft.EntityFrameworkCore.Design". Each migrations project instead ships its own `IDesignTimeDbContextFactory` (`WriteModelDbContextDesignTimeFactory`/`IdentityDbContextDesignTimeFactory`), so use the migrations project itself as both `--project` and `--startup-project`. Its design-time factory reads the connection string from `ConnectionStrings__DefaultConnection` (env var) or `appsettings*.json` in the current directory - set the env var (same value as `Server/Properties/launchSettings.json`'s `ConnectionStrings__DefaultConnection`) before running the command.
- Commands (run from the repo root; `$CONN` is the `ConnectionStrings__DefaultConnection` value from `Server/Properties/launchSettings.json`):
  - write-model: `ConnectionStrings__DefaultConnection="$CONN" dotnet ef migrations add NewMigrationName --project src/Ebay/Server.Adapters.Driven.EF.WriteModel.Migrations/Server.Adapters.Driven.EF.WriteModel.Migrations.csproj --startup-project src/Ebay/Server.Adapters.Driven.EF.WriteModel.Migrations/Server.Adapters.Driven.EF.WriteModel.Migrations.csproj --context Server.Adapters.Driven.EF.WriteModel.WriteModelDbContext --output-dir Migrations/WriteModelDb`
  - identity: `ConnectionStrings__DefaultConnection="$CONN" dotnet ef migrations add NewMigrationName --project src/Ebay/Server.Adapters.Driven.EF.Identity.Migrations/Server.Adapters.Driven.EF.Identity.Migrations.csproj --startup-project src/Ebay/Server.Adapters.Driven.EF.Identity.Migrations/Server.Adapters.Driven.EF.Identity.Migrations.csproj --context Server.Adapters.Driven.EF.Identity.IdentityDbContext`

## Configuration and DI
- Every service is a stateless `Singleton` (`AddSingleton`). `Scoped`/`Transient` registrations and `AddDbContext`/`AddDbContextPool` are banned at compile time (RS0030, `src/BannedSymbols.txt`); per-operation state is passed as method arguments, never kept in fields.
- EF contexts come from `IDbContextFactory<T>`; a write operation passes its `IWriteModelUnitOfWork` explicitly (see "Command/query split").
- HTTP: inject `IHttpClientFactory` and create a named client per call; don't register typed clients (`AddHttpClient<TClient, TImpl>`) or capture an `HttpClient` in a singleton.
- Scoped/transient services registered internally by libraries (ASP.NET Core, ASP.NET Identity/Duende, MassTransit consumers, the scoped context the EF factories add) are allowed; the full list of exceptions and reasons is at the top of `src/BannedSymbols.txt`.
- The host validates the container in every environment (`ValidateScopes`/`ValidateOnBuild`, `Server.Platform` and `Frontend/Program.cs`), so a singleton that captures a scoped service fails at startup.
- In `Program.cs`, don't read parameters directly via `GetSection`/`GetRequiredSection` during container registration.
- Use `AddOptions<...>().BindConfiguration("...").ValidateDataAnnotations().ValidateOnStart()`.
- `GetRequiredSection` and `ConfigurationBinder.Get`/`Get<T>` are banned via `BannedSymbols.txt` (BannedApiAnalyzers, RS0030 = error); do not suppress, bind options as above.
- `IConfiguration` (with its members such as `GetSection`) and `GetConnectionString` are banned too (`src/BannedSymbols.txt`). BannedApiAnalyzers does not check generic type arguments or the indexer, so `GetService<IConfiguration>()`/`GetRequiredService<IConfiguration>()`/`Configure<IConfiguration>(...)` and `cfg["..."]` still compile - don't use them either.

## Architectural constraints
### DDD
- An aggregate boundary is a transaction and consistency boundary.
- Between aggregates, store references only by AggregateId.
- Navigation properties between aggregates are forbidden in the write model.
- Full navigations (`join`/`include`) are allowed only in the read model.
- Cascading deletes/updates are allowed only within an aggregate; use `RESTRICT` between aggregates.
- `Server.Domain` contains aggregates, `Server.Adapters.Driven.EF.WriteModel` — repositories, `Server.Adapters.Driven.EF.ReadModel` — the read model.

### Hexagonal
- `Server.Domain` — domain rules.
- `Server.Application` — use cases and ports.
- `Server.Adapters.*` — port implementations.
- `Server.Application` must not reference `Server.Adapters.*`.
- IO-free libraries in the domain: `Server.Domain` may reference an external library only if it performs no IO and helps express the model; today these are `alglib.net` (RBF approximation of anode curves, `Measurements/Approximation`) and `HtmlSanitizer` with its `AngleSharp` dependency (`Product/ProductDescriptionSanitizer`). Rendering/presentation libraries (e.g. `ScottPlot`) don't qualify even when IO-free.
- Port placement: a driven port whose signature an aggregate needs lives in `Server.Domain` (today `IMeasurementFileParser`); every other driven port lives in `Server.Application.Abstractions.Driven`.
- `Tests.Unit/Architecture/ArchitectureTest.cs` enforces these rules (they are permanent, not tech debt):
  - `Server` (composition root) references only framework, solution and `Server.Platform` assemblies; `Program.cs` contains only `AddPlatform`, `Add*Adapter`, `AddApplication` and the HTTP pipeline;
  - `Server.Application` references only `Microsoft.Extensions.DependencyInjection.Abstractions` and `Microsoft.Extensions.Logging.Abstractions` (no options/configuration binding, caches, hosting, bus or rendering libraries - those live in adapters behind ports);
  - `Server.Domain` references only `JetBrains.Annotations` and the IO-free libraries listed below;
  - the port assemblies `Server.Application.Abstractions.Driven`/`.Driving` reference no external assemblies;
  - none of these assemblies contains a hosted service.
  Adding an entry to these lists needs the same justification as a new rule.
- No driven adapter references `Server.Application`; driven adapters depend only on `Server.Application.Abstractions.Driven` (and the domain).

### Command/query split
- **Commands** (state changes): an application-layer use-case service loads an aggregate through its repository port (`Server.Application.Abstractions.Driven.Abstractions.Repositories.I*Repository`), calls domain methods on it, and commits via `IWriteModelUnitOfWork`. Each operation opens its own unit of work with `await using var unitOfWork = await unitOfWorkFactory.BeginAsync(ct)` (`IWriteModelUnitOfWorkFactory`) and passes it explicitly to every repository and outbox publisher (`IPriceRecalculationPublisher`, `IMeasurementPlotWarmupPublisher`) taking part in that atomic operation; services never keep a unit of work or `DbContext` in a field. The aggregate is always loaded and persisted as a whole; there is no partial/column-level command update.
- **Queries** (reads): go through dedicated query ports (`Server.Application.Abstractions.Driven.Abstractions.Queries.I*Queries`) implemented directly against the read model (`Server.Adapters.Driven.EF.ReadModel`). Queries project straight to DTOs and never load or go through aggregates/repositories.
- Don't use a repository to serve a read, and don't use a query port to perform a write.

### Domain model pattern and domain events
- An aggregate never exposes a public setter for behavior-bearing state. State changes go through a domain method (e.g. `ChangeState(...)`) that: 1) mutates the aggregate's own state first, 2) only then, and only if the value actually changed, calls `AddDomainEvent(...)` (see `AggregateRoot<TId>` in `Server.Domain.Abstractions`).
- Application services call these domain methods; they never mutate aggregate state directly and never publish domain events themselves.
- Domain events are dispatched automatically, not explicitly: `IWriteModelUnitOfWork.SaveChangesAsync` (`WriteModelUnitOfWork` in the EF write-model adapter) collects all changed aggregates with pending events, publishes each event via `IPublishEndpoint` (MassTransit outbox), then clears them, all before the actual `SaveChanges` write. `WriteModelDbContext.SaveChangesAsync` itself throws if tracked aggregates still have pending events, so a direct save can't silently drop them. Adding a new event type requires no publishing code beyond raising it from the aggregate.
- Consumers for domain events live in `Server.Adapters.MassTransit/Driving` (+ a handler in `Server.Application`), following the existing `MeasurementStateChanged`/`MeasurementStateChangedConsumer` pattern; register new consumers in `AddMassTransitAdapter()`.

## Review-error checklist (mandatory before a PR)
- A repository (`Server.Adapters.Driven.*.Repositories`) does not call `SaveChanges/SaveChangesAsync`; committing changes happens in the application layer via `IWriteModelUnitOfWork`.
- A repository does not contain business orchestration (e.g., reordering recalculation, scenario validation, cross-aggregate checks); this belongs in `Server.Domain` (aggregate behavior) and/or `Server.Application` (use-case service).
- Controllers (`Server.Adapters.Driving.*`) must not implement command-use-case logic; they only map HTTP <-> application and delegate scenarios to application services.
- Before submitting a PR, do a mandatory self-review by layer: **Domain rule? -> Domain**, **Use-case orchestration/commit? -> Application**, **I/O mapping only? -> Adapter**. If a point is violated — fix it before review.

## UI
- Icons: Open Iconic (https://icones.js.org/collection/oi, https://github.com/iconic/open-iconic) or emoji.
- JS interop uses .NET's native WASM interop (`System.Runtime.InteropServices.JavaScript`), not `IJSRuntime`: JS functions live in `Frontend/wwwroot/js/interop.js` (a single ES module loaded once via `JSHost.ImportAsync` in `Program.cs`), and C# declares matching `[JSImport(functionName:..., moduleName: "interop")] static partial` members on `Frontend/Interop.cs`. A third-party JS library used by only one page is loaded with a `<script>`/`<link>` tag directly in that page's `.razor` file (see `MeasurementPhotos.razor`/`Measurements.razor` for `html5-qrcode`, `ProductProperties.razor` for Quill), not in `index.html`.
- `Product.Description` is a rich-text (HTML) field authored via a Quill WYSIWYG editor (`ProductProperties.razor` + the `InitProductDescriptionEditor`/`GetProductDescriptionEditorHtml` interop functions) and rendered at the top of the eBay listing description page (`EbayLotDescriptionPage.cshtml`). It is sanitized server-side in `Server.Domain.Product.ProductDescriptionSanitizer` (allow-list HTML sanitizer) before being persisted, so it is already safe to render with `@Html.Raw` - never render unsanitized user HTML this way.
