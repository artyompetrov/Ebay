using Server.Application.Abstractions.Driving.Abstractions.Messages;

namespace Server.Application.Abstractions.Driving.Abstractions.Services;

/// <summary>
/// Обрабатывает событие просмотра замера на eBay.
/// </summary>
public interface IMeasurementWatchedOnEbayHandler
{
    /// <summary>
    /// Обрабатывает событие просмотра замера на eBay.
    /// </summary>
    /// <param name="message">Событие просмотра замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task HandleAsync(MeasurementWatchedOnEbay message, CancellationToken cancellationToken);
}