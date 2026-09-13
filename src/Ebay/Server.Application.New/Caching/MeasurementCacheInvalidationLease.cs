using Microsoft.Extensions.Primitives;

namespace Server.Application.New.Caching;

/// <summary>
/// Lease токена инвалидации записи image-cache.
/// </summary>
public sealed class MeasurementCacheInvalidationLease : IDisposable
{
    private readonly Action _release;
    private bool _disposed;

    internal MeasurementCacheInvalidationLease(
        IChangeToken changeToken,
        Action release)
    {
        ChangeToken = changeToken;
        _release = release;
    }

    /// <summary>
    /// Токен протухания кеш-записи.
    /// </summary>
    public IChangeToken ChangeToken { get; }

    /// <inheritdoc />
    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        _disposed = true;
        _release();
    }
}
