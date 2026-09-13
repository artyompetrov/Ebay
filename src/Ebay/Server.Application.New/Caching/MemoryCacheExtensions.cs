using Microsoft.Extensions.Caching.Memory;

namespace Server.Application.New.Caching;

/// <summary>
/// Общая политика заполнения общего <see cref="IMemoryCache"/> для неизменяемых после первого
/// вычисления значений (байты фото/миниатюр, отрендеренные графики): скользящее время жизни записи
/// и явный размер записи, без которого лимит общего размера кеша не работает.
/// </summary>
public static class MemoryCacheExtensions
{
    private static readonly TimeSpan CacheEntrySlidingExpiration = TimeSpan.FromHours(6);

    /// <summary>
    /// Возвращает значение из кеша либо вычисляет его через <paramref name="factory"/>, кеширует
    /// и возвращает. Кеш не используется, если <paramref name="factory"/> возвращает
    /// <see langword="null"/>.
    /// </summary>
    /// <param name="cache">Общий in-memory кеш.</param>
    /// <param name="key">Ключ кеша.</param>
    /// <param name="factory">Вычисление значения при отсутствии его в кеше.</param>
    /// <param name="sizeSelector">Размер значения в байтах для учёта в общем лимите размера кеша.</param>
    public static async Task<T?> GetOrCreateAsync<T>(
        this IMemoryCache cache,
        string key,
        Func<Task<T?>> factory,
        Func<T, long> sizeSelector)
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
        entry.Value = value;
        entry.SlidingExpiration = CacheEntrySlidingExpiration;
        entry.Size = sizeSelector(value);

        return value;
    }
}