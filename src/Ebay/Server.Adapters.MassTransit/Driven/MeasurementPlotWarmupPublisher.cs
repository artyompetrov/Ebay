using MassTransit;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Messages;

namespace Server.Adapters.MassTransit.Driven;

internal sealed class MeasurementPlotWarmupPublisher : IMeasurementPlotWarmupPublisher
{
    private readonly IPublishEndpoint _publishEndpoint;

    public MeasurementPlotWarmupPublisher(IPublishEndpoint publishEndpoint)
    {
        _publishEndpoint = publishEndpoint;
    }

    public async Task PublishAsync(string measurementId, CancellationToken cancellationToken) =>
        await _publishEndpoint.Publish(new CalculateEbayCurvesForMeasurement(measurementId), cancellationToken);
}
