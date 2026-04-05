using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

public interface IMeasurementPhotoQueries
{
    Task<IReadOnlyList<MeasurementPhotoInfo>> GetByMeasurementId(
        string measurementId,
        CancellationToken cancellationToken);

    Task<MeasurementPhotoInfo?> Get(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken);
}
