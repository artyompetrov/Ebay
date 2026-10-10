namespace Server.Adapters.Driving.BackgroundTasks;

/// <summary>
/// Настройки фоновых задач. Привязаны к общей секции <c>EbayServer</c>, чтобы ключи конфигурации не менялись.
/// </summary>
public sealed record BackgroundTasksOptions
{
    public const string SectionName = "EbayServer";

    /// <summary>
    /// Отключает фоновые задачи, которые работают только на сервере.
    /// </summary>
    public bool IsLocalRun { get; init; } = true;

    /// <summary>
    /// Адрес, на который отправляются уведомления о новых объявлениях о продаже.
    /// </summary>
    public string TargetEmail { get; init; } = string.Empty;
}
