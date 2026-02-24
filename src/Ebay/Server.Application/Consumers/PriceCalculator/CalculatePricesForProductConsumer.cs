using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Data;
using Server.Domain.Product;

namespace Server.Application.Consumers.PriceCalculator;

public class CalculatePricesForProductConsumer : IConsumer<CalculatePricesForProductRequested>, IConsumer<ProductUpdated>
{
    public CalculatePricesForProductConsumer(
        ApplicationDbContext applicationContext,
        IPublishEndpoint publishEndpoint,
        ILogger<CalculatePricesForProductConsumer> logger)
    {
        _applicationContext = applicationContext;
        _publishEndpoint = publishEndpoint;
        _logger = logger;
    }

    private readonly ApplicationDbContext _applicationContext;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ILogger<CalculatePricesForProductConsumer> _logger;

    public Task Consume(ConsumeContext<CalculatePricesForProductRequested> context) =>
        CalculatePricesForProductAsync(context.Message.ProductId, context.CancellationToken);

    public Task Consume(ConsumeContext<ProductUpdated> context) =>
        CalculatePricesForProductAsync(context.Message.ProductId, context.CancellationToken);

    private async Task CalculatePricesForProductAsync(Guid productId, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling updated product command: {ProductId}", productId);

        var lotIds = await _applicationContext.Lots.AsNoTracking()
            .Where(x => x.ProductId == productId)
            .Select(x => x.Id)
            .ToListAsync(cancellationToken);

        foreach (var lotId in lotIds)
        {
            await _publishEndpoint.Publish(new CalculatePricesForLot(lotId), cancellationToken);
        }

        await _applicationContext.SaveChangesAsync(cancellationToken);
    }
}