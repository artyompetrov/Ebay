using System;
using System.Linq;
using MassTransit;
using Server.Application.Consumers.MatchedPairs;
using Server.Application.Data;
using Server.Application.Data.Models;
using Server.Application.Data.Models.Measurements;
using Server.Application.Infrastructure;

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
        CancellationToken cancellationToken)
    {
        var measurementStates = Enum
            .GetValues<MeasurementState>()
            .Where(state => state != MeasurementState.Sold)
            .ToArray();

        var measurementIds = (await _measurementService.GetMeasurementIds(
            productId: productId,
            measurementStates: measurementStates,
            cancellationToken: cancellationToken)).ToHashSet();

        _applicationContext.MatchedPairDifferences.RemoveRange(
            _applicationContext.MatchedPairDifferences.Where(x => measurementIds.Contains(x.MeasurementId1)));
        
        foreach (var measurementId1 in measurementIds)
        {
            foreach (var measurementId2 in measurementIds)
            {
                await _publishEndpoint.Publish(
                    message: new CalculateMatchedPair(
                        MeasurementId1: measurementId1,
                        MeasurementId2: measurementId2),
                    cancellationToken: cancellationToken);
            }
            
            await _applicationContext.SaveChangesAsync(cancellationToken);
        }
        

    }
}