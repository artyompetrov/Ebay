using System.Diagnostics;
using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.Abstractions.Driving.Models;
using Server.Domain.Errors;
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

    public async Task<OneOf<Success, DomainError>> SaveMeasurement(
        string measurementId,
        byte[] measurementsFile,
        ProductState productState,
        string manufactureCode,
        Guid productId,
        CancellationToken cancellationToken)
    {
        var created = ProductMeasurement.Create(
            id: measurementId,
            productId: productId,
            measurements: measurementsFile,
            manufactureCode: manufactureCode,
            productState: productState,
            measurementFileParser: _measurementFileParser
        );

        if (created.TryPickT1(out var error, out var measurement))
        {
            return error;
        }

        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        await _productMeasurementRepository.AddAsync(unitOfWork, measurement, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new Success();
    }

    public async Task<OneOf<Success, NotFound, DomainError>> UpdateMeasurementLocation(
        string location,
        string measurementId,
        CancellationToken cancellationToken) =>
        await UpdateMeasurementAsync(
            measurementId,
            measurement => measurement.ChangeLocation(location).MapT0(static _ => true),
            cancellationToken);

    public async Task<OneOf<Success, NotFound, DomainError>> UpdateMeasurementManufactureCode(
        string manufactureCode,
        string measurementId,
        CancellationToken cancellationToken) =>
        await UpdateMeasurementAsync(
            measurementId,
            measurement => measurement.UpdateManufactureCode(manufactureCode).MapT0(static _ => true),
            cancellationToken);

    public async Task<OneOf<Success, NotFound, DomainError>> UpdateMeasurementMatchId(
        string? matchId,
        string measurementId,
        CancellationToken cancellationToken) =>
        await UpdateMeasurementAsync(
            measurementId,
            measurement => measurement.ChangeMatchId(matchId),
            cancellationToken);

    public async Task<OneOf<Success, NotFound, DomainError>> UpdateMeasurementLotId(
        string? lotId,
        string measurementId,
        CancellationToken cancellationToken) =>
        await UpdateMeasurementAsync(
            measurementId,
            measurement => measurement.ChangeLotId(lotId).MapT0(static _ => true),
            cancellationToken);

    public async Task<OneOf<Success, NotFound>> UpdateMeasurementState(
        MeasurementState state,
        string measurementId,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(unitOfWork, measurementId, cancellationToken);
        if (productMeasurement is null)
        {
            return new NotFound();
        }

        productMeasurement.ChangeState(state);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new Success();
    }

    /// <summary>
    /// Loads the measurement and applies <paramref name="update"/> to it; commits only if the update succeeded
    /// and reported (<see langword="true"/>) that it changed the measurement.
    /// </summary>
    private async Task<OneOf<Success, NotFound, DomainError>> UpdateMeasurementAsync(
        string measurementId,
        Func<ProductMeasurement, OneOf<bool, DomainError>> update,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(unitOfWork, measurementId, cancellationToken);
        if (productMeasurement is null)
        {
            return new NotFound();
        }

        if (update(productMeasurement).TryPickT1(out var error, out var changed))
        {
            return error;
        }

        if (changed)
        {
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return new Success();
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

    public async Task<OneOf<byte[], NotFound>> GetMeasurementFile(string measurementId, CancellationToken cancellationToken)
    {
        var zipBytes = await _measurementQueries.GetMeasurementInfoWithData(
            measurementId, cancellationToken);

        if (zipBytes == null)
        {
            return new NotFound();
        }

        var result = await _measurementFileParser.ToPrettifiedZip(zipBytes.Data, cancellationToken);

        // Stored measurements were validated by the same parser on upload.
        return result.Match<OneOf<byte[], NotFound>>(
            static zip => zip,
            error => throw new UnreachableException($"Stored measurement {measurementId} no longer parses: {error.Message}"));
    }

    public async Task<IReadOnlySet<string?>> GetLotIdsForProductAsync(Guid productId, CancellationToken cancellationToken) => await _measurementQueries.GetLotIds(productId, cancellationToken);
}
