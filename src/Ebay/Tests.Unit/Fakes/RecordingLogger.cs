using Microsoft.Extensions.Logging;

namespace Tests.Unit.Fakes;

/// <summary>
/// Логгер, запоминающий уровни записанных сообщений, чтобы тест мог проверить наличие предупреждений.
/// </summary>
internal sealed class RecordingLogger<T> : ILogger<T>
{
    private readonly List<LogLevel> _levels = [];

    public bool HasWarning
    {
        get
        {
            lock (_levels)
            {
                return _levels.Contains(LogLevel.Warning);
            }
        }
    }

    IDisposable? ILogger.BeginScope<TState>(TState state) => null;

    bool ILogger.IsEnabled(LogLevel logLevel) => true;

    void ILogger.Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
    {
        lock (_levels)
        {
            _levels.Add(logLevel);
        }
    }
}
