namespace Server.Application.Abstractions.Queries;

public interface ITubeWorkingPointQueries
{
    Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken);
}