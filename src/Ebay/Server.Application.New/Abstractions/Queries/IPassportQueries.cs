using Server.Application.New.Models;

namespace Server.Application.New.Abstractions.Queries;

/// <summary>
/// Порт чтения паспортов товара.
/// </summary>
public interface IPassportQueries
{
    /// <summary>
    /// Возвращает список паспортов, привязанных к товару.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Список паспортов товара.</returns>
    Task<IReadOnlyList<Passport>> GetPassports(Guid productId, CancellationToken cancellationToken);
}
