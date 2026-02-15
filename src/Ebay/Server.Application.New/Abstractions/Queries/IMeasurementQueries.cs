using Server.Application.New.Models;
using Server.Domain.Measurements;

namespace Server.Application.New.Abstractions.Queries;

/// <summary>
/// контракт.
/// </summary>
public interface IMeasurementQueries
{
    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<IReadOnlyCollection<MeasurementInfo>> GetMeasurementsInfo(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
        Guid productId,
        string? lotId,
        IReadOnlyCollection<ProductState> productStates,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
        Guid productId,
        IReadOnlyCollection<ProductState> productStates,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken);

    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<MeasurementInfoWithData?> GetMeasurementInfoWithData(string measurementId, CancellationToken cancellationToken);

    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<MeasurementInfo?> GetMeasurementInfo(string measurementId, CancellationToken cancellationToken);

    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<IReadOnlyList<MeasurementInfoWithData>> GetMeasurementInfosWithData(
        IReadOnlyList<string> ids,
        CancellationToken cancellationToken);

    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<double?> GetDoubleTriodeSectionRmse(string measurementId, CancellationToken cancellationToken);

    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<IReadOnlyList<string>> GetMeasurementPairMeasurements(
        string id,
        CancellationToken cancellationToken);

    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task<IReadOnlySet<string?>> GetLotIds(
        Guid productId,
        CancellationToken cancellationToken);
}
