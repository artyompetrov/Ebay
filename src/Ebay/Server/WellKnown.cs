namespace Server;

public static class WellKnown
{
    public static class ChromeExtension
    {
        public const string Id = "mlebgdemjnpnfgcgbbncllpniiicffbm";
        public const string ClientId = "Ebay.ChromeExtension";
    }

    public static class Authorization
    {
        public const string ClientId = "CLIENT_ID";
        public const string Scope = "AUTH_SCOPE";
        public const string ClientSecret = "AUTH_CLIENT_SECRET";
    }

    /// <summary>
    /// Ключи keyed-регистраций IMemoryCache для сервисов/адаптеров, у которых нет доступа к этому
    /// (composition root) проекту. Каждое значение здесь должно совпадать со значением константы,
    /// которую использует соответствующий потребитель в своей собственной сборке (см. комментарий
    /// у той константы) - сознательное дублирование строкового значения вместо общей ссылки на
    /// константу между сборками.
    /// </summary>
    public static class CacheServiceKeys
    {
        /// <summary>Должен совпадать с Server.Application.WellKnown.GeoIp.CacheServiceKey.</summary>
        public const string GeoIp = "geoip-cache";

        /// <summary>Должен совпадать с Server.Adapters.Driven.ChipFind.WellKnown.CacheServiceKey.</summary>
        public const string ChipFind = "chipfind-cache";
    }
}