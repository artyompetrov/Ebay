using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Queries;

public interface IMeasurementQueries
{
    Task<IReadOnlyCollection<MeasurementInfo>> GetMeasurementsInfo(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
        Guid productId,
        string? lotId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);
    
    Task<MeasurementInfoWithData?> GetMeasurementInfoWithData(string measurementId, CancellationToken cancellationToken);

    Task<MeasurementState?> GetMeasurementState(string measurementId, CancellationToken cancellationToken);

    Task<IReadOnlyList<MeasurementInfoWithData>> GetMeasurementInfos(
        IReadOnlyList<string> ids,
        CancellationToken cancellationToken);
    
    Task<IReadOnlyList<string>> GetMeasurementPairMeasurements(
        string id,
        CancellationToken cancellationToken);
    
    Task<IReadOnlySet<string?>> GetLotIds(
        Guid productId,
        CancellationToken cancellationToken);

}