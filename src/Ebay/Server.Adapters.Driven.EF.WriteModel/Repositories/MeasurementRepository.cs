using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain.Measurements;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class MeasurementRepository : IMeasurementRepository
{
    public async Task<ProductMeasurement?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, string id, CancellationToken cancellationToken) => await WriteModelUnitOfWork.From(unitOfWork).DbContext.ProductMeasurements.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public async Task AddAsync(IWriteModelUnitOfWork unitOfWork, ProductMeasurement aggregate, CancellationToken cancellationToken) => _ = await WriteModelUnitOfWork.From(unitOfWork).DbContext.ProductMeasurements.AddAsync(aggregate, cancellationToken);

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, string id, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        await dbContext.ProductMeasurements.Where(o => o.Id == id)
            .ExecuteDeleteAsync(cancellationToken: cancellationToken);
    }

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<string> ids, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        if (ids.Count == 0)
        {
            return;
        }

        const int batchSize = 1000; // безопасный размер IN (...)
        foreach (var batch in ids.Chunk(batchSize))
        {
            await dbContext.ProductMeasurements
                .Where(x => batch.Contains(x.Id))
                .ExecuteDeleteAsync(cancellationToken);
        }
    }
}