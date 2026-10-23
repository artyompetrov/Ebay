namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Port of the token signing key store: removes signing keys that can no longer be used.
/// </summary>
public interface ISigningKeyCleanupAdapter
{
    /// <summary>
    /// Deletes the stored signing keys that the current key ring can no longer decrypt.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token of the operation.</param>
    /// <returns>The number of deleted keys.</returns>
    Task<int> RemoveUnreadableKeysAsync(CancellationToken cancellationToken);
}
