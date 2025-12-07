using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions;
using Server.Application.Abstractions.Repositories;

namespace Server.Application.Consumers.MeasurementWatching;

internal sealed class MeasurementWatchedOnEbayConsumer : IConsumer<MeasurementWatchedOnEbay>
{
    private readonly ILogger<MeasurementWatchedOnEbayConsumer> _logger;
    private readonly IMeasurementRepository _measurementRepository;
    private readonly IUnitOfWork _unitOfWork;

    public MeasurementWatchedOnEbayConsumer(
        ILogger<MeasurementWatchedOnEbayConsumer> logger,
        IMeasurementRepository measurementRepository,
        IUnitOfWork unitOfWork)
    {
        _logger = logger;
        _measurementRepository = measurementRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task Consume(ConsumeContext<MeasurementWatchedOnEbay> context)
    {
        var measurement = await _measurementRepository.GetByIdAsync(
            context.Message.MeasurementId,
            context.CancellationToken);

        if (measurement is null)
        {
            _logger.LogWarning(
                "Measurement with id {MeasurementId} not found while handling MeasurementWatchedOnEbay message",
                context.Message.MeasurementId);
            return;
        }

        measurement.MarkWatchedOnEbay(context.Message.WatchedAtUtc);

        _ = await _unitOfWork.SaveChangesAsync(context.CancellationToken);
    }
}

public record MeasurementWatchedOnEbay(string MeasurementId, DateTime WatchedAtUtc);