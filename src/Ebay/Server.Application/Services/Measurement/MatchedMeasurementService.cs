using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions;
using Server.Application.Abstractions.Queries;
using Server.Application.Abstractions.Repositories;
using Server.Application.Consumers.MatchedPairs;
using Server.Application.Controllers;
using Server.Domain.Measurements;

namespace Server.Application.Services.Measurement;

internal class MatchedMeasurementService
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly ITubeWorkingPointQueries _tubeWorkingPointQueries;
    private readonly IMatchedPairDifferenceRepository _matchedPairDifferenceRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<MatchedMeasurementService> _logger;

    public MatchedMeasurementService(
        IPublishEndpoint publishEndpoint,
        IMeasurementQueries measurementQueries,
        ITubeWorkingPointQueries tubeWorkingPointQueries,
        IMatchedPairDifferenceRepository matchedPairDifferenceRepository,
        IUnitOfWork unitOfWork,
        ILogger<MatchedMeasurementService> logger)
    {
        _publishEndpoint = publishEndpoint;
        _measurementQueries = measurementQueries;
        _tubeWorkingPointQueries = tubeWorkingPointQueries;
        _matchedPairDifferenceRepository = matchedPairDifferenceRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    
    public async Task FindMatchedMeasurementsAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        _ = await _tubeWorkingPointQueries.GetWorkingPointInfo(productId, cancellationToken) ?? throw NonOkHttpAnswerException.ValidationError400(
                field: "tubeWorkingPoint",
                errors: "Рабочая точка не задана.");
        await DeletePreviousResults(productId: productId, cancellationToken: cancellationToken);

        await EnqueueCommands(productId: productId, cancellationToken: cancellationToken);
    }

    private async Task EnqueueCommands(Guid productId, CancellationToken cancellationToken)
    {
        var unsoldMeasurements = (await _measurementQueries.GetMeasurementsInfo(
            productId: productId,
            measurementStates: [.. Enum.GetValues<MeasurementState>().Where(x => x != MeasurementState.Sold)],
            cancellationToken: cancellationToken)).Select(x => x.Id).ToHashSet();

        foreach (var measurementId1 in unsoldMeasurements)
        {
            var measurements = new List<string>();
            foreach (var measurementId2 in unsoldMeasurements)
            {
                var message = new CalculateMatchedPair(
                    MeasurementId1: measurementId1,
                    MeasurementId2: measurementId2);

                await _publishEndpoint.Publish(
                    message: message,
                    cancellationToken: cancellationToken);

                measurements.Add(message.ToString());
            }
            _logger.LogInformation("Publishing {MessageType}, {MessageIds}", nameof(CalculateMatchedPair), string.Join(",", measurements));
            _ = await _unitOfWork.SaveChangesAsync(cancellationToken);
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

        _ = await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}