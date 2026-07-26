---
name: csharp-style
description: Project C# code style rules. Use before creating, modifying or reviewing any .cs file in this solution — type/member visibility, CancellationToken parameters, nullable reference types, SOLID-minimal interfaces, immutability, IHostedService graceful shutdown, constructors, local functions, and DI registration lifetimes.
---

# C# Style

- Keep in mind that `Directory.Build.props` sets `TreatWarningsAsErrors=true`.

## Type And Member Visibility
- `public` — only for the assembly's public contract
- Otherwise the minimally sufficient modifier: `private` → `internal`
- For tests use `[InternalsVisibleTo]`, not widening visibility to `public`

## CancellationToken
- Do not use `CancellationToken cancellationToken = default` in method signatures — the default value makes it easy to forget to pass the token further down the call chain, silently losing cancellation.
- The `CancellationToken` parameter must be required. If the caller genuinely has no token, pass `CancellationToken.None` explicitly.

## Nullable
- Nullable reference types are enabled in the solution, and nullable warnings are treated as errors (`TreatWarningsAsErrors=true`).
- If a method or property is typed as a non-nullable reference type, trust that contract and do not add defensive `null` checks “just in case”; handle `null` only where the type system explicitly allows it.
- For generated interservice clients and other contract-driven integrations, do not add defensive `string.IsNullOrWhiteSpace`, empty-string, empty-collection, or "missing required field" checks for mandatory fields just in case. Trust the published contract and the generated types; add validation only when it is a real business rule of our application, not distrust of the downstream contract.
- Do not suppress nullable warnings with the `!` (null-forgiving) operator. This is acceptable only as a last resort — when expressing the null contract correctly through types and attributes is impossible and the code otherwise fails to compile.
- Instead of suppressing, express the contract explicitly: use nullable annotations (`T?`) and null-state flow attributes — `NotNullWhen`, `MaybeNullWhen`, `NotNullIfNotNull`, `MemberNotNull`, etc.
- Accompany every remaining `!` suppression with a short comment justifying why it cannot be avoided.

## SOLID
- For method parameters, use the minimally necessary interface: if a collection only needs to be enumerated — `IEnumerable<T>`; if the count is needed — `IReadOnlyCollection<T>`; if containment checks are needed — `IReadOnlySet<T>`, etc.
- For method return values, return the type actually produced rather than casting it to a more general interface without need. For example, if an array was obtained inside the method, return an array. Exception: cases where a mutable collection must not be exposed externally, such as caches or an object's internal state.

## Magic Numbers
- Do not use magic numbers in C# code.
- Extract numeric constraints, field lengths, limits, timeouts, batch sizes, retry counts, and similar values into named constants with domain-specific names.
- The constant name must explain the business or technical meaning of the value, not repeat the number.

## Immutability
- Prefer `init` over `set` wherever possible
- Use `record` for DTOs and value objects

## Graceful Shutdown
- Every `IHostedService` implementation must handle `CancellationToken` in `ExecuteAsync`
- Pass `stoppingToken` down the entire async call chain; do not use `Task.Delay` without a `CancellationToken` in background loops
- Let `OperationCanceledException` propagate up the stack without being caught — up to the point where the process was started and the token was cancelled
- Do not log `OperationCanceledException` as `WARN`/`ERROR`: it is normal termination on a stop request, not an error
- At the point where the process actually stops (where cancellation is deliberately handled), log the shutdown fact and reason at **INFO** level
- Release external resources (DB connections, MQ consumers) before shutdown completes

## Constructors
- Do not use primary constructors for classes: their parameters are mutable
  captured variables, not readonly fields
- For `record`, a primary constructor is acceptable — it generates init-only properties

## Local Functions
- Declare local functions as `static` — this forbids capturing variables from the enclosing scope (closure) at the compiler level
- If a function needs data from the outer method, pass it explicitly via parameters
- In new code, prefer `static` lambdas when the lambda does not need to capture state from the enclosing scope.
- Do not rewrite existing lambdas to `static` as a style-only cleanup. Apply this rule to newly written code; leave existing non-static lambdas unchanged unless you are already changing that lambda's behavior for a real task.

