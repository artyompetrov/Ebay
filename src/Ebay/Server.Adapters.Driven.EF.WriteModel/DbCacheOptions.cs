namespace Server.Adapters.Driven.EF.WriteModel;

/// <summary>
/// Настройки персистентного кеша. Привязаны к общей секции <c>EbayServer</c>, чтобы ключи конфигурации не менялись.
/// </summary>
public sealed record DbCacheOptions
{
    public const string SectionName = "EbayServer";

    /// <summary>
    /// При локальном запуске кеш не читается, значения всегда пересчитываются.
    /// </summary>
    public bool IsLocalRun { get; init; }
}
