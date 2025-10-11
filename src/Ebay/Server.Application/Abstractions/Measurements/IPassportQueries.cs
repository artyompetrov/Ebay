namespace Server.Application.Abstractions.Measurements;

public interface IPassportQueries
{
    Task<IReadOnlyList<Passport>> GetPassports(Guid productId, CancellationToken cancellationToken);
}