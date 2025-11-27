using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using InfrastructureDbCache = Server.Application.Infrastructure.DbCache;

namespace Server.Application.HostedServices.DbCache;

public class DbCacheCleanupHostedService(
    IServiceScopeFactory serviceScopeFactory,
    ILogger<DbCacheCleanupHostedService> logger) : IHostedService
{
    private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
    private readonly ILogger<DbCacheCleanupHostedService> _logger = logger;

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var dbCache = scope.ServiceProvider.GetRequiredService<InfrastructureDbCache>();

        await dbCache.RemoveOldVersionsAsync(cancellationToken);
        _logger.LogInformation("Removed old db cache versions");
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}