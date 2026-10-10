using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Domain.Measurements;

namespace Server.Application.MeasurementCaching;

/// <summary>
/// Обрабатывает событие изменения статуса замера, протухивая закешированные фото/миниатюры и графики этого замера.
/// </summary>
public sealed class MeasurementStateChangedHandler : IMeasurementStateChangedHandler
{
    private readonly IMeasurementContentCacheAdapter _cache;

    public MeasurementStateChangedHandler(IMeasurementContentCacheAdapter cache)
    {
        _cache = cache;
    }

    public Task HandleAsync(MeasurementStateChanged message, CancellationToken cancellationToken)
    {
        _cache.Invalidate(message.MeasurementId);
        return Task.CompletedTask;
    }
}
