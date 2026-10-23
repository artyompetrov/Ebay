using Duende.IdentityServer.Services.KeyManagement;
using Duende.IdentityServer.Stores;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.EF.Identity;

/// <summary>
/// Runs <see cref="UnreadableSigningKeyCleaner"/> against the IdentityServer signing key store.
/// </summary>
internal sealed class SigningKeyCleanupAdapter : ISigningKeyCleanupAdapter
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly UnreadableSigningKeyCleaner _cleaner;

    public SigningKeyCleanupAdapter(IServiceScopeFactory serviceScopeFactory, UnreadableSigningKeyCleaner cleaner)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _cleaner = cleaner;
    }

    public async Task<int> RemoveUnreadableKeysAsync(CancellationToken cancellationToken)
    {
        // Duende registers the signing key store (it uses the scoped IdentityDbContext) and the protector as
        // scoped/transient library services, so they are resolved from a scope owned by this single operation.
        await using var scope = _serviceScopeFactory.CreateAsyncScope();
        var store = scope.ServiceProvider.GetRequiredService<ISigningKeyStore>();
        var protector = scope.ServiceProvider.GetRequiredService<ISigningKeyProtector>();

        return await _cleaner.RemoveUnreadableKeysAsync(store, protector, cancellationToken);
    }
}
