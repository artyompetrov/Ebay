using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class MeasurementPhotoQueries : IMeasurementPhotoQueries
{
    private readonly ReadDbContext _context;

    public MeasurementPhotoQueries(ReadDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetNextOrder(
        string measurementId,
        CancellationToken cancellationToken)
    {
        var maxOrder = await _context.MeasurementPhotos
            .Where(x => x.MeasurementId == measurementId)
            .Select(x => (int?)x.Order)
            .MaxAsync(cancellationToken);

        return (maxOrder ?? -1) + 1;
    }

    public async Task<IReadOnlyList<MeasurementPhotoInfo>> GetByMeasurementId(
        string measurementId,
        CancellationToken cancellationToken)
    {
        return await _context.MeasurementPhotos
            .Where(x => x.MeasurementId == measurementId)
            .OrderBy(x => x.Order)
            .Select(x => new MeasurementPhotoInfo(
                x.Id,
                x.MeasurementId,
                x.FileName,
                x.ContentType,
                x.Order,
                x.Content))
            .ToListAsync(cancellationToken);
    }

    public async Task<MeasurementPhotoInfo?> Get(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken)
    {
        return await _context.MeasurementPhotos
            .Where(x => x.MeasurementId == measurementId && x.Id == photoId)
            .Select(x => new MeasurementPhotoInfo(
                x.Id,
                x.MeasurementId,
                x.FileName,
                x.ContentType,
                x.Order,
                x.Content))
            .SingleOrDefaultAsync(cancellationToken);
    }
}
