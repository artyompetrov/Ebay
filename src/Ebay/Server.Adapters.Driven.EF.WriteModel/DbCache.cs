using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.EF.WriteModel;

internal sealed class DbCache : ICacheStore
{
    /// <summary>
    /// Версия кеша - для сброса кеша при изменении логики расчетов.
    /// </summary>
    private const string Version = "14";

    private readonly IDbContextFactory<WriteModelDbContext> _dbContextFactory;
    private readonly DatabaseConcurrentAccessSemaphore _semaphore;
    private readonly DbCacheOptions _options;
    private readonly ILogger<DbCache> _logger;

    public DbCache(
        IDbContextFactory<WriteModelDbContext> dbContextFactory,
        DatabaseConcurrentAccessSemaphore semaphore,
        IOptions<DbCacheOptions> options,
        ILogger<DbCache> logger)
    {
        _dbContextFactory = dbContextFactory;
        _semaphore = semaphore;
        _options = options.Value;
        _logger = logger;
    }

    public async Task<T?> GetOrCreateAsync<T>(
        string key,
        Func<Task<T?>> factory,
        TimeSpan ttl,
        CancellationToken cancellationToken,
        JsonSerializerOptions? jsonOptions = null)
    {
        // Persistent, cross-restart cache for expensive plot/tube-description rendering.
        // State-change invalidation is handled by the separate in-memory image cache layer.
        await _semaphore.Semaphore.WaitAsync(cancellationToken);
        try
        {
            await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

            var entry = await dbContext.Set<CacheEntry>()
                .FirstOrDefaultAsync(x => x.Key == key && x.Version == Version, cancellationToken);

            // An entry that deserializes to nothing is treated as a miss and rebuilt below.
            if (entry is not null && entry.ExpiresAt > DateTimeOffset.UtcNow && !_options.IsLocalRun &&
                JsonSerializer.Deserialize<T>(entry.Value, jsonOptions) is { } cached)
            {
                return cached;
            }

            // Create new value
            var value = await factory();
            var json = JsonSerializer.Serialize(value, jsonOptions);
            var expiresAt = DateTimeOffset.UtcNow.Add(ttl);

            if (entry is null)
            {
                dbContext.Add(new CacheEntry { Key = key, Version = Version, Value = json, ExpiresAt = expiresAt });
            }
            else
            {
                entry.Value = json;
                entry.ExpiresAt = expiresAt;
                dbContext.Update(entry);
            }

            try
            {
                await dbContext.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateException ex)
            {
                // A concurrent writer stored the same key first; the cache tolerates this race. The context is
                // private to this call, so the failed entry cannot leak into any other save.
                _logger.LogWarning(ex, "Error while updating measurement cache entry");
            }

            return value;
        }
        finally
        {
            _semaphore.Semaphore.Release();
        }
    }

    public async Task RemoveOldVersionsAsync(CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        await dbContext.Set<CacheEntry>()
            .Where(x => x.Version != Version)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
