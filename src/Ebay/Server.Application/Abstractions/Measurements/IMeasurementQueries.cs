using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Measurements;

public interface IMeasurementQueries
{
    Task<IReadOnlyCollection<string>> GetMeasurementIds(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimmilarMeasurements(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    Task<Dictionary<string, IReadOnlyCollection<SimilarMeasurementInfo>>> GetSimilarMeasurements(
        CancellationToken cancellationToken,
        string[] measurementIds);

    
    Task<MeasurementInfo?> GetMeasurementInfo(string measurementId, CancellationToken cancellationToken);
    
    Task<MeasurementState?> GetMeasurementState(string measurementId, CancellationToken cancellationToken);
}