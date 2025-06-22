namespace Server.Application;

internal static class WellKnown
{
    public const int RecheckTimeInDays = 360 * 2;

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
        public static TimeSpan UpdateTime = TimeSpan.FromHours(1);
        public static TimeSpan ErrorDelay = TimeSpan.FromMinutes(5);
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


}