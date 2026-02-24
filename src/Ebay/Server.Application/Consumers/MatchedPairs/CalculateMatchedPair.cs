namespace Server.Application.Consumers.MatchedPairs;

public record CalculateMatchedPair(string MeasurementId1, string MeasurementId2)
{
    public override string ToString() => $"{MeasurementId1}-{MeasurementId2}";
}
