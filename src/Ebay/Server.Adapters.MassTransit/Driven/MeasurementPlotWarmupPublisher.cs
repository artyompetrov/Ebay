using Server.Adapters.Driven.EF.WriteModel;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Messages;

namespace Server.Adapters.MassTransit.Driven;

internal sealed class MeasurementPlotWarmupPublisher : IMeasurementPlotWarmupPublisher
{
    public async Task PublishAsync(IWriteModelUnitOfWork unitOfWork, string measurementId, CancellationToken cancellationToken) =>
        await WriteModelOutbox.GetPublishEndpoint(unitOfWork).Publish(new CalculateEbayCurvesForMeasurement(measurementId), cancellationToken);
}
