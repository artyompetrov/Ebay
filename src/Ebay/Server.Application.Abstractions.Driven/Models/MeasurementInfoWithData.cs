using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Информация о замере вместе с бинарными данными файла измерения.
/// </summary>
/// <param name="Id">Идентификатор замера.</param>
/// <param name="ProductId">Идентификатор товара, к которому относится замер.</param>
/// <param name="MatchId">Идентификатор пары замеров.</param>
/// <param name="LotId">Идентификатор лота eBay.</param>
/// <param name="Location">Локация хранения товара или замера.</param>
/// <param name="MeasurementState">Текущее состояние замера.</param>
/// <param name="ProductState">Состояние товара.</param>
/// <param name="ManufactureCode">Код производителя лампы.</param>
/// <param name="LastTimeWatchedOnEbay">Дата и время последнего обнаружения на eBay.</param>
/// <param name="CreatedAt">Дата и время создания замера.</param>
/// <param name="Data">Сырые бинарные данные файла измерений.</param>
public record MeasurementInfoWithData(
    string Id,
    Guid ProductId,
    string? MatchId,
    string? LotId,
    string? Location,
    MeasurementState MeasurementState,
    ProductState ProductState,
    string ManufactureCode,
    DateTime? LastTimeWatchedOnEbay,
    DateTime CreatedAt,
    byte[] Data) :
    MeasurementInfo(
        Id: Id,
        ProductId:
        ProductId,
        MatchId: MatchId,
        LotId: LotId,
        Location: Location,
        MeasurementState: MeasurementState,
        ProductState: ProductState,
        ManufactureCode: ManufactureCode,
        CreatedAt: CreatedAt,
        LastTimeWatchedOnEbay: LastTimeWatchedOnEbay);
