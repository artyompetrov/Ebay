namespace Server.Application.Abstractions.Driving.Abstractions.Messages;

/// <summary>
/// Запрос на пересчет цен всех лотов товара.
/// </summary>
public record CalculatePricesForProductRequested(Guid ProductId);
