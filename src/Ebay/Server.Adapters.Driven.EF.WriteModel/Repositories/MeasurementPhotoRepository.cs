using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain.Measurements;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

public sealed class MeasurementPhotoRepository : IMeasurementPhotoRepository
{
    public async Task<MeasurementPhoto?> GetByIdAsync(
        IWriteModelUnitOfWork unitOfWork,
        Guid id,
        CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        return await dbContext.MeasurementPhotos
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(
        IWriteModelUnitOfWork unitOfWork,
        MeasurementPhoto aggregate,
        CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        await dbContext.MeasurementPhotos.AddAsync(aggregate, cancellationToken);
    }

    public async Task RemoveAsync(
        IWriteModelUnitOfWork unitOfWork,
        Guid id,
        CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        var entity = await dbContext.MeasurementPhotos
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (entity == null)
        {
            return;
        }

        dbContext.MeasurementPhotos.Remove(entity);
    }

    public async Task RemoveAsync(
        IWriteModelUnitOfWork unitOfWork,
        IReadOnlySet<Guid> id,
        CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        var entities = await dbContext.MeasurementPhotos
            .Where(x => id.Contains(x.Id))
            .ToListAsync(cancellationToken);

        dbContext.MeasurementPhotos.RemoveRange(entities);
    }
}