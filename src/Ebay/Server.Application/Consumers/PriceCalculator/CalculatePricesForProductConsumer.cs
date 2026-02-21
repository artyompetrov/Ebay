using MassTransit;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;
using Server.Domain;
using Server.Domain.Product;

namespace Server.Application.Consumers.PriceCalculator;

internal class CalculatePricesForProductConsumer : IConsumer<ProductUpdated>
{
    public CalculatePricesForProductConsumer(
        ApplicationDbContext applicationContext,
        IPublishEndpoint publishEndpoint)
    {
        _applicationContext = applicationContext;
        _publishEndpoint = publishEndpoint;
    }

    private readonly ApplicationDbContext _applicationContext;
    private readonly IPublishEndpoint _publishEndpoint;

    public async Task Consume(ConsumeContext<ProductUpdated> context)
    {
        var lotIds = await _applicationContext.Lots.AsNoTracking()
            .Where(x => x.ProductId == context.Message.ProductId).Select(x => x.Id)
            .ToListAsync(context.CancellationToken);

        foreach (var lotId in lotIds)
        {
            await _publishEndpoint.Publish(new CalculatePricesForLot(lotId), context.CancellationToken);
        }

        _ = await _applicationContext.SaveChangesAsync(context.CancellationToken);
    }
}
