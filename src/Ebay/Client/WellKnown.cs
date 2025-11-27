namespace Client;

internal class WellKnown
{
    public static class Categories
    {
        public static class Conditions
        {
            public const string CategoryName = "condition";
            public const string New = "new";
            public const string Used = "used";
            public const string NotWorking = "notWorking";
        }

        public static class TestState
        {
            public const string CategoryName = "test_state";

            public const string NotTested = "notTested";
            public const string Tested = "tested";
            public const string Matched = "matched";
        }
    }

    public static class Currencies
    {
        public const string USD = "USD";
        public const string TargetCurrency = "RUB";
    }
}