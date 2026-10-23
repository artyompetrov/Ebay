using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Application.SigningKeys;

/// <summary>
/// Use case that removes token signing keys which can no longer be decrypted (their encryption keys were lost).
/// </summary>
public sealed class SigningKeyCleanupService
{
    private readonly ISigningKeyCleanupAdapter _signingKeyCleanupAdapter;
    private readonly ILogger<SigningKeyCleanupService> _logger;

    /// <summary>
    /// Creates the signing key cleanup use case.
    /// </summary>
    public SigningKeyCleanupService(
        ISigningKeyCleanupAdapter signingKeyCleanupAdapter,
        ILogger<SigningKeyCleanupService> logger)
    {
        _signingKeyCleanupAdapter = signingKeyCleanupAdapter;
        _logger = logger;
    }

    /// <summary>
    /// Deletes the signing keys that can no longer be decrypted.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token of the operation.</param>
    public async Task RemoveUnreadableKeysAsync(CancellationToken cancellationToken)
    {
        var removedCount = await _signingKeyCleanupAdapter.RemoveUnreadableKeysAsync(cancellationToken);

        if (removedCount > 0)
        {
            _logger.LogInformation("Deleted {RemovedCount} unreadable signing keys", removedCount);
        }
    }
}
