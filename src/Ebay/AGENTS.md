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

## Module structure
- `Frontend` — Blazor WebAssembly.
- `Server` — backend host (composition root).
- `Server.Contracts` — OpenAPI contracts.
- `Server.Application` — legacy application layer.
- `Server.Application.New` — new application layer.
- `Server.Domain` — domain model.
- `Server.Adapters.*` — adapters.
- `Tests.Unit`, `Tests.Integration`, `Tests.Explicit` — test projects.

## Code generation
- Legacy contract: `src/Ebay/Server.Contracts/Legacy/Ebay.yaml` (do not add new changes there).
- New contracts: `src/Ebay/Server.Contracts/WebApi/*.yaml`.
- NSwag code generation runs automatically via MSBuild targets during the build.
- Add new API functionality only to `Server.Contracts/WebApi/*.yaml`; don't add new endpoints/DTOs to `Legacy/Ebay.yaml`.

## Local backend debugging
- Run: `dotnet run --launch-profile Server --project /workspace/Ebay/src/Ebay/Server/Server.csproj`.
- Use `launchSettings.json` for backend runtime settings; don't use `appsettings*.json`.
- Use PostgreSQL on port `15432` for the local DB; backend tests depend on the DB being available.
- For eventual consistency in integration tests, use `Tests.Integration/TestHelpers.RetryUntilValidationSuccessAsync`.
- Useful API checks:
  - `curl -i http://127.0.0.1:5080/chrome_extensions/auth`
  - `curl -i http://127.0.0.1:5080/chrome_extensions/<extension>.xml`

## DB migrations
- Legacy migrations: `Server.Application/Migrations`.
- DB infrastructure should live in the DB adapter, not in `Server.Application.New`.
- Don't add new EF infrastructure code (entities/mappings/tables) to the legacy `Server.Application/Data/ApplicationDbContext`; place it in adapter DbContexts.
- For the write model, use:
  - `WriteModelDbContext`: `Server.Adapters.Driven.EF.WriteModel/WriteModelDbContext`
  - migrations project: `Server.Adapters.Driven.EF.WriteModel.Migrations`
  - DB schema: `wm`
- Create migrations only via the EF CLI (not manually).
- Commands:
  - legacy: `cd /workspace/Ebay/src/Ebay && dotnet ef migrations add NewMigrationName --project Server.Application --startup-project Server`
  - write-model: `cd /workspace/Ebay && dotnet ef migrations add NewMigrationName --project src/Ebay/Server.Adapters.Driven.EF.WriteModel.Migrations/Server.Adapters.Driven.EF.WriteModel.Migrations.csproj --startup-project src/Ebay/Server/Server.csproj --context Server.Adapters.Driven.EF.WriteModel.WriteModelDbContext --output-dir Migrations/WriteModelDb`

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

## Review-error checklist (mandatory before a PR)
- A repository (`Server.Adapters.Driven.*.Repositories`) does not call `SaveChanges/SaveChangesAsync`; committing changes happens in the application layer via `IWriteModelUnitOfWork`/`IUnitOfWork`.
- A repository does not contain business orchestration (e.g., reordering recalculation, scenario validation, cross-aggregate checks); this belongs in `Server.Domain` (aggregate behavior) and/or `Server.Application.New` (use-case service).
- Controllers (`Server.Adapters.Driving.*`) must not implement command-use-case logic; they only map HTTP <-> application and delegate scenarios to application services.
- Before submitting a PR, do a mandatory self-review by layer: **Domain rule? -> Domain**, **Use-case orchestration/commit? -> Application.New**, **I/O mapping only? -> Adapter**. If a point is violated — fix it before review.

## UI
- Icons: Open Iconic (https://icones.js.org/collection/oi, https://github.com/iconic/open-iconic) or emoji.
