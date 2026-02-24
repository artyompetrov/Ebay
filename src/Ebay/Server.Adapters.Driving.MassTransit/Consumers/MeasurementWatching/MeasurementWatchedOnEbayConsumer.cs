using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driving.Abstractions.Messages;
using Server.Application.Abstractions.Driving.Abstractions.Services;

namespace Server.Adapters.Driving.MassTransit.Consumers.MeasurementWatching;

public sealed class MeasurementWatchedOnEbayConsumer : IConsumer<MeasurementWatchedOnEbay>
{
    private readonly ILogger<MeasurementWatchedOnEbayConsumer> _logger;
    private readonly IMeasurementWatchedOnEbayHandler _measurementWatchingHandler;

    public MeasurementWatchedOnEbayConsumer(
        ILogger<MeasurementWatchedOnEbayConsumer> logger,
        IMeasurementWatchedOnEbayHandler measurementWatchingHandler)
    {
        _logger = logger;
        _measurementWatchingHandler = measurementWatchingHandler;
    }

    public async Task Consume(ConsumeContext<MeasurementWatchedOnEbay> context)
    {
        _logger.LogInformation(
            "Handling {MessageType} {MeasurementId}",
            nameof(MeasurementWatchedOnEbay),
            context.Message.MeasurementId);

        await _measurementWatchingHandler.HandleAsync(context.Message, context.CancellationToken);
    }
}
