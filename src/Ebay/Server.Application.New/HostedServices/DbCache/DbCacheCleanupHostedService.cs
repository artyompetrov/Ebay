using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Application.New.HostedServices.DbCache;

public class DbCacheCleanupHostedService : IHostedService
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
        var cacheStore = scope.ServiceProvider.GetRequiredService<ICacheStore>();

        await cacheStore.RemoveOldVersionsAsync(cancellationToken);
        _logger.LogInformation("Removed old db cache versions");
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
