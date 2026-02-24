using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driven.Models;


/// <summary>
/// DTO для отображения замера и найденных похожих вариантов.
/// </summary>
/// <param name="MeasurementInfo">Основная информация по исходному замеру.</param>
/// <param name="DoubleTriodeSectionRmse">Разница секций (RMSE) для двойного триода, если применимо.</param>
/// <param name="SimilarMeasurements">Список похожих замеров.</param>
/// <param name="ScorePlusBalance">Итоговый скор для сортировки похожих замеров.</param>
public record MeasurementInfoWithSimilarMeasurements(
    MeasurementInfo MeasurementInfo,
    double? DoubleTriodeSectionRmse,
    IReadOnlyCollection<SimilarMeasurementInfo> SimilarMeasurements,
    double? ScorePlusBalance
);

/// <summary>
/// Информация о замере, похожем на исходный, и метрики их сравнения.
/// </summary>
/// <param name="MeasurementId">Идентификатор похожего замера.</param>
/// <param name="ManufactureCode">Код производителя похожего замера.</param>
/// <param name="RmseSection1">RMSE первой секции.</param>
/// <param name="RmseSection2">RMSE второй секции, если есть.</param>
/// <param name="ComparisonMode">Режим сравнения замеров.</param>
/// <param name="Score">Итоговый скор похожести (меньше лучше).</param>
/// <param name="IsMatchedPair">Признак, что замеры уже находятся в паре.</param>
/// <param name="DoubleTriodeSectionRmse">Разница секций для похожего замера, если применимо.</param>
/// <param name="MatchId">Идентификатор пары похожего замера.</param>
public record SimilarMeasurementInfo(
    string MeasurementId,
    string ManufactureCode,
    double RmseSection1,
    double? RmseSection2,
    ComparisonMode ComparisonMode,
    double Score,
    bool IsMatchedPair,
    double? DoubleTriodeSectionRmse,
    string? MatchId);