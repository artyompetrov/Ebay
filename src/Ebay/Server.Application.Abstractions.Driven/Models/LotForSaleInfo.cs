using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Лот для продажи.
/// </summary>
/// <param name="Id">Идентификатор лота.</param>
/// <param name="Name">Название лота.</param>
/// <param name="ProductId">Идентификатор связанного продукта.</param>
/// <param name="ProductState">Состояние товара для лота.</param>
/// <param name="MeasurementState">Статус замера для лота.</param>
/// <param name="AvailableQuantity">
/// Количество единиц в наличии: среди непроданных замеров лота набор (общий MatchId) считается одной единицей,
/// замер без MatchId — одной единицей.
/// </param>
public sealed record LotForSaleInfo(
    string Id,
    string Name,
    Guid ProductId,
    ProductState ProductState,
    MeasurementState MeasurementState,
    int AvailableQuantity);
