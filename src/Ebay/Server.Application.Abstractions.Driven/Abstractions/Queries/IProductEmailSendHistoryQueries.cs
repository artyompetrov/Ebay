using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

/// <summary>
/// Порт чтения истории отправки писем по объявлениям о продаже.
/// </summary>
public interface IProductEmailSendHistoryQueries
{
    /// <summary>
    /// Ищет идентификатор существующей записи истории для товара, продавца и площадки.
    /// </summary>
    Task<Guid?> FindIdAsync(Guid productId, string seller, string marketplace, CancellationToken cancellationToken);

    /// <summary>
    /// Возвращает историю отправки писем для товара, отсортированную по дате объявления по убыванию.
    /// </summary>
    Task<IReadOnlyList<ProductEmailSendHistoryDetails>> GetForProductAsync(Guid productId, CancellationToken cancellationToken);
}
