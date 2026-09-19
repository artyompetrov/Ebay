using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driving.Abstractions.Messages;
using Server.Application.Abstractions.Driving.Abstractions.Services;

namespace Server.Adapters.Driving.MassTransit.Consumers.MeasurementWatching;

public sealed class MeasurementWatchedOnEbayHandler : IMeasurementWatchedOnEbayHandler
{
    private readonly ILogger<MeasurementWatchedOnEbayHandler> _logger;
    private readonly IMeasurementRepository _measurementRepository;
    private readonly IWriteModelUnitOfWork _unitOfWork;

    public MeasurementWatchedOnEbayHandler(
        ILogger<MeasurementWatchedOnEbayHandler> logger,
        IMeasurementRepository measurementRepository,
        IWriteModelUnitOfWork unitOfWork)
    {
        _logger = logger;
        _measurementRepository = measurementRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task HandleAsync(MeasurementWatchedOnEbay message, CancellationToken cancellationToken)
    {
        var measurement = await _measurementRepository.GetByIdAsync(message.MeasurementId, cancellationToken);

        if (measurement is null)
        {
            _logger.LogWarning(
                "Measurement with id {MeasurementId} not found while handling MeasurementWatchedOnEbay message",
                message.MeasurementId);
            return;
        }

        measurement.MarkWatchedOnEbay(message.WatchedAtUtc);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}