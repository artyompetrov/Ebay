using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Domain.Measurements;

namespace Server.Application.MeasurementCaching;

/// <summary>
/// Обрабатывает событие изменения matched pair замера, протухивая закешированные графики этого замера.
/// </summary>
public sealed class MeasurementMatchIdChangedHandler : IMeasurementMatchIdChangedHandler
{
    private readonly IMeasurementContentCacheAdapter _cache;
    private readonly IMeasurementQueries _measurementQueries;

    /// <summary>
    /// Создает обработчик события изменения matched pair замера.
    /// </summary>
    /// <param name="cache">Процессный кеш значений, привязанных к замеру.</param>
    /// <param name="measurementQueries">Запросы чтения замеров.</param>
    public MeasurementMatchIdChangedHandler(
        IMeasurementContentCacheAdapter cache,
        IMeasurementQueries measurementQueries)
    {
        _cache = cache;
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
            _cache.Invalidate(measurementId);
        }
    }
}
