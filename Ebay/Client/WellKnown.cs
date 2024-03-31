namespace Ebay.Client;

internal class WellKnown
{
    public const int RecheckTimeInDays = 90;
    
    public static class Categories
    {
        public static class Conditions
        {
            public static string CategoryName = "condition";
        }
    
        public static class TestState
        {
            public static string CategoryName = "test_state";
        }
    }
}