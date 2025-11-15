using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Data;

namespace Server.Application.Consumers.PriceCalculator
{
    internal class CalculatePricesForProductConsumer(
        ApplicationDbContext applicationContext,
        ILogger<CalculatePricesForProductConsumer> logger,
        IPublishEndpoint publishEndpoint) : IConsumer<CalculatePricesForProduct>
    {
        private readonly ApplicationDbContext _applicationContext = applicationContext;
        private readonly ILogger<CalculatePricesForProductConsumer> _logger = logger;
        private readonly IPublishEndpoint _publishEndpoint = publishEndpoint;

        public async Task Consume(ConsumeContext<CalculatePricesForProduct> context)
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

    public record CalculatePricesForProduct(Guid ProductId);
}