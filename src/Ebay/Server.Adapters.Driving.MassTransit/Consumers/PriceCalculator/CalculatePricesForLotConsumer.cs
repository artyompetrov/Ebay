using MassTransit;
using Server.Application.Abstractions.Driving.Abstractions.Messages;
using Server.Application.Abstractions.Driving.Abstractions.Services;

namespace Server.Adapters.Driving.MassTransit.Consumers.PriceCalculator;

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
        var productId = await _lotPriceCalculator.CalculateAsync(context.Message.LotId, context.CancellationToken);

        await _publishEndpoint.Publish(new CalculateMetricsForProduct(productId), context.CancellationToken);
    }
}
