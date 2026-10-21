using Duende.IdentityServer.Services.KeyManagement;
using Duende.IdentityServer.Stores;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Server.Adapters.Driven.EF.Identity;

/// <summary>
/// Runs <see cref="UnreadableSigningKeyCleaner"/> once on startup.
/// </summary>
internal sealed class UnreadableSigningKeyCleanupHostedService : IHostedService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly UnreadableSigningKeyCleaner _cleaner;
    private readonly ILogger<UnreadableSigningKeyCleanupHostedService> _logger;

    public UnreadableSigningKeyCleanupHostedService(
        IServiceScopeFactory serviceScopeFactory,
        UnreadableSigningKeyCleaner cleaner,
        ILogger<UnreadableSigningKeyCleanupHostedService> logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _cleaner = cleaner;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        // Duende registers the signing key store (it uses the scoped IdentityDbContext) and the protector as
        // scoped/transient library services, so they are resolved from a scope owned by this single operation.
        await using var scope = _serviceScopeFactory.CreateAsyncScope();
        var store = scope.ServiceProvider.GetRequiredService<ISigningKeyStore>();
        var protector = scope.ServiceProvider.GetRequiredService<ISigningKeyProtector>();

        try
        {
            var removedCount = await _cleaner.RemoveUnreadableKeysAsync(store, protector, cancellationToken);

            if (removedCount > 0)
            {
                _logger.LogInformation("Deleted {RemovedCount} unreadable signing keys", removedCount);
            }
        }
        // The cleanup is best effort: a failure must not stop the application from starting.
        catch (Exception e) when (e is not OperationCanceledException)
        {
            _logger.LogError(e, "Failed to delete unreadable signing keys");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
