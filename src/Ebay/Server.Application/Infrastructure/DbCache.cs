using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;

namespace Server.Application.Infrastructure;

public class DbCache(ApplicationDbContext context, DatabaseConcurrentAccessSemaphore semaphore, EbayServerOptions options)
{
    private readonly ApplicationDbContext _context = context;
    private readonly DatabaseConcurrentAccessSemaphore _semaphore = semaphore;
    private readonly EbayServerOptions _options = options;

    public async Task<T?> GetOrCreateAsync<T>(
        string key,
        Func<Task<T?>> factory,
        TimeSpan ttl,
        CancellationToken cancellationToken,
        JsonSerializerOptions? jsonOptions = null)
    {
        await _semaphore.Semaphore.WaitAsync(cancellationToken);
        try
        {
            var entry = await _context.Set<CacheEntry>()
                .FirstOrDefaultAsync(x => x.Key == key && x.Version == WellKnown.DbCache.Version, cancellationToken);

            if (entry is not null && entry.ExpiresAt > DateTime.UtcNow)
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
            var expiresAt = DateTime.UtcNow.Add(ttl);

            if (entry is null)
            {
                _ = _context.Add(new CacheEntry { Key = key, Version = WellKnown.DbCache.Version, Value = json, ExpiresAt = expiresAt });
            }
            else
            {
                entry.Value = json;
                entry.ExpiresAt = expiresAt;
                _ = _context.Update(entry);
            }

            _ = await _context.SaveChangesAsync(cancellationToken);
            return value;
        }
        finally
        {
            _ = _semaphore.Semaphore.Release();
        }
    }

    public Task RemoveOldVersionsAsync(CancellationToken cancellationToken)
    {
        return _context.Set<CacheEntry>()
            .Where(x => x.Version != WellKnown.DbCache.Version)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
