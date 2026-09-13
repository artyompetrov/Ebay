using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.New.Caching;
using Server.Domain.Measurements;

namespace Server.Application.New.MeasurementCaching;

/// <summary>
/// Обрабатывает событие изменения matched pair замера, протухивая закешированные графики этого замера.
/// </summary>
public sealed class MeasurementMatchIdChangedHandler : IMeasurementMatchIdChangedHandler
{
    private readonly MeasurementCacheInvalidationRegistry _cacheInvalidationRegistry;
    private readonly IMeasurementQueries _measurementQueries;

    /// <summary>
    /// Создает обработчик события изменения matched pair замера.
    /// </summary>
    /// <param name="cacheInvalidationRegistry">Реестр токенов протухания кеша по измерению.</param>
    /// <param name="measurementQueries">Запросы чтения замеров.</param>
    public MeasurementMatchIdChangedHandler(
        MeasurementCacheInvalidationRegistry cacheInvalidationRegistry,
        IMeasurementQueries measurementQueries)
    {
        _cacheInvalidationRegistry = cacheInvalidationRegistry;
        _measurementQueries = measurementQueries;
    }

    /// <inheritdoc />
    public async Task HandleAsync(MeasurementMatchIdChanged message, CancellationToken cancellationToken)
    {
        var affectedMeasurementIds = new HashSet<string>(StringComparer.Ordinal)
        {
            message.MeasurementId
        };

        var affectedMatchIds = new[] { message.OldMatchId, message.NewMatchId }
            .Where(static matchId => !string.IsNullOrWhiteSpace(matchId))
            .Select(static matchId => matchId!)
            .ToHashSet(StringComparer.Ordinal);

        if (affectedMatchIds.Count > 0)
        {
            var matchedMeasurementIds = await _measurementQueries.GetMeasurementIdsByMatchIds(
                affectedMatchIds,
                cancellationToken);

            affectedMeasurementIds.UnionWith(matchedMeasurementIds);
        }

        foreach (var measurementId in affectedMeasurementIds)
        {
            _cacheInvalidationRegistry.Invalidate(measurementId);
        }
    }
}
