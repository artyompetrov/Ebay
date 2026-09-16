using MassTransit;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Messages;

namespace Server.Adapters.Driving.MassTransit;

internal sealed class MeasurementWatchedOnEbayPublisher : IMeasurementWatchedOnEbayPublisher
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IWriteModelUnitOfWork _unitOfWork;

    public MeasurementWatchedOnEbayPublisher(IPublishEndpoint publishEndpoint, IWriteModelUnitOfWork unitOfWork)
    {
        _publishEndpoint = publishEndpoint;
        _unitOfWork = unitOfWork;
    }

    public async Task PublishAsync(string measurementId, DateTimeOffset watchedAtUtc, CancellationToken cancellationToken)
    {
        await _publishEndpoint.Publish(new MeasurementWatchedOnEbay(measurementId, watchedAtUtc), cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
