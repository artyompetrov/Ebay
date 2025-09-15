using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;
using Server.Application.Data.Models;

namespace Server.Application.Infrastructure;

public class DbCache
{
    private readonly ApplicationDbContext _context;
    private readonly DatabaseConcurrentAccessSemaphore _semaphore;

    public DbCache(ApplicationDbContext context, DatabaseConcurrentAccessSemaphore semaphore)
    {
        _context = context;
        _semaphore = semaphore;
    }

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
                return JsonSerializer.Deserialize<T>(entry.Value, jsonOptions) ??
                       throw new InvalidOperationException("Deserialization failed");
            }

            // Create new value
            var value = await factory();
            var json = JsonSerializer.Serialize(value, jsonOptions);
            var expiresAt = DateTime.UtcNow.Add(ttl);

            if (entry is null)
            {
                _context.Add(new CacheEntry { Key = key, Version = WellKnown.DbCache.Version, Value = json, ExpiresAt = expiresAt });
            }
            else
            {
                entry.Value = json;
                entry.ExpiresAt = expiresAt;
                _context.Update(entry);
            }

            await _context.SaveChangesAsync(cancellationToken);
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
            .Where(x => x.Version != WellKnown.DbCache.Version)
            .ExecuteDeleteAsync(cancellationToken);
    }
}