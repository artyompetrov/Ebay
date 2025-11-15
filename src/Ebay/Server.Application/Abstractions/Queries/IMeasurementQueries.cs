using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Queries
{
    public interface IMeasurementQueries
    {
        Task<IReadOnlyCollection<MeasurementInfo>> GetMeasurementsInfo(
            Guid productId,
            IReadOnlyCollection<MeasurementState> measurementStates,
            CancellationToken cancellationToken);

        Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
            Guid productId,
            string? lotId,
            IReadOnlyCollection<ProductState> productStates,
            IReadOnlyCollection<MeasurementState> measurementStates,
            CancellationToken cancellationToken);

        Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
            Guid productId,
            IReadOnlyCollection<ProductState> productStates,
            IReadOnlyCollection<MeasurementState> measurementStates,
            CancellationToken cancellationToken);

        Task<MeasurementInfoWithData?> GetMeasurementInfoWithData(string measurementId, CancellationToken cancellationToken);

        Task<MeasurementInfo?> GetMeasurementInfo(string measurementId, CancellationToken cancellationToken);

        Task<IReadOnlyList<MeasurementInfoWithData>> GetMeasurementInfosWithData(
            IReadOnlyList<string> ids,
            CancellationToken cancellationToken);

        Task<double?> GetDoubleTriodeSectionRmse(string measurementId, CancellationToken cancellationToken);

        Task<IReadOnlyList<string>> GetMeasurementPairMeasurements(
            string id,
            CancellationToken cancellationToken);

        Task<IReadOnlySet<string?>> GetLotIds(
            Guid productId,
            CancellationToken cancellationToken);
    }
}