using Microsoft.Extensions.Logging;
using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain.Errors;
using Server.Domain.Measurements;

namespace Server.Application.MatchedPairs;

public sealed class MatchedMeasurementService
{
    private readonly IMeasurementQueries _measurementQueries;
    private readonly ITubeWorkingPointQueries _tubeWorkingPointQueries;
    private readonly IMeasurementRepository _measurementRepository;
    private readonly IMatchedPairDifferenceRepository _matchedPairDifferenceRepository;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;
    private readonly ILogger<MatchedMeasurementService> _logger;

    public MatchedMeasurementService(
        IMeasurementQueries measurementQueries,
        ITubeWorkingPointQueries tubeWorkingPointQueries,
        IMeasurementRepository measurementRepository,
        IMatchedPairDifferenceRepository matchedPairDifferenceRepository,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        ILogger<MatchedMeasurementService> logger)
    {
        _measurementQueries = measurementQueries;
        _tubeWorkingPointQueries = tubeWorkingPointQueries;
        _measurementRepository = measurementRepository;
        _matchedPairDifferenceRepository = matchedPairDifferenceRepository;
        _unitOfWorkFactory = unitOfWorkFactory;
        _logger = logger;
    }

    /// <summary>
    /// Restarts matched-pair search for all unsold measurements of the product.
    /// </summary>
    /// <returns><see cref="DomainError"/>, if the product has no tube working point to compare measurements at.</returns>
    public async Task<OneOf<Success, DomainError>> FindMatchedMeasurementsAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        if (await _tubeWorkingPointQueries.GetWorkingPointInfo(productId, cancellationToken) is null)
        {
            return new DomainError("Рабочая точка не задана.");
        }

        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        await DeletePreviousResults(unitOfWork: unitOfWork, productId: productId, cancellationToken: cancellationToken);

        await RequestComparisons(unitOfWork: unitOfWork, productId: productId, cancellationToken: cancellationToken);

        return new Success();
    }

    private async Task RequestComparisons(IWriteModelUnitOfWork unitOfWork, Guid productId, CancellationToken cancellationToken)
    {
        var unsoldMeasurements = (await _measurementQueries.GetMeasurementsInfo(
            productId: productId,
            measurementStates: [.. Enum.GetValues<MeasurementState>().Where(x => x != MeasurementState.Sold)],
            cancellationToken: cancellationToken)).Select(x => x.Id).ToHashSet();

        foreach (var measurementId1 in unsoldMeasurements)
        {
            var measurement1 = await _measurementRepository.GetByIdAsync(unitOfWork, measurementId1, cancellationToken);
            if (measurement1 is null)
            {
                // Deleted after the measurement list was read: there is nothing left to compare.
                continue;
            }

            foreach (var measurementId2 in unsoldMeasurements)
            {
                measurement1.RequestMatchedPairComparison(measurementId2);
            }

            _logger.LogInformation(
                "Requesting {MessageType} for {MeasurementId1} against {MeasurementIds}",
                nameof(MatchedPairComparisonRequested),
                measurementId1,
                string.Join(",", unsoldMeasurements));
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }

    private async Task DeletePreviousResults(IWriteModelUnitOfWork unitOfWork, Guid productId, CancellationToken cancellationToken)
    {
        var measurementIds = (await _measurementQueries.GetMeasurementsInfo(
            productId: productId,
            measurementStates: Enum.GetValues<MeasurementState>(),
            cancellationToken: cancellationToken)).Select(x => x.Id).ToHashSet();

        _logger.LogInformation("Starting matching task for {ProductId}, {MeasurementIds}", productId, string.Join(",", measurementIds));

        await _matchedPairDifferenceRepository.RemoveByMeasurementIds(unitOfWork, measurementIds, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
