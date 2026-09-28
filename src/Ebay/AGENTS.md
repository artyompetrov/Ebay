# AGENTS.md for src/Ebay

Rules for the C# backend and Blazor frontend in `src/Ebay`.

## Code style
- Before making changes to C# code, study not only `src/.editorconfig` but also `src/Ebay/Directory.Build.props`.
- Use `System.Text.Json` for new C# contracts/clients.
- For testable code in domain/application, avoid unnecessary dependencies on static methods.
- In `Server.Application.New`, document all `public` types and `public` members with XML comments (`///`).
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
- `Server` — backend host (composition root).
- `Server.Contracts` — OpenAPI contracts.
- `Server.Application.New` — application layer (use-case services, ports).
- `Server.Domain` — domain model.
- `Server.Adapters.*` — adapters, including `Server.Adapters.Driven.EF.Identity` (ASP.NET Identity + Duende IdentityServer's operational store).
- `Tests.Unit`, `Tests.Integration`, `Tests.Explicit` — test projects.
- `Tests.Frontend` — bUnit component tests and Playwright Chromium checks of rendered photo previews. Install Chromium with the generated `playwright.ps1` after building.
- `Tests.Shared` — shared test infrastructure referenced by the test projects above; `OpenSpecScenarioAttribute` and shared browser assertions (see the `write-tests` skill).

## Code generation
- Single contract: `src/Ebay/Server.Contracts/WebApi/WebApi.yaml` (OpenAPI 3.1). All backend routes are grouped under the shared `/api` server root, with each endpoint keeping its own literal `ebay/v1/...`/`webapi/v1/...` path prefix so existing routes/URLs stay unchanged.
- NSwag code generation runs automatically via MSBuild targets during the build, from this single document, for both the driving controller (`Server.Adapters.Driving.WebApi/ControllerGenerationConfig.json`, abstract `WebApiControllerBase` implemented by `WebApiController`) and the C#/TypeScript clients (`Server.Client/ClientGeneration.WebApi.json`, also feeding `src/ChromeExtension/src/clients/Generated/EbayToolWebApiClient.ts`).
- `WebApiController` is the single driving adapter for the whole contract; it must not contain command-use-case logic, only map HTTP↔application and delegate to `Server.Application.New` services (see the "Layer-specific rules" root `AGENTS.md` entry).

## Local backend debugging
- Run: `dotnet run --launch-profile Server --project /workspace/Ebay/src/Ebay/Server/Server.csproj`.
- Use `launchSettings.json` for backend runtime settings; don't use `appsettings*.json`.
- Use PostgreSQL on port `15432` for the local DB; backend tests depend on the DB being available.
- For eventual consistency in integration tests, use `Tests.Integration/TestHelpers.RetryUntilValidationSuccessAsync`.
- Useful API checks:
  - `curl -i http://127.0.0.1:5080/chrome_extensions/auth`
  - `curl -i http://127.0.0.1:5080/chrome_extensions/<extension>.xml`

## DB migrations
- DB infrastructure lives in the owning DB adapter, not in `Server.Application.New`.
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
- Default services: `Transient`.
- `Scoped` — only for a shared operation context (primarily EF `DbContext`).
- `Singleton` — only with an explicit justification.
- In `Program.cs`, don't read parameters directly via `GetSection`/`GetRequiredSection` during container registration.
- Use `AddOptions<...>().BindConfiguration("...").ValidateDataAnnotations().ValidateOnStart()`.

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
- `Server.Application.New` — use cases and ports.
- `Server.Adapters.*` — port implementations.
- `Server.Application.New` must not reference `Server.Adapters.*`.

### Command/query split
- **Commands** (state changes): an application-layer use-case service loads an aggregate through its repository port (`Server.Application.Abstractions.Driven.Abstractions.Repositories.I*Repository`), calls domain methods on it, and commits via `IWriteModelUnitOfWork`. The aggregate is always loaded and persisted as a whole; there is no partial/column-level command update.
- **Queries** (reads): go through dedicated query ports (`Server.Application.Abstractions.Driven.Abstractions.Queries.I*Queries`) implemented directly against the read model (`Server.Adapters.Driven.EF.ReadModel`). Queries project straight to DTOs and never load or go through aggregates/repositories.
- Don't use a repository to serve a read, and don't use a query port to perform a write.

### Domain model pattern and domain events
- An aggregate never exposes a public setter for behavior-bearing state. State changes go through a domain method (e.g. `ChangeState(...)`) that: 1) mutates the aggregate's own state first, 2) only then, and only if the value actually changed, calls `AddDomainEvent(...)` (see `AggregateRoot<TId>` in `Server.Domain.Abstractions`).
- Application services call these domain methods; they never mutate aggregate state directly and never publish domain events themselves.
- Domain events are dispatched automatically, not explicitly: `WriteModelDbContext.SaveChangesAsync` (the write-model unit of work) collects all changed aggregates with pending events, publishes each event via `IPublishEndpoint` (MassTransit outbox), then clears them, all before the actual `SaveChanges` write. Adding a new event type requires no publishing code beyond raising it from the aggregate.
- Consumers/handlers for domain events live in `Server.Adapters.Driving.MassTransit` (+ a handler in `Server.Application.New`), following the existing `MeasurementStateChanged`/`MeasurementStateChangedConsumer` pattern.

## Review-error checklist (mandatory before a PR)
- A repository (`Server.Adapters.Driven.*.Repositories`) does not call `SaveChanges/SaveChangesAsync`; committing changes happens in the application layer via `IWriteModelUnitOfWork`.
- A repository does not contain business orchestration (e.g., reordering recalculation, scenario validation, cross-aggregate checks); this belongs in `Server.Domain` (aggregate behavior) and/or `Server.Application.New` (use-case service).
- Controllers (`Server.Adapters.Driving.*`) must not implement command-use-case logic; they only map HTTP <-> application and delegate scenarios to application services.
- Before submitting a PR, do a mandatory self-review by layer: **Domain rule? -> Domain**, **Use-case orchestration/commit? -> Application.New**, **I/O mapping only? -> Adapter**. If a point is violated — fix it before review.

## UI
- Icons: Open Iconic (https://icones.js.org/collection/oi, https://github.com/iconic/open-iconic) or emoji.
- JS interop uses .NET's native WASM interop (`System.Runtime.InteropServices.JavaScript`), not `IJSRuntime`: JS functions live in `Frontend/wwwroot/js/interop.js` (a single ES module loaded once via `JSHost.ImportAsync` in `Program.cs`), and C# declares matching `[JSImport(functionName:..., moduleName: "interop")] static partial` members on `Frontend/Interop.cs`. A third-party JS library used by only one page is loaded with a `<script>`/`<link>` tag directly in that page's `.razor` file (see `MeasurementPhotos.razor`/`Measurements.razor` for `html5-qrcode`, `ProductProperties.razor` for Quill), not in `index.html`.
- `Product.Description` is a rich-text (HTML) field authored via a Quill WYSIWYG editor (`ProductProperties.razor` + the `InitProductDescriptionEditor`/`GetProductDescriptionEditorHtml` interop functions) and rendered at the top of the eBay listing description page (`EbayLotDescriptionPage.cshtml`). It is sanitized server-side in `Server.Application.New.ProductDescriptionSanitizer` (allow-list HTML sanitizer) before being persisted, so it is already safe to render with `@Html.Raw` - never render unsanitized user HTML this way.
