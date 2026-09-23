using System.Text.Json;

namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт кеша с истечением срока действия для дорогих в вычислении значений (например, рендеринга графиков).
/// </summary>
public interface ICacheStore
{
    /// <summary>
    /// Возвращает значение из кеша по ключу либо вычисляет и сохраняет его, если оно отсутствует или устарело.
    /// </summary>
    /// <param name="key">Ключ кеша.</param>
    /// <param name="factory">Фабрика для вычисления значения при отсутствии актуальной записи в кеше.</param>
    /// <param name="ttl">Время жизни записи в кеше.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <param name="jsonOptions">Настройки сериализации значения в JSON.</param>
    Task<T?> GetOrCreateAsync<T>(
        string key,
        Func<Task<T?>> factory,
        TimeSpan ttl,
        CancellationToken cancellationToken,
        JsonSerializerOptions? jsonOptions = null);

    /// <summary>
    /// Удаляет записи кеша, относящиеся к устаревшим версиям.
    /// </summary>
    Task RemoveOldVersionsAsync(CancellationToken cancellationToken);
}
