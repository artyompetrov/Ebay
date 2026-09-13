using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.New.Caching;
using Server.Domain.Measurements;

namespace Server.Application.New.MeasurementCaching;

/// <summary>
/// Обрабатывает событие изменения статуса замера, протухивая закешированные фото/миниатюры и графики этого замера.
/// </summary>
public sealed class MeasurementStateChangedHandler : IMeasurementStateChangedHandler
{
    private readonly MeasurementCacheInvalidationRegistry _cacheInvalidationRegistry;

    public MeasurementStateChangedHandler(MeasurementCacheInvalidationRegistry cacheInvalidationRegistry)
    {
        _cacheInvalidationRegistry = cacheInvalidationRegistry;
    }

    public Task HandleAsync(MeasurementStateChanged message, CancellationToken cancellationToken)
    {
        _cacheInvalidationRegistry.Invalidate(message.MeasurementId);
        return Task.CompletedTask;
    }
}
