using Server.Domain;

namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата истории отправки писем по объявлениям о продаже.
/// </summary>
public interface IProductEmailSendHistoryRepository : IRepository<ProductEmailSendHistory, Guid>
{
    /// <summary>
    /// Ищет запись истории по ключу дедупликации: товар, ключ продавца и маркетплейс.
    /// </summary>
    Task<ProductEmailSendHistory?> FindAsync(
        IWriteModelUnitOfWork unitOfWork,
        Guid productId,
        string sellerKey,
        string marketplace,
        CancellationToken cancellationToken);

    /// <summary>
    /// Удаляет записи об отправке писем, устаревшие к указанному моменту времени.
    /// </summary>
    Task RemoveOlderThanAsync(IWriteModelUnitOfWork unitOfWork, DateTimeOffset threshold, CancellationToken cancellationToken);
}
