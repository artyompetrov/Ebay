using MassTransit;
using Server.Application.Abstractions.Driven.Abstractions.Queries;

namespace Server.Application.Consumers.PriceCalculator;

public sealed class CalculateUnpublishedOnEbayCountForAllConsumer : IConsumer<CalculateUnpublishedOnEbayCountForAll>
{
    private readonly IProductQueries _productQueries;
    private readonly IPublishEndpoint _publishEndpoint;

    public CalculateUnpublishedOnEbayCountForAllConsumer(IProductQueries productQueries, IPublishEndpoint publishEndpoint)
    {
        _productQueries = productQueries;
        _publishEndpoint = publishEndpoint;
    }

    public async Task Consume(ConsumeContext<CalculateUnpublishedOnEbayCountForAll> context)
    {
        var productIds = await _productQueries.GetAllProductsIdsAsync(context.CancellationToken);

        foreach (var productId in productIds)
        {
            await _publishEndpoint.Publish(new CalculateTotalAveragePriceForProduct(productId), context.CancellationToken);
        }
    }
}

public record CalculateUnpublishedOnEbayCountForAll;
