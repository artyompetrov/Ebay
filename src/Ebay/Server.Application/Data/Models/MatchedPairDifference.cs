namespace Server.Application.Data.Models;

public class MatchedPairDifference
{
    public required string MeasurementId1 { get; set; }

    public required string MeasurementId2 { get; set; }

    public double Mse { get; set; }

    public double Rmse { get; set; }

    public double MaxAbs { get; set; }
}
