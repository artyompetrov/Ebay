using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain.LotForSale;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class LotForSaleRepository : ILotForSaleRepository
{
    public async Task<LotForSale?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, string id, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        return await dbContext.LotForSales
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(IWriteModelUnitOfWork unitOfWork, LotForSale aggregate, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        await dbContext.LotForSales.AddAsync(aggregate, cancellationToken);
    }

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, string id, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        await dbContext.LotForSales
            .Where(x => x.Id == id)
            .ExecuteDeleteAsync(cancellationToken);
    }

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<string> ids, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        if (ids.Count == 0)
        {
            return;
        }

        const int batchSize = 1000;
        foreach (var batch in ids.Chunk(batchSize))
        {
            await dbContext.LotForSales
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}