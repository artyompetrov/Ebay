using System.Collections.Concurrent;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;

namespace Server.Application.New.Caching;

/// <summary>
/// Реестр per-measurement токенов инвалидации общего <see cref="Microsoft.Extensions.Caching.Memory.IMemoryCache"/>
/// (см. <see cref="MemoryCacheExtensions"/>). Ключи кешируемых значений (фото/миниатюры замера, графики для eBay)
/// не привязаны напрямую к measurementId — этот реестр позволяет разом протухнуть все записи одного измерения,
/// не зная заранее их конкретных ключей.
/// </summary>
public sealed class MeasurementCacheInvalidationRegistry
{
    private readonly ConcurrentDictionary<string, CancellationTokenSource> _tokenSources = new();

    /// <summary>
    /// Возвращает токен инвалидации для измерения, создавая его при первом обращении.
    /// Подходит для регистрации как <see cref="ICacheEntry.ExpirationTokens"/>.
    /// </summary>
    /// <param name="measurementId">Идентификатор измерения.</param>
    public CancellationChangeToken GetToken(string measurementId)
    {
        var tokenSource = _tokenSources.GetOrAdd(measurementId, static _ => new CancellationTokenSource());
        return new CancellationChangeToken(tokenSource.Token);
    }

    /// <summary>
    /// Протухивает все кешированные записи, зарегистрированные под токеном этого измерения.
    /// Следующий вызов <see cref="GetToken"/> для того же измерения вернет новый, не отмененный токен.
    /// </summary>
    /// <param name="measurementId">Идентификатор измерения.</param>
    public void Invalidate(string measurementId)
    {
        if (_tokenSources.TryRemove(measurementId, out var tokenSource))
        {
            tokenSource.Cancel();
            tokenSource.Dispose();
        }
    }
}
