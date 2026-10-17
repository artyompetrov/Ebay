using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class PassportQueries : IPassportQueries
{
    private readonly IDbContextFactory<ReadDbContext> _dbContextFactory;

    public PassportQueries(IDbContextFactory<ReadDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    public async Task<IReadOnlyList<Passport>> GetPassports(Guid productId, CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        return await dbContext.Passports
            .Where(x => x.ProductId == productId)
            .OrderBy(x => x.Order)
            .Select(x => new Passport(x.Id, x.FileName, x.Order))
            .ToListAsync(cancellationToken);
    }

    public async Task<PassportFile?> GetPassportFileAsync(Guid productId, Guid passportId, CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        return await dbContext.Passports
            .Where(x => x.ProductId == productId && x.Id == passportId)
            .Select(x => new PassportFile(x.FileName, x.ContentType, x.Content))
            .SingleOrDefaultAsync(cancellationToken);
    }
}
