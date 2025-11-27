using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Queries;


/// <summary>
/// Dto для отображения строки в перечне замеров
/// </summary>
public record MeasurementInfoWithSimilarMeasurements(
    string Id,
    string ManufactureCode,
    ProductState ProductState,
    string? Location,
    string? MatchId,
    string? LotId,
    double? DoubleTriodeSectionRmse,
    MeasurementState MeasurementState)
{
    public IReadOnlyCollection<SimilarMeasurementInfo> SimilarMeasurements { get; init; } = Array.Empty<SimilarMeasurementInfo>();

    /// <summary>
    /// Параметр по которому сортируем лампы в списке
    /// </summary>
    public double? ScorePlusBalance { get; init; }
}

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
