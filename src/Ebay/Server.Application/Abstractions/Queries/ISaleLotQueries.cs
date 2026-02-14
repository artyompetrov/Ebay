namespace Server.Application.Abstractions.Queries;

public interface ISaleLotQueries
{
    Task<SaleLotInfo?> GetByIdAsync(string id, CancellationToken cancellationToken);
}
