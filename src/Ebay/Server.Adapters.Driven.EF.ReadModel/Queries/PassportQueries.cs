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
        return await _readDbContext.Passports.Where(x => x.ProductId == productId).Select(x =>
            new Passport(x.Id, x.FileName)
        ).ToListAsync(cancellationToken);
    }
}