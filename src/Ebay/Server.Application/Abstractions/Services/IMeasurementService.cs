using Server.Application.Abstractions.Queries;
using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Services;

public interface IMeasurementService
{
    Task SaveMeasurement(
        string measurementId,
        byte[] measurementsFile,
        ProductState productState,
        string manufactureCode,
        Guid productId,
        CancellationToken cancellationToken);


    Task UpdateMeasurementLocation(
        string location,
        string measurementId,
        CancellationToken cancellationToken);

    Task UpdateMeasurementManufactureCode(
        string manufactureCode,
        string measurementId,
        CancellationToken cancellationToken);

    Task UpdateMeasurementMatchId(
        string? matchId,
        string measurementId,
        CancellationToken cancellationToken);

    Task UpdateMeasurementLotId(
        string? lotId,
        string measurementId,
        CancellationToken cancellationToken);

    Task UpdateMeasurementState(
        MeasurementState state,
        string measurementId,
        CancellationToken cancellationToken);

    Task DeleteMeasurement(
        string measurementId,
        CancellationToken cancellationToken);

    Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfos(
        Guid productId,
        IReadOnlyCollection<ProductState> productState,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    Task<byte[]?> GetMeasurementFile(string measurementId, CancellationToken cancellationToken);

    Task<IReadOnlySet<string?>> GetLotIdsForProductAsync(Guid productId, CancellationToken cancellationToken);
}