namespace Server.Application.New.Services;

/// <summary>
/// Настройки фоновых сценариев application-слоя.
/// </summary>
public interface IBackgroundTaskSettings
{
    /// <summary>
    /// Признак локального запуска.
    /// </summary>
    bool IsLocalRun { get; }

    /// <summary>
    /// Целевой email для уведомлений.
    /// </summary>
    string TargetEmail { get; }
}
