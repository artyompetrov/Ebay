using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

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