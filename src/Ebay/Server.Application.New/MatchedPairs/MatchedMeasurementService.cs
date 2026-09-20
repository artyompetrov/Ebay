using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain.Exceptions;
using Server.Domain.Measurements;

namespace Server.Application.New.MatchedPairs;

public sealed class MatchedMeasurementService
{
    private readonly IMeasurementQueries _measurementQueries;
    private readonly ITubeWorkingPointQueries _tubeWorkingPointQueries;
    private readonly IMeasurementRepository _measurementRepository;
    private readonly IMatchedPairDifferenceRepository _matchedPairDifferenceRepository;
    private readonly IWriteModelUnitOfWork _unitOfWork;
    private readonly ILogger<MatchedMeasurementService> _logger;

    public MatchedMeasurementService(
        IMeasurementQueries measurementQueries,
        ITubeWorkingPointQueries tubeWorkingPointQueries,
        IMeasurementRepository measurementRepository,
        IMatchedPairDifferenceRepository matchedPairDifferenceRepository,
        IWriteModelUnitOfWork unitOfWork,
        ILogger<MatchedMeasurementService> logger)
    {
        _measurementQueries = measurementQueries;
        _tubeWorkingPointQueries = tubeWorkingPointQueries;
        _measurementRepository = measurementRepository;
        _matchedPairDifferenceRepository = matchedPairDifferenceRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task FindMatchedMeasurementsAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        var _ = await _tubeWorkingPointQueries.GetWorkingPointInfo(productId, cancellationToken) ?? throw new DomainException("Рабочая точка не задана.");
        await DeletePreviousResults(productId: productId, cancellationToken: cancellationToken);

        await RequestComparisons(productId: productId, cancellationToken: cancellationToken);
    }

    private async Task RequestComparisons(Guid productId, CancellationToken cancellationToken)
    {
        var unsoldMeasurements = (await _measurementQueries.GetMeasurementsInfo(
            productId: productId,
            measurementStates: [.. Enum.GetValues<MeasurementState>().Where(x => x != MeasurementState.Sold)],
            cancellationToken: cancellationToken)).Select(x => x.Id).ToHashSet();

        foreach (var measurementId1 in unsoldMeasurements)
        {
            var measurement1 = await _measurementRepository.GetByIdAsync(measurementId1, cancellationToken) ?? throw new InvalidOperationException($"Measurement {measurementId1} not found.");

            foreach (var measurementId2 in unsoldMeasurements)
            {
                measurement1.RequestMatchedPairComparison(measurementId2);
            }

            _logger.LogInformation(
                "Requesting {MessageType} for {MeasurementId1} against {MeasurementIds}",
                nameof(MatchedPairComparisonRequested),
                measurementId1,
                string.Join(",", unsoldMeasurements));
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }

    private async Task DeletePreviousResults(Guid productId, CancellationToken cancellationToken)
    {
        var measurementIds = (await _measurementQueries.GetMeasurementsInfo(
            productId: productId,
            measurementStates: Enum.GetValues<MeasurementState>(),
            cancellationToken: cancellationToken)).Select(x => x.Id).ToHashSet();

        _logger.LogInformation("Starting matching task for {ProductId}, {MeasurementIds}", productId, string.Join(",", measurementIds));

        await _matchedPairDifferenceRepository.RemoveByMeasurementIds(measurementIds, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
