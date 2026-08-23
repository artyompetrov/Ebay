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