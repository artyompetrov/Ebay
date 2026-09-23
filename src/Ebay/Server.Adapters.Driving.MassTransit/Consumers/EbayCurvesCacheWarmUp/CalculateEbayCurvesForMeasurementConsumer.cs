using MassTransit;
using Microsoft.EntityFrameworkCore;
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
        try
        {
            await _measurementPlotService.PlotForEbay(
                context.Message.MeasurementId,

                sellingOnly: false,
                cancellationToken: context.CancellationToken);

            await _measurementPlotService.GetEbayTubeDescription(
                context.Message.MeasurementId,
                sellingOnly: false,
                cancellationToken: context.CancellationToken);
        }
        // TODO: DbUpdateException leaking here from ICacheStore's DbCache implementation is a driven-adapter
        // (EF) detail this driving adapter shouldn't need to know about; once task 5.3 moves DbCache, this
        // should be swallowed/translated at that boundary instead, so this catch (and the EF Core package
        // reference it forces on this project) can be removed.
        catch (DbUpdateException ex)
        {
            _logger.LogWarning(ex, "Error while updating measurement cache entry");
        }
    }
}
