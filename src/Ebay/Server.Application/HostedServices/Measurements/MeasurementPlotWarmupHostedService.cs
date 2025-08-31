using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Application.Consumers;
using Server.Application.Data;

namespace Server.Application.HostedServices.Measurements;

public class MeasurementPlotWarmupHostedService : IHostedService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<MeasurementPlotWarmupHostedService> _logger;

    public MeasurementPlotWarmupHostedService(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<MeasurementPlotWarmupHostedService> logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var publishEndpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

        var measurementIds = await dbContext.ProductMeasurements
            .AsNoTracking()
            .Select(m => m.Id)
            .ToListAsync(cancellationToken);

        foreach (var id in measurementIds)
        {
            await publishEndpoint.Publish(new CalculateEbayCurvesForMeasurement(id), cancellationToken);
        }

        _logger.LogInformation("Published {Count} measurement plot warmup commands", measurementIds.Count);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
