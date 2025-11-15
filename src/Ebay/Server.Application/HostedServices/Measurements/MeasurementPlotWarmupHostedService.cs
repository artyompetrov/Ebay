using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Application.Consumers.EbayCurvesCacheWarmUp;
using Server.Application.Data;
using Server.Application.Infrastructure;

namespace Server.Application.HostedServices.Measurements
{
    public class MeasurementPlotWarmupHostedService(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<MeasurementPlotWarmupHostedService> logger,
        EbayServerOptions options) : IHostedService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
        private readonly ILogger<MeasurementPlotWarmupHostedService> _logger = logger;
        private readonly EbayServerOptions _options = options;

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            if (_options.IsLocalRun)
            {
                return;
            }

            using var scope = _serviceScopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var publishEndpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

            var measurementIds = await dbContext.ProductMeasurements
                .AsNoTracking()
                .Select(m => m.Id)
                .ToListAsync(cancellationToken);

            foreach (var batch in measurementIds.Batch(500))
            {
                foreach (var id in batch)
                {
                    await publishEndpoint.Publish(new CalculateEbayCurvesForMeasurement(id), cancellationToken);
                }

                _ = await dbContext.SaveChangesAsync(cancellationToken);
            }

            _logger.LogInformation("Published {Count} measurement plot warmup commands", measurementIds.Count);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}