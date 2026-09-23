using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class PassportQueries : IPassportQueries
{
    private readonly ReadDbContext _readDbContext;

    public PassportQueries(ReadDbContext readDbContext)
    {
        _readDbContext = readDbContext;
    }

    public async Task<IReadOnlyList<Passport>> GetPassports(Guid productId, CancellationToken cancellationToken)
    {
        return await _readDbContext.Passports
            .Where(x => x.ProductId == productId)
            .OrderBy(x => x.Order)
            .Select(x => new Passport(x.Id, x.FileName, x.Order))
            .ToListAsync(cancellationToken);
    }

    public async Task<PassportFile?> GetPassportFileAsync(Guid productId, Guid passportId, CancellationToken cancellationToken)
    {
        return await _readDbContext.Passports
            .Where(x => x.ProductId == productId && x.Id == passportId)
            .Select(x => new PassportFile(x.FileName, x.ContentType, x.Content))
            .SingleOrDefaultAsync(cancellationToken);
    }
}
