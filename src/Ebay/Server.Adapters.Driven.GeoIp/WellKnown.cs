namespace Server.Adapters.Driven.GeoIp;

internal static class WellKnown
{
    /// <summary>
    /// Ключ keyed-регистрации выделенного IMemoryCache для этого адаптера.
    /// </summary>
    public const string CacheServiceKey = "geoip-cache";

    public static readonly IReadOnlyCollection<string> ExcludeCountries = ["Russia", "Kazakhstan"];
}