using Server.Application.New.Models;

namespace Server.Application.New.Abstractions.Queries;

public interface IPassportQueries
{
    Task<IReadOnlyList<Passport>> GetPassports(Guid productId, CancellationToken cancellationToken);
}
