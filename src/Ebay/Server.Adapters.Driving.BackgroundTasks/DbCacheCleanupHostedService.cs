using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Application.DbCache;

namespace Server.Adapters.Driving.BackgroundTasks;

internal sealed class DbCacheCleanupHostedService : IHostedService
{
    private readonly DbCacheCleanupService _cleanupService;
    private readonly ILogger<DbCacheCleanupHostedService> _logger;

    public DbCacheCleanupHostedService(
        DbCacheCleanupService cleanupService,
        ILogger<DbCacheCleanupHostedService> logger)
    {
        _cleanupService = cleanupService;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Service started");

        await BackgroundJobTracing.RunAsync(nameof(DbCacheCleanupHostedService), _cleanupService.RemoveOldVersionsAsync, cancellationToken);
        _logger.LogInformation("Removed old db cache versions");
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
