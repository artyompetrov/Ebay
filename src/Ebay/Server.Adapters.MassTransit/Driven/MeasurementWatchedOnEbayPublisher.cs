using Server.Adapters.Driven.EF.WriteModel;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Messages;

namespace Server.Adapters.MassTransit.Driven;

internal sealed class MeasurementWatchedOnEbayPublisher : IMeasurementWatchedOnEbayPublisher
{
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;

    public MeasurementWatchedOnEbayPublisher(IWriteModelUnitOfWorkFactory unitOfWorkFactory)
    {
        _unitOfWorkFactory = unitOfWorkFactory;
    }

    public async Task PublishAsync(string measurementId, DateTimeOffset watchedAtUtc, CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        await WriteModelOutbox.GetPublishEndpoint(unitOfWork)
            .Publish(new MeasurementWatchedOnEbay(measurementId, watchedAtUtc), cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
