using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.Consumers.MatchedPairs;

namespace Server.Adapters.Driving.MassTransit.Consumers.MatchedPairs;

public class MatchedPairsCalculatorConsumer : IConsumer<CalculateMatchedPair>
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

    public async Task Consume(ConsumeContext<CalculateMatchedPair> context)
    {
        _logger.LogInformation(
            "Handling {MessageType} {MeasurementId1} {MeasurementId2}",
            nameof(CalculateMatchedPair),
            context.Message.MeasurementId1,
            context.Message.MeasurementId2);

        await _matchedPairsCalculator.CalculateAsync(
            measurementId1: context.Message.MeasurementId1,
            measurementId2: context.Message.MeasurementId2,
            cancellationToken: context.CancellationToken);
    }
}