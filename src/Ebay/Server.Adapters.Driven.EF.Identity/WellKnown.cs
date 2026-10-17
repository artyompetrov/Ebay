namespace Server.Adapters.Driven.EF.Identity;

internal static class WellKnown
{
    public static class ChromeExtension
    {
        public const string Id = "mlebgdemjnpnfgcgbbncllpniiicffbm";
        public const string ClientId = "Ebay.ChromeExtension";
    }

    public static class IdentityUi
    {
        public const string Area = "Identity";

        /// <summary>Identity UI pages that would let anyone create or confirm an account.</summary>
        public static readonly string[] DisabledPages =
        [
            "/Account/Register",
            "/Account/RegisterConfirmation",
            "/Account/ConfirmEmail",
            "/Account/ResendEmailConfirmation"
        ];
    }
}
