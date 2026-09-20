namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт уведомления о просмотре замера на eBay. Обработка (обновление агрегата) выполняется асинхронно
/// отдельным обработчиком, чтобы не блокировать горячий путь рендеринга графика записью в БД.
/// </summary>
public interface IMeasurementWatchedOnEbayPublisher
{
    /// <summary>
    /// Публикует событие просмотра замера на eBay.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="watchedAtUtc">Момент просмотра в UTC.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task PublishAsync(string measurementId, DateTimeOffset watchedAtUtc, CancellationToken cancellationToken);
}
