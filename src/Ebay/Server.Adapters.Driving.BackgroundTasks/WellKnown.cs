namespace Server.Adapters.Driving.BackgroundTasks;

/// <summary>
/// Расписание фоновых задач: период запуска и задержка повтора после ошибки.
/// </summary>
internal static class WellKnown
{
    public static class CurrencyRate
    {
        public static readonly TimeSpan UpdateTime = TimeSpan.FromHours(12);
        public static readonly TimeSpan ErrorDelay = TimeSpan.FromMinutes(5);
    }

    public static class SaleAdvertisementMonitoring
    {
        public static readonly TimeSpan UpdateTime = TimeSpan.FromMinutes(20);
        public static readonly TimeSpan ErrorDelay = TimeSpan.FromMinutes(5);
    }

    public static class SaleAdvertisements
    {
        public static readonly TimeSpan UpdateTime = TimeSpan.FromDays(1);
        public static readonly TimeSpan ErrorDelay = TimeSpan.FromMinutes(5);
    }
}
