using Server.Domain;

namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Информация о покупке лота.
/// </summary>
/// <param name="Date">Дата покупки.</param>
/// <param name="LotId">Идентификатор лота.</param>
/// <param name="Price">Цена покупки в валюте лота.</param>
/// <param name="Quantity">Количество купленных штук.</param>
/// <param name="CalculationResult">Результат расчета покупки.</param>
public record PurchaseDetails(
    DateTimeOffset Date,
    long LotId,
    double? Price,
    int Quantity,
    PurchaseCalculationResult? CalculationResult
);
