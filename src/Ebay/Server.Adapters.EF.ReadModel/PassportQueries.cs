using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Measurements;

namespace Sever.Adapters.EF.ReadModel;

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