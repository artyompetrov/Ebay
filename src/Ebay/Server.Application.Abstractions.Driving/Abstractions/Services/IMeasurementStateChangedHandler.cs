using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driving.Abstractions.Services;

/// <summary>
/// Обрабатывает событие изменения статуса замера.
/// </summary>
public interface IMeasurementStateChangedHandler
{
    /// <summary>
    /// Обрабатывает событие изменения статуса замера.
    /// </summary>
    /// <param name="message">Событие изменения статуса замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task HandleAsync(MeasurementStateChanged message, CancellationToken cancellationToken);
}
