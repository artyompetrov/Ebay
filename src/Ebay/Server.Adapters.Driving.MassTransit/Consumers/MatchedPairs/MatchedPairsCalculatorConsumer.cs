using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Domain.Measurements;

namespace Server.Adapters.Driving.MassTransit.Consumers.MatchedPairs;

public class MatchedPairsCalculatorConsumer : IConsumer<MatchedPairComparisonRequested>
{
    private readonly ILogger<MatchedPairsCalculatorConsumer> _logger;
    private readonly IMatchedPairsCalculator _matchedPairsCalculator;

    public MatchedPairsCalculatorConsumer(
        ILogger<MatchedPairsCalculatorConsumer> logger,
        IMatchedPairsCalculator matchedPairsCalculator)
    {
        _logger = logger;
        _matchedPairsCalculator = matchedPairsCalculator;
    }

    public async Task Consume(ConsumeContext<MatchedPairComparisonRequested> context)
    {
        _logger.LogInformation(
            "Handling {MessageType} {MeasurementId1} {MeasurementId2}",
            nameof(MatchedPairComparisonRequested),
            context.Message.Measurement1Id,
            context.Message.Measurement2Id);

        await _matchedPairsCalculator.CalculateAsync(
            measurementId1: context.Message.Measurement1Id,
            measurementId2: context.Message.Measurement2Id,
            cancellationToken: context.CancellationToken);
    }
}