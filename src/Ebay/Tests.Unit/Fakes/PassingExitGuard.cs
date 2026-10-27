using OneOf;
using OneOf.Types;
using Server.Adapters.Driven.ScrapingProxy;

namespace Tests.Unit.Fakes;

/// <summary>
/// Проба прокси, которая всегда проходит и ничего не запрашивает: для тестов разбора, где прокси не участвует.
/// </summary>
internal sealed class PassingExitGuard : IScrapingProxyExitGuard
{
    public static PassingExitGuard Instance { get; } = new();

    public Task<OneOf<Success, Error<string>>> EnsureWorkingExitAsync(
        string httpClientName,
        Uri probeUri,
        CancellationToken cancellationToken) =>
        Task.FromResult<OneOf<Success, Error<string>>>(new Success());
}
