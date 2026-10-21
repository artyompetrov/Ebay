using System.Security.Cryptography;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services.KeyManagement;
using Duende.IdentityServer.Stores;
using Microsoft.Extensions.Logging;

namespace Server.Adapters.Driven.EF.Identity;

/// <summary>
/// Deletes the IdentityServer signing keys that the current DataProtection key ring cannot decrypt.
/// </summary>
/// <remarks>
/// Such keys appear when the DataProtection keys that encrypted them are lost (e.g. the keys volume was recreated).
/// They can never be used again, yet Duende's key manager does not delete them: it only retires keys it can read,
/// so it logs an error for each of them on every key cache refresh, forever.
/// </remarks>
internal sealed class UnreadableSigningKeyCleaner
{
    private readonly ILogger<UnreadableSigningKeyCleaner> _logger;

    public UnreadableSigningKeyCleaner(ILogger<UnreadableSigningKeyCleaner> logger)
    {
        _logger = logger;
    }

    /// <returns>The number of deleted keys.</returns>
    public async Task<int> RemoveUnreadableKeysAsync(
        ISigningKeyStore store,
        ISigningKeyProtector protector,
        CancellationToken cancellationToken)
    {
        var keys = (await store.LoadKeysAsync()).ToArray();
        var unreadableKeys = new List<(SerializedKey Key, CryptographicException Error)>();

        foreach (var key in keys)
        {
            try
            {
                protector.Unprotect(key);
            }
            catch (CryptographicException e)
            {
                unreadableKeys.Add((key, e));
            }
        }

        if (unreadableKeys.Count == 0)
        {
            return 0;
        }

        // No readable key at all means the key ring itself is most likely missing (volume not mounted, wrong
        // permissions), not that some old keys were orphaned. Deleting would make the loss permanent, while keeping
        // the keys lets them become readable again once the key ring is restored.
        if (unreadableKeys.Count == keys.Length)
        {
            _logger.LogWarning(
                "None of the {KeyCount} signing keys can be decrypted with the DataProtection key ring, skipping their cleanup: check the DataProtection keys directory",
                keys.Length);
            return 0;
        }

        foreach (var (key, error) in unreadableKeys)
        {
            cancellationToken.ThrowIfCancellationRequested();

            await store.DeleteKeyAsync(key.Id);

            _logger.LogWarning(
                error,
                "Deleted signing key {KeyId} created at {KeyCreated}: the DataProtection key ring cannot decrypt it",
                key.Id,
                key.Created);
        }

        return unreadableKeys.Count;
    }
}
