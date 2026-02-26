namespace Server.Application.New.BackgroundTasks;

/// <summary>
/// Периоды и параметры фоновых сценариев.
/// </summary>
public static class BackgroundTaskSchedule
{
    /// <summary>
    /// Интервал обновления курсов валют.
    /// </summary>
    public static readonly TimeSpan CurrencyUpdateTime = TimeSpan.FromHours(12);

    /// <summary>
    /// Интервал опроса объявлений Chipfind.
    /// </summary>
    public static readonly TimeSpan ChipfindUpdateTime = TimeSpan.FromMinutes(20);

    /// <summary>
    /// Интервал очистки устаревших объявлений.
    /// </summary>
    public static readonly TimeSpan SaleAdvertisementCleanupUpdateTime = TimeSpan.FromDays(1);

    /// <summary>
    /// Задержка перед повтором при ошибке фонового сценария.
    /// </summary>
    public static readonly TimeSpan ErrorDelay = TimeSpan.FromMinutes(5);

    /// <summary>
    /// Базовая валюта для загрузки курсов.
    /// </summary>
    public const string CurrencyBase = "USD";

    /// <summary>
    /// Ключ OpenExchangeRates.
    /// </summary>
    public const string OpenExchangeRatesAppId = "2d0b695db0cb4dbab40a85a91a88bd24";

    /// <summary>
    /// Имя маркетплейса Chipfind в записях истории отправок.
    /// </summary>
    public const string ChipfindMarketplace = "Chipfind";

    /// <summary>
    /// Порог устаревания объявлений.
    /// </summary>
    public static readonly TimeSpan RemoveAdvertisementAfter = TimeSpan.FromDays(90);
}
