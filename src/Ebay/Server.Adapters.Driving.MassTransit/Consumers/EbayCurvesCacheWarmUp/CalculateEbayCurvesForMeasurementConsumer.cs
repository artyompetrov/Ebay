using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driving.Abstractions.Messages;
using Server.Application.New.MeasurementPlot;

namespace Server.Adapters.Driving.MassTransit.Consumers.EbayCurvesCacheWarmUp;

public class CalculateEbayCurvesForMeasurementConsumer : IConsumer<CalculateEbayCurvesForMeasurement>
{
    private readonly MeasurementPlotService _measurementPlotService;
    private readonly ILogger<CalculateEbayCurvesForMeasurementConsumer> _logger;

    public CalculateEbayCurvesForMeasurementConsumer(
        MeasurementPlotService measurementPlotService,
        ILogger<CalculateEbayCurvesForMeasurementConsumer> logger)
    {
        _measurementPlotService = measurementPlotService;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<CalculateEbayCurvesForMeasurement> context)
    {
        _logger.LogInformation("Warm-up for {MeasurementId}", context.Message.MeasurementId);

        await _measurementPlotService.PlotForEbay(
            context.Message.MeasurementId,

            sellingOnly: false,
            cancellationToken: context.CancellationToken);

        await _measurementPlotService.GetEbayTubeDescription(
            context.Message.MeasurementId,
            sellingOnly: false,
            cancellationToken: context.CancellationToken);
    }
}
