using MassTransit;
using Server.Application.Abstractions.Queries;

namespace Server.Application.Consumers.PriceCalculator;

internal class CalculatePricesForAllConsumer(
    IProductQueries productQueries,
    IPublishEndpoint publishEndpoint) : IConsumer<CalculatePricesForAll>
{
    private readonly IProductQueries _productQueries = productQueries;
    private readonly IPublishEndpoint _publishEndpoint = publishEndpoint;

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
