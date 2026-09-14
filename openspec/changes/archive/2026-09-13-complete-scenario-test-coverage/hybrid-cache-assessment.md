# HybridCache assessment after coverage approval

## Decision

Retain the current image cache in this PR. A direct replacement with HybridCache would regress the existing protection against a factory repopulating stale data after invalidation. This assessment started only after the independent reviewer approved coverage and all code CI gates passed.

HybridCache remains a candidate for a separate cache redesign, especially for its per-instance stampede protection and optional shared L2. It does not remove the need to coordinate invalidation with in-flight loads.

## Reproduced behavior

Tested on .NET 10 with `Microsoft.Extensions.Caching.Hybrid` 10.10.0, without an L2. A deterministic task barrier holds a factory after it has selected real photo bytes. Invalidation completes, then the old factory is released. The next request still receives the old result with no second factory call. Both `RemoveByTagAsync` and `RemoveAsync` reproduce this.

The equivalent invariant is already tested by `MemoryCacheExtensionsTests.GetOrCreateAsync_DoesNotCacheValue_WhenInvalidationHappensDuringFactory`: the current implementation does not retain the invalidated result. It still allows the already-running request to finish; the guarantee concerns subsequent requests.

HybridCache also retains a null factory result by default, whereas the current image cache deliberately retries missing values. This is a separate behavioral difference, not a claim that HybridCache cannot support our application with additional coordination.

The tested package identifies source commit `02107c65bab30aad9e35b5133ed643eaa77bccd8`. Its [factory completion code](https://github.com/dotnet/extensions/blob/02107c65bab30aad9e35b5133ed643eaa77bccd8/src/Libraries/Microsoft.Extensions.Caching.Hybrid/Internal/DefaultHybridCache.StampedeStateT.cs) can advance an invalidated item's creation timestamp before storing the factory result. The probe below establishes the observed behavior independently of that source interpretation.

## Multi-instance and capacity considerations

[Microsoft's documentation](https://learn.microsoft.com/en-us/aspnet/core/performance/caching/hybrid?view=aspnetcore-10.0#cache-storage) explicitly says key/tag invalidation does not invalidate other servers' in-memory caches. Shared L2 alone therefore cannot guarantee immediate hiding of sold images on every replica. The existing process-local registry does not solve that deployment problem either.

The current image cache has an isolated, configurable 200 MiB default budget and application-specific byte accounting. A migration must preserve that isolation and budget. `MaximumPayloadBytes` is a per-entry limit, not the total cache budget; its default 1 MiB also needs adjustment for this application's up-to-2-MiB photos and serialization overhead. We have not claimed that a bounded HybridCache setup is impossible.

## Reproduction

Create a temporary console project, replace its Program.cs with the code below, and run it:

```sh
dotnet new console -f net10.0 -n HybridCacheProbe
cd HybridCacheProbe
dotnet add package Microsoft.Extensions.Caching.Hybrid --version 10.10.0
dotnet add package Microsoft.Extensions.DependencyInjection --version 10.0.0
dotnet run
```

```csharp
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection();
services.AddHybridCache();
await using var provider = services.BuildServiceProvider();
var cache = provider.GetRequiredService<HybridCache>();
foreach (var invalidateByTag in new[] { true, false })
{
    var key = invalidateByTag ? "tag-photo" : "key-photo";
    var entered = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
    var release = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
    var reads = 0;
    var old = cache.GetOrCreateAsync<string>(key, async ct =>
    {
        Interlocked.Increment(ref reads);
        entered.SetResult();
        await release.Task.WaitAsync(ct);
        return "real-photo";
    }, tags: ["measurement"]).AsTask();
    await entered.Task;
    if (invalidateByTag)
        await cache.RemoveByTagAsync("measurement");
    else
        await cache.RemoveAsync(key);
    release.SetResult();
    await old;
    var next = await cache.GetOrCreateAsync(key, ct =>
    {
        Interlocked.Increment(ref reads);
        return ValueTask.FromResult("sold-placeholder");
    }, tags: ["measurement"]);
    Console.WriteLine($"{(invalidateByTag ? "Tag" : "Key")} invalidation during factory: next={next}, factoryCalls={reads}");
}

var nullReads = 0;
for (var i = 0; i < 2; i++)
{
    await cache.GetOrCreateAsync<string?>("missing", ct =>
    {
        nullReads++;
        return ValueTask.FromResult<string?>(null);
    });
}
Console.WriteLine($"Null factory calls across two requests: {nullReads}");
```

Observed output:

```text
Tag invalidation during factory: next=real-photo, factoryCalls=1
Key invalidation during factory: next=real-photo, factoryCalls=1
Null factory calls across two requests: 1
```

## Requirements for a later migration

- Coordinate invalidation and factory completion, for example using generation-aware keys; add deterministic stale-load and deletion race tests before removing the existing guard.
- Preserve the existing missing-value behavior and isolated byte budget.
- Add and verify the stampede benefit, including cancellation and the lifetime of scoped query dependencies during shared work.
- If multiple replicas are introduced, design and test invalidation delivery to every replica. Do not treat adding Redis as an invalidation broadcast.
- Rerun all scenario tests and the independent reviewer/fix cycle against the migrated implementation.
