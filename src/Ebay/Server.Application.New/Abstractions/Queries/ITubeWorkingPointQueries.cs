using Server.Application.New.Models;

namespace Server.Application.New.Abstractions.Queries;

public interface ITubeWorkingPointQueries
{
    Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken);
}