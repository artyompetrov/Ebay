using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Application.MeasurementPlot;

namespace Server.Adapters.Driving.BackgroundTasks;

internal sealed class MeasurementPlotWarmupHostedService : IHostedService
{
    private readonly MeasurementPlotWarmupService _warmupService;
    private readonly ILogger<MeasurementPlotWarmupHostedService> _logger;
    private readonly BackgroundTasksOptions _options;

    public MeasurementPlotWarmupHostedService(
        MeasurementPlotWarmupService warmupService,
        ILogger<MeasurementPlotWarmupHostedService> logger,
        IOptions<BackgroundTasksOptions> options)
    {
        _warmupService = warmupService;
        _logger = logger;
        _options = options.Value;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        if (_options.IsLocalRun)
        {
            return;
        }

        _logger.LogInformation("Started");

        await BackgroundJobTracing.RunAsync(
            nameof(MeasurementPlotWarmupHostedService), _warmupService.PublishWarmupForAllMeasurementsAsync, cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
