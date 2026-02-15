using Server.Domain.Measurements;

namespace Server.Application.New.Models;


/// <summary>
/// Dto для отображения строки в перечне замеров
/// </summary>
public record MeasurementInfoWithSimilarMeasurements(
    MeasurementInfo MeasurementInfo,
    double? DoubleTriodeSectionRmse,
    IReadOnlyCollection<SimilarMeasurementInfo> SimilarMeasurements,
    double? ScorePlusBalance
);

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
