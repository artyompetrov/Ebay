using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class ClientErrorRepository : IClientErrorRepository
{
    private readonly WriteModelDbContext _dbContext;

    public ClientErrorRepository(WriteModelDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(ClientError error, CancellationToken cancellationToken) => await _dbContext.ClientErrors.AddAsync(error, cancellationToken);
}
