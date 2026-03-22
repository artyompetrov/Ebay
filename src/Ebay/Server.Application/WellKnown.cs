namespace Server.Application;

internal static class WellKnown
{
    public static class Formats
    {
        public static string TimeFormat = "yyyy-MM-ddTHH:mm:ss.fffZ";
    }

    public static class Currencies
    {
        public static string KZT = "KZT";
        public static string UsDollar = "USD";
    }

    public static class CurrencyRate
    {
        public static string BaseCurrency = "USD";
        public static TimeSpan UpdateTime = TimeSpan.FromHours(12);
        public static TimeSpan ErrorDelay = TimeSpan.FromMinutes(5);
        public static string AppId = "2d0b695db0cb4dbab40a85a91a88bd24";
    }

    public static class ChipFind
    {
        public static TimeSpan UpdateTime = TimeSpan.FromMinutes(20);
        public static TimeSpan ErrorDelay = TimeSpan.FromMinutes(5);
        public static string Marketplace = "Chipfind";
    }

    public static class SaleAdvertisements
    {
        public static TimeSpan UpdateTime = TimeSpan.FromDays(1);
        public static TimeSpan ErrorDelay = TimeSpan.FromMinutes(5);

        /// <summary>
        /// Время через которое не обновлявшиеся объявления о продаже считаются устаревшими и удаляются
        /// </summary>
        public static TimeSpan RemoveAdvertisementAfter = TimeSpan.FromDays(90);
    }

    public static class Categories
    {
        public static class Conditions
        {
            public static string CategoryName = "condition";

            public static string New = "new";
            public static string Used = "used";
            public static string NotWorking = "notWorking";
        }

        public static class TestState
        {
            public static string CategoryName = "test_state";

            public static string NotTested = "notTested";
            public static string Tested = "tested";
            public static string Matched = "matched";
        }
    }

    public static class Ebay
    {
        public const double скидкаНаПродажиСНеизвестнойЦеной = 0.2;
        public const double коммисияEbayFinalValueFee = 0.136;
        public const double коммисияEbayInternationalFee = 0.013;
        public const double коммиссияEbayПостояннаяВеличина = 0.4;
        public const double множительУчитывающийVat = 1.12;
        public const double коммисияPayoneerВПроцентах = 0.01;
        public const double множительДляУчетаВесаУпаковки = 1.5;
    }

    public static class DbCache
    {
        /// <summary>
        /// Версия кеша - для сброса кеша при изменении логики расчетов
        /// </summary>
        public const string Version = "13";
    }

    public static class GeoIp
    {
        public static IReadOnlyCollection<string> ExcludeCountries = ["Russia", "Kazakhstan"];
    }
}