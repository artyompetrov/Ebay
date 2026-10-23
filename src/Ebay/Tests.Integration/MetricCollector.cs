using System.Collections.Concurrent;
using OpenTelemetry;
using OpenTelemetry.Metrics;

namespace Tests.Integration;

/// <summary>
/// Exporter behind a manually collected reader added to the test host's meter provider. Metric points are
/// cumulative and shared by all tests, so every collection returns all of them, and tests look only for their own
/// measurements (their own route, instrument name or marker value).
/// </summary>
public sealed class MetricCollector : BaseExporter<Metric>
{
    private readonly ConcurrentQueue<CollectedMetricPoint> _points = new();
    private readonly Lock _collectLock = new();

    public MetricCollector()
    {
        Reader = new BaseExportingMetricReader(this);
    }

    /// <summary>Reader to add to the meter provider; <see cref="Collect"/> pulls the current values through it.</summary>
    public MetricReader Reader { get; }

    public override ExportResult Export(in Batch<Metric> batch)
    {
        foreach (var metric in batch)
        {
            foreach (ref readonly var point in metric.GetMetricPoints())
            {
                var tags = new Dictionary<string, object?>();
                foreach (var tag in point.Tags)
                {
                    tags[tag.Key] = tag.Value;
                }

                _points.Enqueue(new CollectedMetricPoint(metric.MeterName, metric.Name, tags));
            }
        }

        return ExportResult.Success;
    }

    /// <summary>Collects the current values of every instrument and returns the points of this collection.</summary>
    public CollectedMetricPoint[] Collect()
    {
        // The reader exports only when collected, so one collection at a time keeps the points of different
        // collections apart.
        lock (_collectLock)
        {
            _points.Clear();
            Reader.Collect();
            return [.. _points];
        }
    }
}
