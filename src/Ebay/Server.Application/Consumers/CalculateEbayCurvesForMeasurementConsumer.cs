using MassTransit;
using Server.Application.Services.MeasurementPlot;

namespace Server.Application.Consumers;

public class CalculateEbayCurvesForMeasurementConsumer : IConsumer<CalculateEbayCurvesForMeasurement>
{
    private readonly MeasurementPlotService _measurementPlotService;

    public CalculateEbayCurvesForMeasurementConsumer(MeasurementPlotService measurementPlotService)
    {
        _measurementPlotService = measurementPlotService;
    }

    public async Task Consume(ConsumeContext<CalculateEbayCurvesForMeasurement> context)
    {
        await _measurementPlotService.PlotForMeasurementId(
            measurementId: context.Message.MeasurementId,
            cancellationToken: context.CancellationToken,
            mergeVertical: false,
            legendVertical: true,
            addQuickTest: true,
            width: 550,
            height: 400,
            sellingOnly: true);
    }
}

public record CalculateEbayCurvesForMeasurement(string MeasurementId);
