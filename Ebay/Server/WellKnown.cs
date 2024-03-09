namespace Ebay.Server;

public static class WellKnown
{
    public static class Formats
    {
        public static string TimeFormat = "yyyy-MM-ddTHH:mm:ss.fffZ";
    }

    public static class Currencies
    {
        public static string KZT = "KZT";
        public static string UsDollar = "US $";
    }

    public static class CurrencyRate
    {
        public static string BaseCurrency = "USD";
        public static TimeSpan UpdateTime = TimeSpan.FromHours(12);
        public static TimeSpan ErrorDelay = TimeSpan.FromMinutes(5);
        public static string AppId = "2d0b695db0cb4dbab40a85a91a88bd24";
    }
}