## Exceptions Handling
- Do not add `catch (SomeException) { throw; }` blocks that only rethrow the same exception without adding any behavior.
- A `catch` block is justified only if it adds value: converts the exception to a domain/application exception, enriches it with context, logs it at the correct boundary, or narrows handling with a meaningful filter.
- In contract-driven adapters, special-case HTTP status codes only when those codes are explicitly declared in the published contract. Do not invent, assume, or branch on undocumented error codes.
- If an exception should simply propagate unchanged, do not catch it.

## Retries
- Use `Polly` to organize retry behavior instead of hand-written retry loops in business code.
- Express the retry condition, retry count, retry delay, and on-retry logging in the `Polly` policy configuration.
- Keep the business operation focused on a single attempt; the retry orchestration itself should live in the `Polly` policy.

## Configuration And Options
- In the working microservice scenario, configuration parameters are passed via environment variables.
- Use `IOptions` to parameterize behavior; do not parse configuration ad-hoc in business services.
- Describe each configuration group with a dedicated record class that contains only init-only properties.
- Hardcoded default values in option classes are allowed when they express the intended default behavior.
- Every option class must declare a `SectionName` constant that defines the configuration group name.
- Minimal example:
```csharp
public sealed record class RouteSearchOptions
{
    public const string SectionName = "RouteSearch";
    public bool LlmEnabled { get; init; }
    public TimeSpan GenerationTimeout { get; init; } = TimeSpan.FromSeconds(15);
    public int RetryLimit { get; init; } = 3;
}
```
- Environment variables for this example:
    - `RouteSearch_LlmEnabled`
    - `RouteSearch_GenerationTimeout`
    - `RouteSearch_RetryLimit`
- Register options in DI:
```csharp
builder.Services.AddOptions<RouteSearchOptions>()
            .BindConfiguration(RouteSearchOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();
```
- Consume options in services via `IOptions`:
```csharp
internal sealed class RouteSearchService
{
    private readonly RouteSearchOptions _options;

    public RouteSearchService(IOptions<RouteSearchOptions> options)
    {
        _options = options.Value;
    }
}
```
- Do not bind options via `configuration.GetSection(...)`/`GetRequiredSection(...)`: it makes container construction imperative and such options unmockable in `WebApplicationFactory` tests. Always use `AddOptions<T>().BindConfiguration(...)` as shown above.

## JSON Serialization
- Use `System.Text.Json` for JSON serialization; do not add new code that depends on `Newtonsoft.Json`.

## Architecture: DDD and Ports & Adapters — Adapter Boundaries and Naming
Applies to microservices with rich domain logic. For services without a domain (CRUD, proxy, ETL), do not separate Domain/Application layers — no empty scaffolding for structure's sake.
Dependency direction: **Adapters → Application → Domain**.

### Layers
- **Domain**: BCL only; no I/O, no `async`. Invariants live in aggregates; objects are created valid; all changes go through domain methods. Time comes via `IClock`.
- **Application**: defines ports. A handler = load aggregate → domain method → save → events via Outbox. Transactions live only here.
- **Adapters**: thin implementations of ports. Framework types must not leak into Domain/Application.
  Violations to reject: `IQueryable` returned from a repository, anemic aggregates, multiple aggregates in one transaction.

### Adapter boundaries
- One downstream microservice or external system = one adapter, each in its own `.csproj`.
- Never combine calls to different downstream systems in one adapter, even within a single business flow. If an adapter starts calling a second downstream system, split it into a separate adapter project.
- Adapters never call each other. All coordination and orchestration across downstream systems belongs to the `Application` layer.

### Naming
- A port that represents an adapter boundary is named `*Adapter` (not `*Provider`, `*Manager`, `*Gateway`). The implementing class follows the same rule.
- **Driving** adapter: the outside world invokes our application. **Driven** adapter: our application calls the outside world.
- Project and namespace names use the exact downstream boundary name (e.g., a call to `Search` lives in `Search`):
    - `Service.Adapters.Driving.RestApi`
    - `Service.Adapters.Driven.EntryPoints`
    - `Service.Adapters.Driven.Search`