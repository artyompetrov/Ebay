using MassTransit;
using Server.Application.Controllers;

namespace Server.Application.Consumers;

public class CalculateEbayCurvesForMeasurementConsumer : IConsumer<CalculateEbayCurvesForMeasurement>
{
    private readonly MeasurementPageController _controller;

    public CalculateEbayCurvesForMeasurementConsumer(MeasurementPageController controller)
    {
        _controller = controller;
    }

    public async Task Consume(ConsumeContext<CalculateEbayCurvesForMeasurement> context)
    {
        await _controller.GetEbayCurves(context.Message.MeasurementId, context.CancellationToken);
    }
}

public record CalculateEbayCurvesForMeasurement(string MeasurementId);
