using System.Diagnostics;

namespace Server.Application.SaleAdvertisements;

/// <summary>
/// Трассировка мониторинга объявлений о продаже: источник спанов, имена спанов и тегов.
/// </summary>
internal static class SaleAdvertisementsTracing
{
    public const string RunSpan = "sale-advertisements.run";
    public const string SourceSpan = "sale-advertisements.source";
    public const string AdvertisementSpan = "sale-advertisements.advertisement";
    public const string ContactSpan = "sale-advertisements.contact";
    public const string NotifySpan = "sale-advertisements.notify";

    public const string MarketplaceTag = "marketplace";
    public const string SellerKeyTag = "seller.key";
    public const string LinkTag = "link";
    public const string MatchesCountTag = "matches.count";
    public const string AdvertisementsCountTag = "advertisements.count";

    // Process-wide и потокобезопасен; без подписчика StartActivity возвращает null и почти ничего не стоит.
    public static readonly ActivitySource ActivitySource = new(WellKnown.SaleAdvertisements.ActivitySourceName);

    public static void MarkFailed(Activity? activity, Exception exception)
    {
        activity?.SetStatus(ActivityStatusCode.Error, exception.Message);
        activity?.AddException(exception);
    }

    public static void MarkFailed(Activity? activity, string error) => activity?.SetStatus(ActivityStatusCode.Error, error);
}
