using System.ComponentModel.DataAnnotations;
using Server.Domain.Measurements;

namespace Sever.Adapters.EF.ReadModel.ReadModelSchema;

public class MatchedPairDifference
{
    public ComparisonMode ComparisonMode { get; set; }
    
    public required string MeasurementId1 { get; set; }
    public required ProductMeasurementView Measurement1 { get; set; }
    
    public required string MeasurementId2 { get; set; }
    public required ProductMeasurementView Measurement2 { get; set; }
    
    public double MseSection1 { get; set; }
    public double? MseSection2 { get; set; }
    
    public double RmseSection1 { get; set; }
    public double? RmseSection2 { get; set; }
    
    public double MaxAbsSection1 { get; set; }
    public double? MaxAbsSection2 { get; set; }
}