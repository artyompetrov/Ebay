using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions.Queries;

public interface IMeasurementPhotoQueries
{
    Task<int> GetNextOrder(
        string measurementId,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<MeasurementPhotoInfo>> GetByMeasurementId(
        string measurementId,
        CancellationToken cancellationToken);

    Task<MeasurementPhotoInfo?> Get(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<MeasurementPhotoMetadata>> GetMetadataByMeasurementIds(
        IReadOnlyCollection<string> measurementIds,
        CancellationToken cancellationToken);

    /// <summary>
    /// Returns only the stored thumbnail bytes for a photo, without loading <c>Content</c>.
    /// Returns <see langword="null"/> when the photo does not exist.
    /// </summary>
    Task<byte[]?> GetThumbnail(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken);
}
