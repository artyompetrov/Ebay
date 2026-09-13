using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driving.Abstractions.Services;

/// <summary>
/// Обрабатывает событие изменения идентификатора matched pair замера.
/// </summary>
public interface IMeasurementMatchIdChangedHandler
{
    /// <summary>
    /// Обрабатывает событие изменения идентификатора matched pair замера.
    /// </summary>
    /// <param name="message">Событие изменения matched pair замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task HandleAsync(MeasurementMatchIdChanged message, CancellationToken cancellationToken);
}
