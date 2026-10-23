using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Application.SigningKeys;

namespace Server.Adapters.Driving.BackgroundTasks;

/// <summary>
/// Deletes unreadable token signing keys once on startup.
/// </summary>
internal sealed class SigningKeyCleanupHostedService : IHostedService
{
    private readonly SigningKeyCleanupService _cleanupService;
    private readonly ILogger<SigningKeyCleanupHostedService> _logger;

    public SigningKeyCleanupHostedService(
        SigningKeyCleanupService cleanupService,
        ILogger<SigningKeyCleanupHostedService> logger)
    {
        _cleanupService = cleanupService;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        try
        {
            await BackgroundJobTracing.RunAsync(
                nameof(SigningKeyCleanupHostedService), _cleanupService.RemoveUnreadableKeysAsync, cancellationToken);
        }
        // The cleanup is best effort: a failure must not stop the application from starting. The run's span is
        // already marked as failed.
        catch (Exception e) when (e.IsNotIntendedCancellation(cancellationToken))
        {
            _logger.LogError(e, "Failed to delete unreadable signing keys");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
