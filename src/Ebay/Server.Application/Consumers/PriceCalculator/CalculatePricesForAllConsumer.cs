using MassTransit;
using Server.Application.Abstractions.Queries;

namespace Server.Application.Consumers.PriceCalculator;

internal class CalculatePricesForAllConsumer : IConsumer<CalculatePricesForAll>
{
    private readonly IProductQueries _productQueries;
    private readonly IPublishEndpoint _publishEndpoint;

    public CalculatePricesForAllConsumer(
        IProductQueries productQueries,
        IPublishEndpoint publishEndpoint)
    {
        _productQueries = productQueries;
        _publishEndpoint = publishEndpoint;
    }

    public async Task Consume(ConsumeContext<CalculatePricesForAll> context)
    {
        var productIds = await _productQueries.GetAllProductsIdsAsync(context.CancellationToken);

        foreach (var productId in productIds)
        {
            await _publishEndpoint.Publish(message: new CalculatePricesForProduct(productId), context.CancellationToken);
        }
    }
}

public record CalculatePricesForAll;