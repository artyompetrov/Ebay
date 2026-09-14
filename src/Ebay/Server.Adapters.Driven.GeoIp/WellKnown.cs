namespace Server.Adapters.Driven.GeoIp;

internal static class WellKnown
{
    /// <summary>
    /// Ключ keyed-регистрации выделенного IMemoryCache для этого адаптера.
    /// Значение должно совпадать со значением, которым этот кеш регистрируется в Program.cs.
    /// </summary>
    public const string CacheServiceKey = "geoip-cache";

    public static readonly IReadOnlyCollection<string> ExcludeCountries = ["Russia", "Kazakhstan"];
}