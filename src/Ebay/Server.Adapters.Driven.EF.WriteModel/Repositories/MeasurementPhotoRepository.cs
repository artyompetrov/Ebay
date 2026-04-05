using Microsoft.EntityFrameworkCore;
using Server.Adapters.Driven.EF.WriteModel.Models;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

public sealed class MeasurementPhotoRepository : IMeasurementPhotoStore
{
    private readonly WriteModelDbContext _context;

    public MeasurementPhotoRepository(WriteModelDbContext context)
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

    public async Task Add(
        MeasurementPhotoInfo photo,
        CancellationToken cancellationToken)
    {
        var entity = new MeasurementPhotoEntity
        {
            Id = photo.Id,
            MeasurementId = photo.MeasurementId,
            FileName = photo.FileName,
            ContentType = photo.ContentType,
            Order = photo.Order,
            Content = photo.Content
        };

        await _context.MeasurementPhotos.AddAsync(entity, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task Delete(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken)
    {
        var entity = await _context.MeasurementPhotos
            .SingleOrDefaultAsync(x => x.MeasurementId == measurementId && x.Id == photoId, cancellationToken);

        if (entity == null)
        {
            return;
        }

        var order = entity.Order;
        _context.MeasurementPhotos.Remove(entity);

        var photosToShift = await _context.MeasurementPhotos
            .Where(x => x.MeasurementId == measurementId && x.Order > order)
            .ToListAsync(cancellationToken);

        foreach (var photo in photosToShift)
        {
            photo.Order--;
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}
