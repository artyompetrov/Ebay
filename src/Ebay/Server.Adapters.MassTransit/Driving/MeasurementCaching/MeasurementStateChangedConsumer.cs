using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Domain.Measurements;

namespace Server.Adapters.MassTransit.Driving.MeasurementCaching;

public sealed class MeasurementStateChangedConsumer : IConsumer<MeasurementStateChanged>
{
    private readonly ILogger<MeasurementStateChangedConsumer> _logger;
    private readonly IMeasurementStateChangedHandler _measurementStateChangedHandler;

    public MeasurementStateChangedConsumer(
        ILogger<MeasurementStateChangedConsumer> logger,
        IMeasurementStateChangedHandler measurementStateChangedHandler)
    {
        _logger = logger;
        _measurementStateChangedHandler = measurementStateChangedHandler;
    }

    public async Task Consume(ConsumeContext<MeasurementStateChanged> context)
    {
        _logger.LogInformation(
            "Handling {MessageType} {MeasurementId}",
            nameof(MeasurementStateChanged),
            context.Message.MeasurementId);

        await _measurementStateChangedHandler.HandleAsync(context.Message, context.CancellationToken);
    }
}
