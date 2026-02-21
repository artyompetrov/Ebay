using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driven.Models;


/// <summary>
/// Краткая информация о замере товара для отображения в интерфейсе.
/// </summary>
/// <param name="Id">Идентификатор замера.</param>
/// <param name="ProductId">Идентификатор товара, к которому относится замер.</param>
/// <param name="MatchId">Идентификатор пары замеров.</param>
/// <param name="LotId">Идентификатор лота eBay.</param>
/// <param name="Location">Локация хранения товара или замера.</param>
/// <param name="MeasurementState">Текущее состояние замера.</param>
/// <param name="ProductState">Состояние товара.</param>
/// <param name="ManufactureCode">Код производителя лампы.</param>
/// <param name="CreatedAt">Дата и время создания замера.</param>
/// <param name="LastTimeWatchedOnEbay">Дата и время последнего обнаружения на eBay.</param>
public record MeasurementInfo(
    string Id,
    Guid ProductId,
    string? MatchId,
    string? LotId,
    string? Location,
    MeasurementState MeasurementState,
    ProductState ProductState,
    string ManufactureCode,
    DateTime CreatedAt,
    DateTime? LastTimeWatchedOnEbay)
{
    /// <summary>
    /// Признак, что замер был замечен на eBay в течение последних 7 дней.
    /// </summary>
    public bool IsPublishedOnEbay => LastTimeWatchedOnEbay > DateTime.UtcNow.AddDays(-7);
}
