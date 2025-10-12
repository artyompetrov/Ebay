using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Repositories;

public interface IMatchedPairDifferenceRepository : IRepository<MatchedPairDifference, MatchedPairDifferenceId>
{
    Task RemoveByMeasurementId(string measurementId, CancellationToken cancellationToken);
}