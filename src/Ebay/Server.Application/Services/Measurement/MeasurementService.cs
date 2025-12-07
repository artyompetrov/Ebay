using Server.Application.Abstractions;
using Server.Application.Abstractions.Queries;
using Server.Application.Abstractions.Repositories;
using Server.Application.Abstractions.Services;
using Server.Domain.Measurements;

namespace Server.Application.Services.Measurement;

internal class MeasurementService : IMeasurementService
{
    private readonly IMeasurementRepository _productMeasurementRepository;
    private readonly IMatchedPairDifferenceRepository _matchedPairDifferenceRepository;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IMeasurementFileParser _measurementFileParser;
    private readonly IUnitOfWork _unitOfWork;


    public MeasurementService(
        IMeasurementRepository productMeasurementRepository,
        IMatchedPairDifferenceRepository matchedPairDifferenceRepository,
        IMeasurementQueries measurementQueries,
        IMeasurementFileParser measurementFileParser,
        IUnitOfWork unitOfWork
    )
    {
        _productMeasurementRepository = productMeasurementRepository;
        _matchedPairDifferenceRepository = matchedPairDifferenceRepository;
        _measurementQueries = measurementQueries;
        _measurementFileParser = measurementFileParser;
        _unitOfWork = unitOfWork;
    }


    public async Task SaveMeasurement(
        string measurementId,
        byte[] measurementsFile,
        ProductState productState,
        string manufactureCode,
        Guid productId,
        CancellationToken cancellationToken)
    {
        var measurement = ProductMeasurement.Create(
            id: measurementId,
            productId: productId,
            measurements: measurementsFile,
            manufactureCode: manufactureCode,
            productState: productState,
            measurementFileParser: _measurementFileParser
        );

        await _productMeasurementRepository.SaveAsync(measurement, cancellationToken);

        _ = await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMeasurementLocation(
        string location,
        string measurementId,
        CancellationToken cancellationToken)
    {
        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken) ?? throw new InvalidOperationException("Measurement not found.");
        productMeasurement.Location = string.IsNullOrWhiteSpace(location)
            ? null
            : location.Trim();

        _ = await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMeasurementManufactureCode(
        string manufactureCode,
        string measurementId,
        CancellationToken cancellationToken)
    {
        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken) ?? throw new InvalidOperationException("Measurement not found.");
        productMeasurement.UpdateManufactureCode(manufactureCode);

        _ = await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMeasurementMatchId(
        string? matchId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken) ?? throw new InvalidOperationException("Measurement not found.");
        productMeasurement.MatchId = string.IsNullOrWhiteSpace(matchId)
            ? null
            : matchId.Trim();

        _ = await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMeasurementLotId(
        string? lotId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken) ?? throw new InvalidOperationException("Measurement not found.");
        productMeasurement.LotId = string.IsNullOrWhiteSpace(lotId) ? null : lotId.Trim();

        _ = await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMeasurementState(
        MeasurementState state,
        string measurementId,
        CancellationToken cancellationToken)
    {
        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken) ?? throw new InvalidOperationException("Measurement not found.");
        productMeasurement.MeasurementState = state;

        _ = await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteMeasurement(
        string measurementId,
        CancellationToken cancellationToken)
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken: cancellationToken);

        await _matchedPairDifferenceRepository.RemoveByMeasurementIds(
            measurementIds: new HashSet<string> { measurementId },
            cancellationToken);
        await _productMeasurementRepository.RemoveAsync(measurementId, cancellationToken);

        await transaction.CommitAsync(cancellationToken);
    }

    public Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfos(
        Guid productId,
        IReadOnlyCollection<ProductState> productState,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken)
    {
        return _measurementQueries.GetMeasurementInfosWithSimilarMeasurements(
            productId, productState, measurementStates, cancellationToken);
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