using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Repositories;

public interface IMatchedPairDifferenceRepository : IRepository<MatchedPairDifference, MatchedPairDifferenceId>
{
    Task RemoveByMeasurementIds(IReadOnlySet<string> measurementIds, CancellationToken cancellationToken);
}