using Server.Application.New.Models;

namespace Server.Application.New.Abstractions.Queries;

/// <summary>
/// контракт.
/// </summary>
public interface IPassportQueries
{
    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<IReadOnlyList<Passport>> GetPassports(Guid productId, CancellationToken cancellationToken);
}
