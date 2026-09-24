namespace Server.Application.Abstractions.Driving.Abstractions.Services;

/// <summary>
/// Пересчитывает агрегированные метрики товара на основании результатов расчета его лотов.
/// </summary>
public interface IProductMetricsCalculator
{
    /// <summary>
    /// Пересчитывает и сохраняет метрики товара.
    /// </summary>
    /// <param name="productId">Идентификатор товара.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task CalculateAsync(Guid productId, CancellationToken cancellationToken);
}
