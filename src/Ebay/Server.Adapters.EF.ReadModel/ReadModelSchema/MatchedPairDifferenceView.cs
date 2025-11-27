using System.Linq.Expressions;
using Server.Domain.Measurements;

namespace Sever.Adapters.EF.ReadModel.ReadModelSchema;

internal sealed class MatchedPairDifferenceView : IViewProjection<MatchedPairDifference, MatchedPairDifferenceView>
{
    public ComparisonMode ComparisonMode { get; set; }

    public required string Measurement1Id { get; set; }
    public ProductMeasurementView Measurement1 { get; set; } = null!;

    public required string Measurement2Id { get; set; }
    public ProductMeasurementView Measurement2 { get; set; } = null!;

    public double MseSection1 { get; set; }
    public double? MseSection2 { get; set; }

    public double RmseSection1 { get; set; }
    public double? RmseSection2 { get; set; }

    public double MaxAbsSection1 { get; set; }
    public double? MaxAbsSection2 { get; set; }

    public static Expression<Func<MatchedPairDifference, MatchedPairDifferenceView>> ToView => x =>
        new()
        {
            ComparisonMode = x.ComparisonMode,
            Measurement1Id = x.Measurement1Id,
            Measurement2Id = x.Measurement2Id,
            MseSection1 = x.MseSection1,
            MseSection2 = x.MseSection2,
            RmseSection1 = x.RmseSection1,
            RmseSection2 = x.RmseSection2,
            MaxAbsSection1 = x.MaxAbsSection1,
            MaxAbsSection2 = x.MaxAbsSection2
        };
}
