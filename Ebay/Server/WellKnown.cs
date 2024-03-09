namespace Ebay.Server;

internal static class WellKnown
{
    public static class Authorization
    {
        public static string ClientId = "Ebay.Python";//todo переименовать
        public static string Scope = "Ebay.ServerAPI";
        public static string AuthToken = "ac4ab670-ae20-451a-ab4a-3a20275e807d";
    }
    
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