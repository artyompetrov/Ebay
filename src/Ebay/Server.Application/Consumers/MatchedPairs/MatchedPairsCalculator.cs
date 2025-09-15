using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Services.Measurement;

namespace Server.Application.Consumers.MatchedPairs;

public class MatchedPairsCalculator : IConsumer<CalculateMatchedPair>
{
    private readonly ILogger<MatchedPairsCalculator> _logger;
    private readonly MeasurementService _measurementService;

    public MatchedPairsCalculator(
        ILogger<MatchedPairsCalculator> logger,
        MeasurementService measurementService
        )
    {
        _logger = logger;
        _measurementService = measurementService;
    }

    public async Task Consume(ConsumeContext<CalculateMatchedPair> context)
    {
        _logger.LogInformation(
            "{MeasurementId1} {MeasurementId2}",
            context.Message.MeasurementId1,
            context.Message.MeasurementId2);

        var measurementId1 = await _measurementService.GetMeasurement(
            context.CancellationToken,
            context.Message.MeasurementId1);

        var measurementId2 = await _measurementService.GetMeasurement(
            context.CancellationToken,
            context.Message.MeasurementId2);

        if (measurementId1 == null || measurementId2 == null)
        {
            return;
        }
    }
}

public record CalculateMatchedPair(string MeasurementId1, string MeasurementId2);