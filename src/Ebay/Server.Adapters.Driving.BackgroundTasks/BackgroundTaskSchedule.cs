namespace Server.Adapters.Driving.BackgroundTasks;

public static class BackgroundTaskSchedule
{
    public static readonly TimeSpan CurrencyUpdateTime = TimeSpan.FromHours(12);
    public static readonly TimeSpan ChipfindUpdateTime = TimeSpan.FromMinutes(20);
    public static readonly TimeSpan SaleAdvertisementCleanupUpdateTime = TimeSpan.FromDays(1);
    public static readonly TimeSpan ErrorDelay = TimeSpan.FromMinutes(5);
}
