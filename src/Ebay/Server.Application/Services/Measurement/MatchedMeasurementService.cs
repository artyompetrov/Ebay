using MassTransit;
using Server.Application.Consumers.MatchedPairs;
using Server.Application.Data.Models;

namespace Server.Application.Services.Measurement;

public class MatchedMeasurementService
{
    private readonly MeasurementService _measurementService;
    private readonly IPublishEndpoint _publishEndpoint;

    public MatchedMeasurementService(
        MeasurementService measurementService,
        IPublishEndpoint publishEndpoint
    )
    {
        _measurementService = measurementService;
        _publishEndpoint = publishEndpoint;
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

        foreach (var measurementId1 in measurementIds)
        {
            foreach (var measurementId2 in measurementIds)
            {
                if (measurementId1 != measurementId2)
                {
                    await _publishEndpoint.Publish(
                        message: new CalculateMatchedPair(
                            MeasurementId1: measurementId1,
                            MeasurementId2: measurementId2),
                        cancellationToken: cancellationToken);
                }
            }
        }
    }
}