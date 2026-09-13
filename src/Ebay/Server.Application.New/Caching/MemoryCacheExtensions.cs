using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;

namespace Server.Application.New.Caching;

/// <summary>
/// Общая политика заполнения общего <see cref="IMemoryCache"/> для неизменяемых после первого
/// вычисления значений (байты фото/миниатюр, отрендеренные графики): скользящее время жизни записи
/// и явный размер записи, без которого лимит общего размера кеша не работает.
/// </summary>
public static class MemoryCacheExtensions
{
    private static readonly TimeSpan CacheEntrySlidingExpiration = TimeSpan.FromHours(24);
    private static readonly TimeSpan CacheEntryAbsoluteExpiration = TimeSpan.FromHours(24);

    /// <summary>
    /// Возвращает значение из кеша либо вычисляет его через <paramref name="factory"/>, кеширует
    /// и возвращает. Кеш не используется, если <paramref name="factory"/> возвращает
    /// <see langword="null"/>.
    /// </summary>
    /// <param name="cache">Общий in-memory кеш.</param>
    /// <param name="key">Ключ кеша.</param>
    /// <param name="factory">Вычисление значения при отсутствии его в кеше.</param>
    /// <param name="sizeSelector">Размер значения в байтах для учёта в общем лимите размера кеша.</param>
    /// <param name="invalidationTokenFactory">
    /// Дополнительный триггер немедленного протухания записи (например, от
    /// <see cref="MeasurementCacheInvalidationRegistry"/>), в дополнение к скользящему времени жизни.
    /// </param>
    public static async Task<T?> GetOrCreateAsync<T>(
        this IMemoryCache cache,
        string key,
        Func<Task<T?>> factory,
        Func<T, long> sizeSelector,
        Func<MeasurementCacheInvalidationLease>? invalidationTokenFactory = null)
        where T : class
    {
        if (cache.TryGetValue(key, out T? cached))
        {
            return cached;
        }

        var value = await factory();
        if (value is null)
        {
            return null;
        }

        using var entry = cache.CreateEntry(key);
        var invalidationToken = invalidationTokenFactory?.Invoke();
        entry.Value = value;
        entry.SlidingExpiration = CacheEntrySlidingExpiration;
        entry.AbsoluteExpirationRelativeToNow = CacheEntryAbsoluteExpiration;
        entry.Size = sizeSelector(value);
        if (invalidationToken is not null)
        {
            entry.ExpirationTokens.Add(invalidationToken.ChangeToken);
            entry.PostEvictionCallbacks.Add(new PostEvictionCallbackRegistration
            {
                State = invalidationToken,
                EvictionCallback = static (_, _, _, state) => ((MeasurementCacheInvalidationLease)state!).Dispose()
            });
        }

        return value;
    }
}
