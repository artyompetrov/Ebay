using MassTransit;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;

namespace Server.Application.Consumers.PriceCalculator;

public class CalculatePricesForAllConsumer : IConsumer<CalculatePricesForAll>
{
    private readonly ApplicationDbContext _applicationContext;
    private readonly IPublishEndpoint _publishEndpoint;

    public CalculatePricesForAllConsumer(
        ApplicationDbContext applicationContext,
        IPublishEndpoint publishEndpoint)
    {
        _applicationContext = applicationContext;
        _publishEndpoint = publishEndpoint;
    }

    public async Task Consume(ConsumeContext<CalculatePricesForAll> context)
    {
        var productIds = await _applicationContext.Products.AsNoTracking().Select(x => x.Id)
            .ToListAsync(context.CancellationToken);

        foreach (var productId in productIds)
        {
            await _publishEndpoint.Publish(message: new CalculatePricesForProduct(productId), context.CancellationToken);
        }
    }
}

public record CalculatePricesForAll;