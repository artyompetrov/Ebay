using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.New;

namespace Server.Adapters.Driven.EF.WriteModel;

internal sealed class DbCache : ICacheStore
{
    /// <summary>
    /// Версия кеша - для сброса кеша при изменении логики расчетов.
    /// </summary>
    private const string Version = "14";

    private readonly WriteModelDbContext _context;
    private readonly DatabaseConcurrentAccessSemaphore _semaphore;
    private readonly EbayServerOptions _options;
    private readonly ILogger<DbCache> _logger;

    public DbCache(
        WriteModelDbContext context,
        DatabaseConcurrentAccessSemaphore semaphore,
        EbayServerOptions options,
        ILogger<DbCache> logger)
    {
        _context = context;
        _semaphore = semaphore;
        _options = options;
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
            var entry = await _context.Set<CacheEntry>()
                .FirstOrDefaultAsync(x => x.Key == key && x.Version == Version, cancellationToken);

            if (entry is not null && entry.ExpiresAt > DateTimeOffset.UtcNow)
            {
                if (!_options.IsLocalRun)
                {
                    return JsonSerializer.Deserialize<T>(entry.Value, jsonOptions) ??
                           throw new InvalidOperationException("Deserialization failed");
                }
            }

            // Create new value
            var value = await factory();
            var json = JsonSerializer.Serialize(value, jsonOptions);
            var expiresAt = DateTimeOffset.UtcNow.Add(ttl);

            if (entry is null)
            {
                _context.Add(new CacheEntry { Key = key, Version = Version, Value = json, ExpiresAt = expiresAt });
            }
            else
            {
                entry.Value = json;
                entry.ExpiresAt = expiresAt;
                _context.Update(entry);
            }

            try
            {
                await _context.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateException ex)
            {
                _logger.LogWarning(ex, "Error while updating measurement cache entry");
            }

            return value;
        }
        finally
        {
            _semaphore.Semaphore.Release();
        }
    }

    public Task RemoveOldVersionsAsync(CancellationToken cancellationToken)
    {
        return _context.Set<CacheEntry>()
            .Where(x => x.Version != Version)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
