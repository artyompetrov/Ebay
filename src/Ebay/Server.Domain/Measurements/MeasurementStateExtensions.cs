namespace Server.Domain.Measurements;

public static class MeasurementStateExtensions
{
    public static bool IsHiddenFromPublicListing(this MeasurementState state) => state == MeasurementState.Sold;
}