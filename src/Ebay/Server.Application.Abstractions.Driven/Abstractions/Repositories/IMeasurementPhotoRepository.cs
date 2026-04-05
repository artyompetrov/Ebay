using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

public interface IMeasurementPhotoRepository
{
    Task<IReadOnlyCollection<MeasurementPhotoInfo>> GetByMeasurementId(
        string measurementId,
        CancellationToken cancellationToken);

    Task<MeasurementPhotoInfo?> Get(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken);

    Task<int> GetNextOrder(
        string measurementId,
        CancellationToken cancellationToken);

    Task Add(
        MeasurementPhotoInfo photo,
        CancellationToken cancellationToken);

    Task Delete(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken);
}
