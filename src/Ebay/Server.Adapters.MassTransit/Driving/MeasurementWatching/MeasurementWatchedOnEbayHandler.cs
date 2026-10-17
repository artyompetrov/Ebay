using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driving.Abstractions.Messages;
using Server.Application.Abstractions.Driving.Abstractions.Services;

namespace Server.Adapters.MassTransit.Driving.MeasurementWatching;

public sealed class MeasurementWatchedOnEbayHandler : IMeasurementWatchedOnEbayHandler
{
    private readonly ILogger<MeasurementWatchedOnEbayHandler> _logger;
    private readonly IMeasurementRepository _measurementRepository;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;

    public MeasurementWatchedOnEbayHandler(
        ILogger<MeasurementWatchedOnEbayHandler> logger,
        IMeasurementRepository measurementRepository,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory)
    {
        _logger = logger;
        _measurementRepository = measurementRepository;
        _unitOfWorkFactory = unitOfWorkFactory;
    }

    public async Task HandleAsync(MeasurementWatchedOnEbay message, CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var measurement = await _measurementRepository.GetByIdAsync(unitOfWork, message.MeasurementId, cancellationToken);

        if (measurement is null)
        {
            _logger.LogWarning(
                "Measurement with id {MeasurementId} not found while handling MeasurementWatchedOnEbay message",
                message.MeasurementId);
            return;
        }

        measurement.MarkWatchedOnEbay(message.WatchedAtUtc);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}