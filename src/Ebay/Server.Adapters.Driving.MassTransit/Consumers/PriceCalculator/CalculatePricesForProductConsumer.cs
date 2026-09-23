using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driving.Abstractions.Messages;
using Server.Domain.Product;

namespace Server.Adapters.Driving.MassTransit.Consumers.PriceCalculator;

public class CalculatePricesForProductConsumer : IConsumer<CalculatePricesForProductRequested>, IConsumer<ProductUpdated>
{
    private readonly ILotQueries _lotQueries;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ILogger<CalculatePricesForProductConsumer> _logger;

    public CalculatePricesForProductConsumer(
        ILotQueries lotQueries,
        IPublishEndpoint publishEndpoint,
        ILogger<CalculatePricesForProductConsumer> logger)
    {
        _lotQueries = lotQueries;
        _publishEndpoint = publishEndpoint;
        _logger = logger;
    }

    public Task Consume(ConsumeContext<CalculatePricesForProductRequested> context) =>
        CalculatePricesForProductAsync(context.Message.ProductId, context.CancellationToken);

    public Task Consume(ConsumeContext<ProductUpdated> context) =>
        CalculatePricesForProductAsync(context.Message.ProductId, context.CancellationToken);

    private async Task CalculatePricesForProductAsync(Guid productId, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling updated product command: {ProductId}", productId);

        var lotIds = await _lotQueries.GetLotIdsForProductAsync(productId, cancellationToken);

        foreach (var lotId in lotIds)
        {
            await _publishEndpoint.Publish(new CalculatePricesForLot(lotId), cancellationToken);
        }
    }
}
