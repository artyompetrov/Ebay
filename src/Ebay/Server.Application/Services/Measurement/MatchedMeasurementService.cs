using Server.Application.Data.Models;

namespace Server.Application.Services.Measurement;

public class MatchedMeasurementService
{
    private readonly MeasurementService _measurementService;

    public MatchedMeasurementService(MeasurementService measurementService)
    {
        _measurementService = measurementService;
    }

    public async Task FindMatchedMeasurementsAsync(
        Guid productId,
        int matchCount,
        IReadOnlyCollection<MeasurementState> measurementStates,
        bool includeMeasurementsWithMatchId,
        CancellationToken cancellationToken)
    {
        var measurementIds = await _measurementService.GetMeasurementIds(
            productId: productId,
            measurementStates: measurementStates,
            includeMeasurementsWithMatchId: includeMeasurementsWithMatchId,
            cancellationToken: cancellationToken);

        var measurements = new List<MeasurementData>(measurementIds.Count);
        foreach (var id in measurementIds)
        {
            var measurement = await _measurementService.GetMeasurements(
                cancellationToken: cancellationToken,
                measurementId: id);

            if (measurement != null)
            {
                measurements.Add(measurement);
            }
        }

        // TODO: Implement matching algorithm in subsequent tasks using
        // `matchCount` and loaded `measurements`.
    }
}

