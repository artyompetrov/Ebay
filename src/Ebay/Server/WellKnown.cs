namespace Server;

public static class WellKnown
{
    public static class ChromeExtension
    {
        public static string Id = "mlebgdemjnpnfgcgbbncllpniiicffbm";
        public static string ClientId = "Ebay.ChromeExtension";

    }

    public static class Authorization
    {
        public static string PythonClientId = "Ebay.Python";//todo переименовать
        public static string Scope = "ServerAPI";
        public static string ClientSecret = "ac4ab670-ae20-451a-ab4a-3a20275e807d";
    }
}