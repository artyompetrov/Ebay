namespace Client.Telemetry;

/// <summary>
/// Spans and log records waiting for export. Each queue keeps at most <see cref="MaxPendingItems"/> items and drops
/// the oldest beyond that; dropped items are counted and reported with the next successful export.
/// Deliberately process-wide and thread-safe: everything that records telemetry writes here.
/// </summary>
internal sealed class TelemetryBuffer
{
    public const int MaxPendingItems = 2048;

    private readonly Lock _lock = new();
    private readonly Queue<SpanData> _spans = new();
    private readonly Queue<LogData> _logs = new();
    private int _droppedSpans;
    private int _droppedLogs;

    public void Add(SpanData span)
    {
        lock (_lock)
        {
            _spans.Enqueue(span);
            if (_spans.Count > MaxPendingItems)
            {
                _spans.Dequeue();
                _droppedSpans++;
            }
        }
    }

    public void Add(LogData log)
    {
        lock (_lock)
        {
            _logs.Enqueue(log);
            if (_logs.Count > MaxPendingItems)
            {
                _logs.Dequeue();
                _droppedLogs++;
            }
        }
    }

    /// <summary>Takes everything pending, so overlapping exports never send the same item twice.</summary>
    public TelemetryBatch Drain()
    {
        lock (_lock)
        {
            var batch = new TelemetryBatch([.. _spans], [.. _logs]);
            _spans.Clear();
            _logs.Clear();
            return batch;
        }
    }

    public void CountDropped(int spans, int logs)
    {
        lock (_lock)
        {
            _droppedSpans += spans;
            _droppedLogs += logs;
        }
    }

    public (int Spans, int Logs) TakeDroppedCounts()
    {
        lock (_lock)
        {
            var counts = (_droppedSpans, _droppedLogs);
            _droppedSpans = 0;
            _droppedLogs = 0;
            return counts;
        }
    }
}
