using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Domain.Measurements;

namespace Server.Adapters.Driving.MassTransit.Consumers.MeasurementCaching;

public sealed class MeasurementMatchIdChangedConsumer : IConsumer<MeasurementMatchIdChanged>
{
    private readonly ILogger<MeasurementMatchIdChangedConsumer> _logger;
    private readonly IMeasurementMatchIdChangedHandler _measurementMatchIdChangedHandler;

    public MeasurementMatchIdChangedConsumer(
        ILogger<MeasurementMatchIdChangedConsumer> logger,
        IMeasurementMatchIdChangedHandler measurementMatchIdChangedHandler)
    {
        _logger = logger;
        _measurementMatchIdChangedHandler = measurementMatchIdChangedHandler;
    }

    public async Task Consume(ConsumeContext<MeasurementMatchIdChanged> context)
    {
        _logger.LogInformation(
            "Handling {MessageType} {MeasurementId}",
            nameof(MeasurementMatchIdChanged),
            context.Message.MeasurementId);

        await _measurementMatchIdChangedHandler.HandleAsync(context.Message, context.CancellationToken);
    }
}
