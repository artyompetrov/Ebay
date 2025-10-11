using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Measurements;

public interface IMeasurementQueries
{
    Task<IReadOnlyCollection<MeasurementInfo>> GetMeasurementsInfo(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    Task<Dictionary<string, IReadOnlyCollection<SimilarMeasurementInfo>>> GetSimilarMeasurements(
        CancellationToken cancellationToken,
        string[] measurementIds);

    Task<MeasurementInfoWithData?> GetMeasurementInfoWithData(string measurementId, CancellationToken cancellationToken);

    Task<MeasurementState?> GetMeasurementState(string measurementId, CancellationToken cancellationToken);

    Task<IReadOnlyList<MeasurementInfoWithData>> GetMeasurementInfos(
        IReadOnlyList<string> ids,
        CancellationToken cancellationToken);
}