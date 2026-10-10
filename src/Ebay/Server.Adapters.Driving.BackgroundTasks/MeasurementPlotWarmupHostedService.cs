using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Application.MeasurementPlot;

namespace Server.Adapters.Driving.BackgroundTasks;

internal sealed class MeasurementPlotWarmupHostedService : IHostedService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<MeasurementPlotWarmupHostedService> _logger;
    private readonly BackgroundTasksOptions _options;

    public MeasurementPlotWarmupHostedService(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<MeasurementPlotWarmupHostedService> logger,
        IOptions<BackgroundTasksOptions> options)
    {
        _serviceScopeFactory = serviceScopeFactory;
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

        using var scope = _serviceScopeFactory.CreateScope();
        var warmupService = scope.ServiceProvider.GetRequiredService<MeasurementPlotWarmupService>();

        await warmupService.PublishWarmupForAllMeasurementsAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
