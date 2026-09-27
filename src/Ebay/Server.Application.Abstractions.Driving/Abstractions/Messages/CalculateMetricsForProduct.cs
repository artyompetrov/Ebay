namespace Server.Application.Abstractions.Driving.Abstractions.Messages;

/// <summary>
/// Запрос на пересчет агрегированных метрик товара.
/// </summary>
public record CalculateMetricsForProduct(Guid ProductId);
