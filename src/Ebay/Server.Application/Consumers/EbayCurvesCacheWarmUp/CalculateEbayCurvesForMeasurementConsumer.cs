using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Services.MeasurementPlot;

namespace Server.Application.Consumers.EbayCurvesCacheWarmUp;

internal class CalculateEbayCurvesForMeasurementConsumer(
    MeasurementPlotService measurementPlotService,
    ILogger<CalculateEbayCurvesForMeasurementConsumer> logger) : IConsumer<CalculateEbayCurvesForMeasurement>
{
    private readonly MeasurementPlotService _measurementPlotService = measurementPlotService;
    private readonly ILogger<CalculateEbayCurvesForMeasurementConsumer> _logger = logger;

    public async Task Consume(ConsumeContext<CalculateEbayCurvesForMeasurement> context)
    {
        _logger.LogInformation("Warm-up for {MeasurementId}", context.Message.MeasurementId);
        try
        {
            _ = await _measurementPlotService.PlotForEbay(
                context.Message.MeasurementId,
                lotId: null,
                sellingOnly: false,
                cancellationToken: context.CancellationToken);

            _ = await _measurementPlotService.GetEbayTubeDescription(
                context.Message.MeasurementId,
                lotId: null,
                sellingOnly: false,
                cancellationToken: context.CancellationToken);
        }
        catch (DbUpdateException ex)
        {
            _logger.LogWarning(ex, "Error while updating measurement cache entry");
        }
    }
}

public record CalculateEbayCurvesForMeasurement(string MeasurementId);
