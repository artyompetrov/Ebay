using MassTransit;
using Server.Application.Abstractions.Driving.Abstractions.Messages;
using Server.Application.Abstractions.Driving.Abstractions.Services;

namespace Server.Adapters.Driving.MassTransit.Consumers.PriceCalculator;

public class CalculateMetricsForProductConsumer : IConsumer<Batch<CalculateMetricsForProduct>>
{
    private readonly IProductMetricsCalculator _productMetricsCalculator;

    public CalculateMetricsForProductConsumer(IProductMetricsCalculator productMetricsCalculator)
    {
        _productMetricsCalculator = productMetricsCalculator;
    }

    public async Task Consume(ConsumeContext<Batch<CalculateMetricsForProduct>> context)
    {
        var productIds = context.Message.Select(x => x.Message.ProductId).ToHashSet();

        foreach (var productId in productIds)
        {
            await _productMetricsCalculator.CalculateAsync(productId, context.CancellationToken);
        }
    }
}
