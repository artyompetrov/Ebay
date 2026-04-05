using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions;

public interface IMeasurementPhotoStore
{
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
