using MassTransit;
using Microsoft.EntityFrameworkCore;
using Server.Data;

namespace Server.Consumers;

internal class ProductChangedConsumer : IConsumer<ProductChanged>
{
    private readonly ApplicationDbContext _applicationContext;
    private readonly IPublishEndpoint _publishEndpoint;

    public ProductChangedConsumer(
        ApplicationDbContext applicationContext,
        IPublishEndpoint publishEndpoint)
    {
        _applicationContext = applicationContext;
        _publishEndpoint = publishEndpoint;
    }

    public async Task Consume(ConsumeContext<ProductChanged> context)
    {
        var lotIds = await _applicationContext.Lots.AsNoTracking().Where(x => x.ProductId == context.Message.ProductId).Select(x=>x.Id)
            .ToListAsync(context.CancellationToken);

        foreach (var lotId in lotIds)
        {
            await _publishEndpoint.Publish(new LotChanged(lotId), context.CancellationToken);
        }
    }
}

public record ProductChanged(Guid ProductId);
