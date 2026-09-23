using Server.Domain;

namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата истории отправки писем по объявлениям о продаже.
/// </summary>
public interface IProductEmailSendHistoryRepository : IRepository<ProductEmailSendHistory, Guid>
{
    /// <summary>
    /// Удаляет записи об отправке писем, устаревшие к указанному моменту времени.
    /// </summary>
    Task RemoveOlderThanAsync(DateTimeOffset threshold, CancellationToken cancellationToken);
}
