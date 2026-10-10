using Server.Application.Abstractions.Driven.Abstractions;

namespace Tests.Unit.Fakes;

/// <summary>
/// Фейк порта процессного кеша: хранит записи в словаре и запоминает, какие замеры и ключи инвалидированы.
/// Реальная политика вытеснения проверяется тестами адаптера Server.Adapters.Driven.MemoryCache.
/// </summary>
internal sealed class InMemoryMeasurementContentCache : IMeasurementContentCacheAdapter
{
    private readonly Dictionary<string, (string MeasurementId, object Value)> _entries = new(StringComparer.Ordinal);

    public List<string> RequestedKeys { get; } = [];

    public List<string> InvalidatedMeasurementIds { get; } = [];

    public async Task<T?> GetOrCreateAsync<T>(
        string measurementId,
        string key,
        Func<Task<T?>> factory,
        Func<T, long> sizeSelector)
        where T : class
    {
        RequestedKeys.Add(key);
        if (_entries.TryGetValue(key, out var cached))
        {
            return (T)cached.Value;
        }

        var value = await factory();
        if (value is not null)
        {
            _entries[key] = (measurementId, value);
        }

        return value;
    }

    public void Remove(string key) => _entries.Remove(key);

    public void Invalidate(string measurementId)
    {
        InvalidatedMeasurementIds.Add(measurementId);
        foreach (var key in _entries.Where(x => x.Value.MeasurementId == measurementId).Select(static x => x.Key).ToArray())
        {
            _entries.Remove(key);
        }
    }
}
