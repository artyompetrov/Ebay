using Microsoft.Extensions.Logging;

namespace Client.Telemetry;

/// <summary>
/// Records log records at or above the served level for export, with the trace and span id of the span they were
/// written in (<see cref="FrontendTracer.CurrentContext"/>). The console provider keeps writing every record.
/// Never recorded: <c>System.Net.Http.HttpClient.*</c> (client spans cover the calls, and the records carry query
/// strings), the telemetry code itself (<c>Client.Telemetry.*</c>) and anything written while an export runs.
/// </summary>
internal sealed class TelemetryLoggerProvider : ILoggerProvider
{
    private static readonly string[] ExcludedCategoryPrefixes = ["System.Net.Http.HttpClient", "Client.Telemetry"];

    private readonly TelemetryBuffer _buffer;
    private readonly TelemetryLevel _level;
    private readonly FrontendTracer _tracer;
    private readonly TimeProvider _time;

    public TelemetryLoggerProvider(TelemetryBuffer buffer, TelemetryLevel level, FrontendTracer tracer, TimeProvider time)
    {
        _buffer = buffer;
        _level = level;
        _tracer = tracer;
        _time = time;
    }

    public ILogger CreateLogger(string categoryName) =>
        ExcludedCategoryPrefixes.Any(prefix => categoryName.StartsWith(prefix, StringComparison.Ordinal))
            ? Microsoft.Extensions.Logging.Abstractions.NullLogger.Instance
            : new TelemetryLogger(categoryName, this);

    public void Dispose()
    {
    }

    private void Record<TState>(string category, LogLevel level, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
    {
        if (!_level.Allows(level) || TelemetryExportScope.IsActive)
        {
            return;
        }

        var attributes = new List<KeyValuePair<string, object?>>();
        if (state is IEnumerable<KeyValuePair<string, object?>> properties)
        {
            attributes.AddRange(properties.Where(static p => p.Key != "{OriginalFormat}"));
        }

        if (exception is not null)
        {
            attributes.Add(new("exception.type", exception.GetType().FullName));
            attributes.Add(new("exception.message", exception.Message));
            attributes.Add(new("exception.stacktrace", exception.ToString()));
        }

        var context = _tracer.CurrentContext();
        _buffer.Add(new LogData(
            _time.GetUtcNow(),
            level,
            category,
            formatter(state, exception),
            context?.TraceId,
            context?.SpanId,
            attributes));
    }

    private sealed class TelemetryLogger : ILogger
    {
        private readonly string _category;
        private readonly TelemetryLoggerProvider _provider;

        public TelemetryLogger(string category, TelemetryLoggerProvider provider)
        {
            _category = category;
            _provider = provider;
        }

        public IDisposable? BeginScope<TState>(TState state)
            where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => _provider._level.Allows(logLevel);

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) =>
            _provider.Record(_category, logLevel, state, exception, formatter);
    }
}
