using Microsoft.Extensions.Logging;

namespace Client.Telemetry;

/// <summary>
/// The minimum level of exported log records, as last served by the backend (<c>Debug</c> until then).
/// Deliberately process-wide: the logger provider reads it on every record, the settings source updates it.
/// </summary>
internal sealed class TelemetryLevel
{
    private volatile int _minLevel = (int)LogLevel.Debug;

    public LogLevel MinLevel => (LogLevel)_minLevel;

    public bool Allows(LogLevel level) => level != LogLevel.None && level >= MinLevel;

    public void Set(LogLevel level) => _minLevel = (int)level;
}
