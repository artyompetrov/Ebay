using Microsoft.Extensions.Logging;

namespace Tests.Unit.Fakes;

/// <summary>
/// Провайдер логов, запоминающий тексты всех записей всех категорий (с текстом исключения).
/// </summary>
internal sealed class RecordingLoggerProvider : ILoggerProvider
{
    private readonly List<string> _records = [];

    public IReadOnlyList<string> Records
    {
        get
        {
            lock (_records)
            {
                return [.. _records];
            }
        }
    }

    public ILogger CreateLogger(string categoryName) => new Logger(this, categoryName);

    public void Dispose()
    {
    }

    private void Add(string record)
    {
        lock (_records)
        {
            _records.Add(record);
        }
    }

    private sealed class Logger : ILogger
    {
        private readonly RecordingLoggerProvider _provider;
        private readonly string _category;

        public Logger(RecordingLoggerProvider provider, string category)
        {
            _provider = provider;
            _category = category;
        }

        public IDisposable? BeginScope<TState>(TState state)
            where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) =>
            _provider.Add($"{logLevel} {_category}: {formatter(state, exception)} {exception}");
    }
}
