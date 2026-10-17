using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.Abstractions.Driving.Models;
using Server.Domain.Measurements;

namespace Server.Application;

internal sealed class MeasurementService : IMeasurementService
{
    private readonly IMeasurementRepository _productMeasurementRepository;
    private readonly IMatchedPairDifferenceRepository _matchedPairDifferenceRepository;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IMeasurementFileParser _measurementFileParser;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;

    public MeasurementService(
        IMeasurementRepository productMeasurementRepository,
        IMatchedPairDifferenceRepository matchedPairDifferenceRepository,
        IMeasurementQueries measurementQueries,
        IMeasurementFileParser measurementFileParser,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory
    )
    {
        _productMeasurementRepository = productMeasurementRepository;
        _matchedPairDifferenceRepository = matchedPairDifferenceRepository;
        _measurementQueries = measurementQueries;
        _measurementFileParser = measurementFileParser;
        _unitOfWorkFactory = unitOfWorkFactory;
    }

    public async Task SaveMeasurement(
        string measurementId,
        byte[] measurementsFile,
        ProductState productState,
        string manufactureCode,
        Guid productId,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var measurement = ProductMeasurement.Create(
            id: measurementId,
            productId: productId,
            measurements: measurementsFile,
            manufactureCode: manufactureCode,
            productState: productState,
            measurementFileParser: _measurementFileParser
        );

        await _productMeasurementRepository.AddAsync(unitOfWork, measurement, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMeasurementLocation(
        string location,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(unitOfWork, measurementId, cancellationToken) ?? throw new InvalidOperationException("Measurement not found.");
        productMeasurement.Location = string.IsNullOrWhiteSpace(location)
            ? null
            : location.Trim();

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMeasurementManufactureCode(
        string manufactureCode,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(unitOfWork, measurementId, cancellationToken) ?? throw new InvalidOperationException("Measurement not found.");
        productMeasurement.UpdateManufactureCode(manufactureCode);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMeasurementMatchId(
        string? matchId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(unitOfWork, measurementId, cancellationToken) ?? throw new InvalidOperationException("Measurement not found.");
        if (!productMeasurement.ChangeMatchId(matchId))
        {
            return;
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMeasurementLotId(
        string? lotId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(unitOfWork, measurementId, cancellationToken) ?? throw new InvalidOperationException("Measurement not found.");
        productMeasurement.LotId = string.IsNullOrWhiteSpace(lotId) ? null : lotId.Trim();

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMeasurementState(
        MeasurementState state,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(unitOfWork, measurementId, cancellationToken) ?? throw new InvalidOperationException("Measurement not found.");
        productMeasurement.ChangeState(state);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteMeasurement(
        string measurementId,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        await using var transaction = await unitOfWork.BeginTransactionAsync(cancellationToken: cancellationToken);

        await _matchedPairDifferenceRepository.RemoveByMeasurementIds(
            unitOfWork,
            measurementIds: new HashSet<string> { measurementId },
            cancellationToken);

        await _productMeasurementRepository.RemoveAsync(unitOfWork, measurementId, cancellationToken);

        await transaction.CommitAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurementsView>> GetMeasurementInfos(
        Guid productId,
        IReadOnlyCollection<ProductState> productState,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken)
    {
        var result = await _measurementQueries.GetMeasurementInfosWithSimilarMeasurements(
            productId: productId,
            productStates: productState,
            measurementStates: measurementStates,
            cancellationToken: cancellationToken);

        return [.. result.Select(x => new MeasurementInfoWithSimilarMeasurementsView(
            Data: x,
            IsPublishedOnEbay: x.MeasurementInfo.LastTimeWatchedOnEbay > DateTimeOffset.UtcNow.AddDays(-7)
        ))];
    }

    public async Task<byte[]?> GetMeasurementFile(string measurementId, CancellationToken cancellationToken)
    {
        var zipBytes = await _measurementQueries.GetMeasurementInfoWithData(
            measurementId, cancellationToken);

        if (zipBytes == null)
        {
            return null;
        }

        var result = await _measurementFileParser.ToPrettifiedZip(zipBytes.Data, cancellationToken);

        return result;
    }

    public async Task<IReadOnlySet<string?>> GetLotIdsForProductAsync(Guid productId, CancellationToken cancellationToken) => await _measurementQueries.GetLotIds(productId, cancellationToken);
}
