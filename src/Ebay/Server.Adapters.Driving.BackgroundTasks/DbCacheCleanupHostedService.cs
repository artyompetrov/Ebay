using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Application.DbCache;

namespace Server.Adapters.Driving.BackgroundTasks;

internal sealed class DbCacheCleanupHostedService : IHostedService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly ILogger<DbCacheCleanupHostedService> _logger;

    public DbCacheCleanupHostedService(
        IServiceScopeFactory serviceScopeFactory,
        ILogger<DbCacheCleanupHostedService> logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Service started");

        using var scope = _serviceScopeFactory.CreateScope();
        var cleanupService = scope.ServiceProvider.GetRequiredService<DbCacheCleanupService>();

        await cleanupService.RemoveOldVersionsAsync(cancellationToken);
        _logger.LogInformation("Removed old db cache versions");
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
