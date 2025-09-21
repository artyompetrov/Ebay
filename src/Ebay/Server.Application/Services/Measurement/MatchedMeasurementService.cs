using MassTransit;
using Server.Application.Consumers.MatchedPairs;
using Server.Application.Data;
using Server.Application.Data.Models;

namespace Server.Application.Services.Measurement;

public class MatchedMeasurementService
{
    private readonly MeasurementService _measurementService;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ApplicationDbContext _applicationContext;

    public MatchedMeasurementService(
        MeasurementService measurementService,
        IPublishEndpoint publishEndpoint,
        ApplicationDbContext applicationContext
    )
    {
        _measurementService = measurementService;
        _publishEndpoint = publishEndpoint;
        _applicationContext = applicationContext;
    }

    public async Task FindMatchedMeasurementsAsync(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken)
    {
        var measurementIds = await _measurementService.GetMeasurementIds(
            productId: productId,
            measurementStates: measurementStates,
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
                    
                    await _applicationContext.SaveChangesAsync(cancellationToken);
                }
            }
        }
    }
}