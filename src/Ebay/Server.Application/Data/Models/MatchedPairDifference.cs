using System.ComponentModel.DataAnnotations;

namespace Server.Application.Data.Models;

public class MatchedPairDifference
{
    [MaxLength(100)]
    public required string MeasurementId1 { get; set; }

    [MaxLength(100)]
    public required string MeasurementId2 { get; set; }

    public double Mse { get; set; }

    public double Rmse { get; set; }

    public double MaxAbs { get; set; }

    public ProductMeasurement Measurement1 { get; set; } = null!;

    public ProductMeasurement Measurement2 { get; set; } = null!;
}
