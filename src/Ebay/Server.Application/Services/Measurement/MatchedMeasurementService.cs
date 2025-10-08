using System.Text;
using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Measurements;
using Server.Application.Consumers.MatchedPairs;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Application.Services.Measurement;

internal class MatchedMeasurementService
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly ApplicationDbContext _applicationContext;
    private readonly ILogger<MatchedMeasurementService> _logger;

    public MatchedMeasurementService(
        IPublishEndpoint publishEndpoint,
        IMeasurementQueries  measurementQueries,
        ApplicationDbContext applicationContext,
        ILogger<MatchedMeasurementService> logger)
    {
        _publishEndpoint = publishEndpoint;
        _measurementQueries = measurementQueries;
        _applicationContext = applicationContext;
        _logger = logger;
    }

    public async Task FindMatchedMeasurementsAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        var measurementStates = Enum
            .GetValues<MeasurementState>()
            .Where(state => state != MeasurementState.Sold)
            .ToArray();

        var measurementIds = (await _measurementQueries.GetMeasurementIds(
            productId: productId,
            measurementStates: measurementStates,
            cancellationToken: cancellationToken)).ToHashSet();

        _applicationContext.MatchedPairDifferences.RemoveRange(
            _applicationContext.MatchedPairDifferences.Where(x => measurementIds.Contains(x.MeasurementId1)));

        foreach (var measurementId1 in measurementIds)
        {
            var sb = new StringBuilder();
            foreach (var measurementId2 in measurementIds)
            {
                var message = new CalculateMatchedPair(
                    MeasurementId1: measurementId1,
                    MeasurementId2: measurementId2);
                
                await _publishEndpoint.Publish(
                    message: message,
                    cancellationToken: cancellationToken);

                sb.AppendLine(message.ToString());
            }
            _logger.LogDebug("Publishing {messageType}, {messageIds}", nameof(CalculateMatchedPair),  sb.ToString());
            await _applicationContext.SaveChangesAsync(cancellationToken);
        }
    }
}