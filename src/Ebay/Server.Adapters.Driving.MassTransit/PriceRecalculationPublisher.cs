using MassTransit;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Messages;

namespace Server.Adapters.Driving.MassTransit;

internal sealed class PriceRecalculationPublisher : IPriceRecalculationPublisher
{
    private readonly IPublishEndpoint _publishEndpoint;

    public PriceRecalculationPublisher(IPublishEndpoint publishEndpoint)
    {
        _publishEndpoint = publishEndpoint;
    }

    public async Task PublishForLotAsync(long lotId, CancellationToken cancellationToken) =>
        await _publishEndpoint.Publish(new CalculatePricesForLot(lotId), cancellationToken);

    public async Task PublishForProductAsync(Guid productId, CancellationToken cancellationToken) =>
        await _publishEndpoint.Publish(new CalculatePricesForProductRequested(productId), cancellationToken);

    public async Task PublishForAllAsync(CancellationToken cancellationToken) =>
        await _publishEndpoint.Publish(new CalculatePricesForAll(), cancellationToken);
}
