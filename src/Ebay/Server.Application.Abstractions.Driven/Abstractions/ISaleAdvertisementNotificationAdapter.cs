using Server.Domain.SaleAdvertisements;

namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт доставки уведомлений о новых интересных объявлениях о продаже. Адаптер сам выбирает представление
/// уведомления и соблюдает ограничения канала доставки.
/// </summary>
public interface ISaleAdvertisementNotificationAdapter
{
    /// <summary>
    /// Отправляет уведомление получателю; при сбое доставки бросает исключение библиотеки канала.
    /// </summary>
    Task SendAsync(string targetEmail, SaleAdvertisementNotification notification, CancellationToken cancellationToken);
}
