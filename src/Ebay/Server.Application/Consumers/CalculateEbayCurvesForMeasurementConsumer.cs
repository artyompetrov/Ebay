using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Services.MeasurementPlot;

namespace Server.Application.Consumers;

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
        _logger.LogInformation("Warm-up for {MeasurementId}",  context.Message.MeasurementId);
        
        await _measurementPlotService.PlotForEbay(context.Message.MeasurementId, context.CancellationToken);
    }
}

public record CalculateEbayCurvesForMeasurement(string MeasurementId);
