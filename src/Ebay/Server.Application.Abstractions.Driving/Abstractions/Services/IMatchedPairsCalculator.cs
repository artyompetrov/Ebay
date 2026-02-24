namespace Server.Application.Abstractions.Driving.Abstractions.Services;

/// <summary>
/// Выполняет расчет метрик совпадения пары замеров.
/// </summary>
public interface IMatchedPairsCalculator
{
    /// <summary>
    /// Рассчитывает и сохраняет метрики схожести для пары замеров.
    /// </summary>
    /// <param name="measurementId1">Идентификатор первого замера.</param>
    /// <param name="measurementId2">Идентификатор второго замера.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task CalculateAsync(string measurementId1, string measurementId2, CancellationToken cancellationToken);
}
