using System.Collections.Concurrent;
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
    private readonly ConcurrentDictionary<string, TokenSourceEntry> _tokenSources = new();

    /// <summary>
    /// Захватывает lease токена инвалидации для измерения, создавая его при первом обращении.
    /// Lease должен быть освобожден при протухании связанной записи кеша.
    /// </summary>
    /// <param name="measurementId">Идентификатор измерения.</param>
    public MeasurementCacheInvalidationLease AcquireToken(string measurementId)
    {
        while (true)
        {
            var entry = _tokenSources.GetOrAdd(measurementId, static _ => new TokenSourceEntry());
            if (entry.TryAcquire())
            {
                return new MeasurementCacheInvalidationLease(
                    changeToken: new CancellationChangeToken(entry.Token),
                    release: () => Release(measurementId, entry));
            }
        }
    }

    /// <summary>
    /// Протухивает все кешированные записи, зарегистрированные под токеном этого измерения.
    /// Следующий вызов <see cref="AcquireToken"/> для того же измерения вернет новый, не отмененный токен.
    /// </summary>
    /// <param name="measurementId">Идентификатор измерения.</param>
    public void Invalidate(string measurementId)
    {
        if (_tokenSources.TryRemove(measurementId, out var entry))
        {
            entry.Invalidate();
        }
    }

    /// <summary>
    /// Возвращает количество активных поколений токенов. Предназначено для диагностики и unit-тестов.
    /// </summary>
    public int ActiveTokenSourceCount => _tokenSources.Count;

    private void Release(string measurementId, TokenSourceEntry entry)
    {
        switch (entry.Release())
        {
            case TokenSourceReleaseResult.None:
                return;
            case TokenSourceReleaseResult.RemoveFromRegistry:
                if (_tokenSources.TryRemove(new KeyValuePair<string, TokenSourceEntry>(measurementId, entry)))
                {
                    entry.Dispose();
                    return;
                }
                return;
            case TokenSourceReleaseResult.DisposeOnly:
                entry.Dispose();
                return;
            default:
                throw new InvalidOperationException("Unknown token source release result.");
        }
    }

    private enum TokenSourceReleaseResult
    {
        None,
        RemoveFromRegistry,
        DisposeOnly
    }

    private sealed class TokenSourceEntry : IDisposable
    {
        private readonly Lock _lock = new();
        private readonly CancellationTokenSource _tokenSource = new();
        private int _leaseCount;
        private bool _invalidated;
        private bool _retiring;
        private bool _disposed;

        public CancellationToken Token => _tokenSource.Token;

        public bool TryAcquire()
        {
            lock (_lock)
            {
                if (_invalidated || _retiring || _disposed)
                {
                    return false;
                }

                _leaseCount++;
                return true;
            }
        }

        public void Invalidate()
        {
            var shouldDispose = false;

            lock (_lock)
            {
                if (_invalidated)
                {
                    return;
                }

                _invalidated = true;
                _tokenSource.Cancel();
                shouldDispose = _leaseCount == 0;
            }

            if (shouldDispose)
            {
                Dispose();
            }
        }

        public TokenSourceReleaseResult Release()
        {
            lock (_lock)
            {
                if (_leaseCount > 0)
                {
                    _leaseCount--;
                }

                if (_leaseCount != 0)
                {
                    return TokenSourceReleaseResult.None;
                }

                if (_invalidated)
                {
                    return TokenSourceReleaseResult.DisposeOnly;
                }

                _retiring = true;
                return TokenSourceReleaseResult.RemoveFromRegistry;
            }
        }

        public void Dispose()
        {
            lock (_lock)
            {
                if (_disposed)
                {
                    return;
                }

                _disposed = true;
                _tokenSource.Dispose();
            }
        }
    }
}
