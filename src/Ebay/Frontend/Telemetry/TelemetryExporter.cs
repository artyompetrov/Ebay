using System.Diagnostics;
using System.Net.Http;
using Client.Clients.Generated;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;
using Microsoft.Extensions.Logging;

namespace Client.Telemetry;

/// <summary>
/// Posts pending telemetry to the backend relay every <see cref="ExportInterval"/>, or at once when the tab is
/// hidden (<see cref="RequestFlush"/>): spans first, then the log records at or above the served level, in batches
/// below 1 MiB. Without a token, or on any failure, a batch is dropped and counted, never retried; the counts are
/// reported as a Warning record with the next successful export. Export calls carry no trace context.
/// </summary>
internal sealed class TelemetryExporter
{
    public static readonly TimeSpan ExportInterval = TimeSpan.FromSeconds(2);

    private readonly TelemetryBuffer _buffer;
    private readonly TelemetryIdentity _identity;
    private readonly ClientTelemetrySettingsSource _settings;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly BrowserTelemetryCollector _collector;
    private readonly TimeProvider _time;
    private readonly ILogger<TelemetryExporter> _logger;
    private TaskCompletionSource _flushRequested = new(TaskCreationOptions.RunContinuationsAsynchronously);

    public TelemetryExporter(
        TelemetryBuffer buffer,
        TelemetryIdentity identity,
        ClientTelemetrySettingsSource settings,
        IHttpClientFactory httpClientFactory,
        BrowserTelemetryCollector collector,
        TimeProvider time,
        ILogger<TelemetryExporter> logger)
    {
        _buffer = buffer;
        _identity = identity;
        _settings = settings;
        _httpClientFactory = httpClientFactory;
        _collector = collector;
        _time = time;
        _logger = logger;
    }

    /// <summary>Exports on every tick and every flush request until <paramref name="cancellationToken"/> is cancelled.</summary>
    public async Task RunAsync(CancellationToken cancellationToken)
    {
        using var timer = new PeriodicTimer(ExportInterval, _time);
        Task<bool>? tick = null;
        while (true)
        {
            tick ??= timer.WaitForNextTickAsync(cancellationToken).AsTask();
            var completed = await Task.WhenAny(tick, _flushRequested.Task);
            if (completed == tick)
            {
                if (!await tick)
                {
                    return;
                }

                tick = null;
            }
            else
            {
                Interlocked.Exchange(ref _flushRequested, new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously));
            }

            _collector.Collect();
            try
            {
                await ExportAsync(cancellationToken);
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                // Telemetry must never break the app: log to the console only (Client.Telemetry is not exported).
                _logger.LogWarning(exception, "Telemetry export failed");
            }
        }
    }

    /// <summary>Starts an export now instead of waiting for the next tick.</summary>
    public void RequestFlush() => _flushRequested.TrySetResult();

    /// <summary>Exports everything pending once.</summary>
    public async Task ExportAsync(CancellationToken cancellationToken)
    {
        // Both end with this method: nothing this export writes is recorded, and nothing it sends carries a trace context.
        TelemetryExportScope.Enter();
        Activity.Current = null;

        var pending = _buffer.Drain();
        var droppedSpans = await SendAsync(TelemetrySignal.Traces, pending.Spans, OtlpJsonSerializer.SerializeSpans, cancellationToken);
        var minLevel = await _settings.GetMinLevelAsync(cancellationToken);
        await ReportDroppedAsync(cancellationToken);
        var logs = pending.Logs.Where(log => log.Level >= minLevel).ToArray();
        var droppedLogs = await SendAsync(TelemetrySignal.Logs, logs, OtlpJsonSerializer.SerializeLogs, cancellationToken);
        _buffer.CountDropped(droppedSpans, droppedLogs);
    }

    private async Task ReportDroppedAsync(CancellationToken cancellationToken)
    {
        var (spans, logs) = _buffer.TakeDroppedCounts();
        if (spans + logs == 0)
        {
            return;
        }

        var report = new LogData(
            _time.GetUtcNow(),
            LogLevel.Warning,
            typeof(TelemetryExporter).FullName ?? nameof(TelemetryExporter),
            $"Telemetry dropped {spans} spans and {logs} log records",
            TraceId: null,
            SpanId: null,
            [new("telemetry.dropped_spans", spans), new("telemetry.dropped_logs", logs)]);
        if (await SendAsync(TelemetrySignal.Logs, [report], OtlpJsonSerializer.SerializeLogs, cancellationToken) > 0)
        {
            _buffer.CountDropped(spans, logs);
        }
    }

    /// <summary>Posts the items in batches; returns how many items were dropped.</summary>
    private async Task<int> SendAsync<T>(
        TelemetrySignal signal,
        IReadOnlyList<T> items,
        Func<TelemetryIdentity, IReadOnlyList<T>, byte[]> serialize,
        CancellationToken cancellationToken)
    {
        var (batches, dropped) = TelemetryBatches.Split(items, batch => serialize(_identity, batch), TelemetryBatches.MaxBatchBytes);
        foreach (var batch in batches)
        {
            if (!await PostAsync(signal, batch.Body, cancellationToken))
            {
                dropped += batch.ItemCount;
            }
        }

        return dropped;
    }

    private async Task<bool> PostAsync(TelemetrySignal signal, byte[] body, CancellationToken cancellationToken)
    {
        var client = new WebApiClient(_httpClientFactory.CreateClient(TelemetryHttpClient.Name));
        using var stream = new MemoryStream(body, writable: false);
        try
        {
            await (signal switch
            {
                TelemetrySignal.Traces => client.ExportClientTracesAsync(stream, cancellationToken),
                TelemetrySignal.Logs => client.ExportClientLogsAsync(stream, cancellationToken),
                _ => throw new UnreachableException($"Unknown telemetry signal {signal}.")
            });
            return true;
        }
        catch (AccessTokenNotAvailableException)
        {
            // No token: the batch is dropped and no login starts (Redirect() is never called).
            return false;
        }
        catch (ApiException)
        {
            return false;
        }
        catch (HttpRequestException)
        {
            return false;
        }
    }
}
