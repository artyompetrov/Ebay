using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driving.Abstractions.Messages;
using Server.Application.New.MeasurementPlot;

namespace Server.Application.New.HostedServices.Measurements;

public class MeasurementPlotWarmupHostedService : IHostedService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<MeasurementPlotWarmupHostedService> _logger;
    private readonly EbayServerOptions _options;

    public MeasurementPlotWarmupHostedService(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<MeasurementPlotWarmupHostedService> logger,
        EbayServerOptions options)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
        _options = options;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        // Pre-populates the Postgres-backed DbCache to avoid a slow first plot render after deploy.
        // It is independent of the per-process in-memory image cache invalidated by measurement state changes.
        if (_options.IsLocalRun)
        {
            return;
        }

        _logger.LogInformation("Started");

        using var scope = _serviceScopeFactory.CreateScope();
        var measurementQueries = scope.ServiceProvider.GetRequiredService<IMeasurementQueries>();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IWriteModelUnitOfWork>();
        var publishEndpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

        var measurementIds = await measurementQueries.GetAllMeasurementIds(cancellationToken);

        foreach (var batch in measurementIds.Batch(500))
        {
            foreach (var id in batch)
            {
                await publishEndpoint.Publish(new CalculateEbayCurvesForMeasurement(id), cancellationToken);
            }

            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        _logger.LogInformation("Published {Count} measurement plot warmup commands", measurementIds.Count);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
