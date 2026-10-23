using Microsoft.Extensions.Logging;

namespace Tests.Unit.Fakes;

/// <summary>
/// Логгер, запоминающий уровни и тексты записанных сообщений, чтобы тест мог проверить наличие предупреждений.
/// </summary>
internal sealed class RecordingLogger<T> : ILogger<T>
{
    private readonly List<LogLevel> _levels = [];
    private readonly List<(LogLevel Level, string Message)> _messages = [];

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

    public bool HasWarningContaining(string text) => HasMessageContaining(LogLevel.Warning, text);

    public bool HasErrorContaining(string text) => HasMessageContaining(LogLevel.Error, text);

    private bool HasMessageContaining(LogLevel level, string text)
    {
        lock (_levels)
        {
            return _messages.Exists(x => x.Level == level && x.Message.Contains(text, StringComparison.Ordinal));
        }
    }

    IDisposable? ILogger.BeginScope<TState>(TState state) => null;

    bool ILogger.IsEnabled(LogLevel logLevel) => true;

    void ILogger.Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
    {
        lock (_levels)
        {
            _levels.Add(logLevel);
            _messages.Add((logLevel, formatter(state, exception)));
        }
    }
}
