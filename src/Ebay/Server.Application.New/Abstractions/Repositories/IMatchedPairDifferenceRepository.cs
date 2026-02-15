using Server.Domain.Measurements;

namespace Server.Application.New.Abstractions.Repositories;

/// <summary>
/// контракт.
/// </summary>
public interface IMatchedPairDifferenceRepository : IRepository<MatchedPairDifference, MatchedPairDifferenceId>
{
    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task RemoveByMeasurementIds(IReadOnlySet<string> measurementIds, CancellationToken cancellationToken);
}
