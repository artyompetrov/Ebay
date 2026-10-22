using MassTransit;
using Server.Application.Abstractions.Driving.Abstractions.Messages;
using Server.Application.Abstractions.Driving.Abstractions.Services;

namespace Server.Adapters.MassTransit.Driving.PriceCalculator;

public class CalculatePricesForLotConsumer : IConsumer<CalculatePricesForLot>
{
    private readonly ILotPriceCalculator _lotPriceCalculator;
    private readonly IPublishEndpoint _publishEndpoint;

    public CalculatePricesForLotConsumer(ILotPriceCalculator lotPriceCalculator, IPublishEndpoint publishEndpoint)
    {
        _lotPriceCalculator = lotPriceCalculator;
        _publishEndpoint = publishEndpoint;
    }

    public async Task Consume(ConsumeContext<CalculatePricesForLot> context)
    {
        var calculated = await _lotPriceCalculator.CalculateAsync(context.Message.LotId, context.CancellationToken);

        // A lot that is gone or can't be priced (the calculator logs why) leaves the product metrics unchanged.
        if (calculated.TryPickT0(out var productId, out _))
        {
            await _publishEndpoint.Publish(new CalculateMetricsForProduct(productId), context.CancellationToken);
        }
    }
}
