using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Application.DbCache;

/// <summary>
/// Сценарий очистки персистентного кеша от записей устаревших версий.
/// </summary>
public class DbCacheCleanupService
{
    private readonly ICacheStore _cacheStore;

    /// <summary>
    /// Создает сервис очистки персистентного кеша.
    /// </summary>
    public DbCacheCleanupService(ICacheStore cacheStore)
    {
        _cacheStore = cacheStore;
    }

    /// <summary>
    /// Удаляет записи кеша, относящиеся к устаревшим версиям.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    public Task RemoveOldVersionsAsync(CancellationToken cancellationToken) =>
        _cacheStore.RemoveOldVersionsAsync(cancellationToken);
}
