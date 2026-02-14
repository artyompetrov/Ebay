using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Queries;

namespace Sever.Adapters.EF.ReadModel.Queries;

internal sealed class SaleLotQueries : ISaleLotQueries
{
    private readonly ReadDbContext _dbContext;

    public SaleLotQueries(ReadDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<SaleLotInfo?> GetByIdAsync(string id, CancellationToken cancellationToken)
    {
        return await _dbContext.SaleLots
            .Where(x => x.Id == id)
            .Select(x => new SaleLotInfo(x.Id, x.Name, x.CreatedAt, x.ChangedAt))
            .SingleOrDefaultAsync(cancellationToken);
    }
}
