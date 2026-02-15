using Server.Domain.Measurements;

namespace Server.Application.New.Abstractions.Repositories;

public interface IMatchedPairDifferenceRepository : IRepository<MatchedPairDifference, MatchedPairDifferenceId>
{
    Task RemoveByMeasurementIds(IReadOnlySet<string> measurementIds, CancellationToken cancellationToken);
}