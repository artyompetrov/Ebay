using Server.Adapters.Driven.EF.WriteModel;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Messages;

namespace Server.Adapters.MassTransit.Driven;

internal sealed class PriceRecalculationPublisher : IPriceRecalculationPublisher
{
    public async Task PublishForLotAsync(IWriteModelUnitOfWork unitOfWork, long lotId, CancellationToken cancellationToken) =>
        await WriteModelOutbox.GetPublishEndpoint(unitOfWork).Publish(new CalculatePricesForLot(lotId), cancellationToken);

    public async Task PublishForProductAsync(IWriteModelUnitOfWork unitOfWork, Guid productId, CancellationToken cancellationToken) =>
        await WriteModelOutbox.GetPublishEndpoint(unitOfWork).Publish(new CalculatePricesForProductRequested(productId), cancellationToken);

    public async Task PublishForAllAsync(IWriteModelUnitOfWork unitOfWork, CancellationToken cancellationToken) =>
        await WriteModelOutbox.GetPublishEndpoint(unitOfWork).Publish(new CalculatePricesForAll(), cancellationToken);
}
