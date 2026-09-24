namespace Server.Application.Abstractions.Driving.Abstractions.Messages;

/// <summary>
/// Запрос на расчет цен и выручки для лота.
/// </summary>
public record CalculatePricesForLot(long LotId);
