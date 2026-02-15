using Server.Application.New.Models;

namespace Server.Application.New.Abstractions.Queries;

/// <summary>
/// контракт.
/// </summary>
public interface ITubeWorkingPointQueries
{
    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken);
}
