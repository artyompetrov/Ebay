using System.Security.Cryptography;
using AwesomeAssertions;
using Duende.IdentityServer.Configuration;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services.KeyManagement;
using Duende.IdentityServer.Stores;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.IdentityModel.Tokens;
using Server.Adapters.Driven.EF.Identity;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(UnreadableSigningKeyCleaner))]
public sealed class UnreadableSigningKeyCleanerTests
{
    private const string SigningAlgorithm = "RS256";
    private const int RsaKeySizeInBits = 2048;

    [Test]
    public async Task RemoveUnreadableKeysAsync_KeyEncryptedWithLostKeyRing_DeletesOnlyThatKey()
    {
        var currentRing = new DataProtectionKeyProtector(new KeyManagementOptions(), new EphemeralDataProtectionProvider());
        var lostRing = new DataProtectionKeyProtector(new KeyManagementOptions(), new EphemeralDataProtectionProvider());
        var readableKey = currentRing.Protect(CreateRsaKey("readable"));
        var unreadableKey = lostRing.Protect(CreateRsaKey("unreadable"));
        var store = new InMemorySigningKeyStore(readableKey, unreadableKey);
        var logger = new RecordingLogger<UnreadableSigningKeyCleaner>();
        var cleaner = new UnreadableSigningKeyCleaner(logger);

        var removedCount = await cleaner.RemoveUnreadableKeysAsync(store, currentRing, CancellationToken.None);

        removedCount.Should().Be(1);
        store.KeyIds.Should().BeEquivalentTo(["readable"]);
        logger.HasWarningContaining("unreadable").Should().BeTrue();
    }

    [Test]
    public async Task RemoveUnreadableKeysAsync_AllKeysReadable_DeletesNothing()
    {
        var currentRing = new DataProtectionKeyProtector(new KeyManagementOptions(), new EphemeralDataProtectionProvider());
        var store = new InMemorySigningKeyStore(
            currentRing.Protect(CreateRsaKey("first")),
            currentRing.Protect(CreateRsaKey("second")));
        var logger = new RecordingLogger<UnreadableSigningKeyCleaner>();
        var cleaner = new UnreadableSigningKeyCleaner(logger);

        var removedCount = await cleaner.RemoveUnreadableKeysAsync(store, currentRing, CancellationToken.None);

        removedCount.Should().Be(0);
        store.KeyIds.Should().BeEquivalentTo(["first", "second"]);
        logger.HasWarning.Should().BeFalse();
    }

    [Test]
    public async Task RemoveUnreadableKeysAsync_NoKeyReadable_DeletesNothingAndWarns()
    {
        var lostRing = new DataProtectionKeyProtector(new KeyManagementOptions(), new EphemeralDataProtectionProvider());
        var currentRing = new DataProtectionKeyProtector(new KeyManagementOptions(), new EphemeralDataProtectionProvider());
        var store = new InMemorySigningKeyStore(
            lostRing.Protect(CreateRsaKey("first")),
            lostRing.Protect(CreateRsaKey("second")));
        var logger = new RecordingLogger<UnreadableSigningKeyCleaner>();
        var cleaner = new UnreadableSigningKeyCleaner(logger);

        var removedCount = await cleaner.RemoveUnreadableKeysAsync(store, currentRing, CancellationToken.None);

        removedCount.Should().Be(0);
        store.KeyIds.Should().BeEquivalentTo(["first", "second"]);
        logger.HasWarningContaining("skipping their cleanup").Should().BeTrue();
    }

    private static RsaKeyContainer CreateRsaKey(string id)
    {
        using var rsa = RSA.Create(RsaKeySizeInBits);
        // The container serializes the exported parameters, so the RSA instance is not needed after this.
        return new RsaKeyContainer(
            new RsaSecurityKey(rsa.ExportParameters(includePrivateParameters: true)) { KeyId = id },
            SigningAlgorithm,
            DateTime.UtcNow);
    }

    private sealed class InMemorySigningKeyStore : ISigningKeyStore
    {
        private readonly List<SerializedKey> _keys;

        public InMemorySigningKeyStore(params SerializedKey[] keys)
        {
            _keys = [.. keys];
        }

        public IEnumerable<string> KeyIds => _keys.Select(static key => key.Id);

        public Task<IEnumerable<SerializedKey>> LoadKeysAsync() => Task.FromResult<IEnumerable<SerializedKey>>(_keys.ToArray());

        public Task StoreKeyAsync(SerializedKey key)
        {
            _keys.Add(key);
            return Task.CompletedTask;
        }

        public Task DeleteKeyAsync(string id)
        {
            _keys.RemoveAll(key => key.Id == id);
            return Task.CompletedTask;
        }
    }
}
