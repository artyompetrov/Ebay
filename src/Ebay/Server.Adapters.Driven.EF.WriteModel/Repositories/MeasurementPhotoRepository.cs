using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain.Measurements;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

public sealed class MeasurementPhotoRepository : IMeasurementPhotoRepository
{
    private readonly WriteModelDbContext _context;

    public MeasurementPhotoRepository(WriteModelDbContext context)
    {
        _context = context;
    }

    public async Task<MeasurementPhoto?> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        return await _context.MeasurementPhotos
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);
    }

    public async Task AddAsync(
        MeasurementPhoto aggregate,
        CancellationToken cancellationToken)
    {
        await _context.MeasurementPhotos.AddAsync(aggregate, cancellationToken);
    }

    public async Task RemoveAsync(
        Guid id,
        CancellationToken cancellationToken)
    {
        var entity = await _context.MeasurementPhotos
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (entity == null)
        {
            return;
        }

        _context.MeasurementPhotos.Remove(entity);
    }

    public async Task RemoveAsync(
        IReadOnlySet<Guid> id,
        CancellationToken cancellationToken)
    {
        var entities = await _context.MeasurementPhotos
            .Where(x => id.Contains(x.Id))
            .ToListAsync(cancellationToken);

        _context.MeasurementPhotos.RemoveRange(entities);
    }
}
