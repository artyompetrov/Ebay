namespace Server.Application.Abstractions.Queries;

public interface IPassportQueries
{
    Task<IReadOnlyList<Passport>> GetPassports(Guid productId, CancellationToken cancellationToken);
}
