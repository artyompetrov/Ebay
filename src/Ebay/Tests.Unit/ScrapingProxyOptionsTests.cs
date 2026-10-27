using System.ComponentModel.DataAnnotations;
using AwesomeAssertions;
using Server.Adapters.Driven.ScrapingProxy;
using Tests.Shared;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ScrapingProxyOptions))]
public sealed class ScrapingProxyOptionsTests
{
    private const string ValidAddress = "http://proxy.example:8080";
    private const string Username = "user";
    private const string Password = "secret";
    private const string ProxyKey = "abc123";
    private const string ChangeIpUrl = "https://changeip.mobileproxy.space/?proxy_key=abc123&format=json";

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Non-http proxy address")]
    public void Validate_NonHttpAddress_FailsForAddress()
    {
        ShouldFailFor(new ScrapingProxyOptions { Address = "socks5://proxy.example:1080" }, nameof(ScrapingProxyOptions.Address));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Relative proxy address")]
    public void Validate_RelativeAddress_FailsForAddress()
    {
        ShouldFailFor(new ScrapingProxyOptions { Address = "proxy.example:8080" }, nameof(ScrapingProxyOptions.Address));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Credentials inside the proxy address")]
    public void Validate_UserInfoInAddress_FailsForAddress()
    {
        ShouldFailFor(new ScrapingProxyOptions { Address = "http://user:secret@proxy.example:8080" }, nameof(ScrapingProxyOptions.Address));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Login without a password")]
    public void Validate_UsernameWithoutPassword_FailsForCredentials()
    {
        ShouldFailFor(new ScrapingProxyOptions { Address = ValidAddress, Username = Username, Password = "" }, nameof(ScrapingProxyOptions.Password));
    }

    [Test]
    public void Validate_PasswordWithoutUsername_FailsForCredentials()
    {
        ShouldFailFor(new ScrapingProxyOptions { Address = ValidAddress, Password = Password }, nameof(ScrapingProxyOptions.Username));
    }

    [Test]
    public void Validate_WhitespacePassword_FailsForCredentials()
    {
        ShouldFailFor(new ScrapingProxyOptions { Address = ValidAddress, Username = Username, Password = " " }, nameof(ScrapingProxyOptions.Password));
    }

    [Test]
    public void ToString_DoesNotContainPassword()
    {
        new ScrapingProxyOptions { Address = ValidAddress, Username = Username, Password = Password }.ToString()
            .Should().NotContain(Password);
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Credentials without an address")]
    public void Validate_CredentialsWithoutAddress_FailsForCredentials()
    {
        ShouldFailFor(new ScrapingProxyOptions { Address = "", Username = Username, Password = Password }, nameof(ScrapingProxyOptions.Username));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Valid proxy settings")]
    public void Validate_AddressWithCredentialsAndChangeIpUrl_Passes()
    {
        Validate(new ScrapingProxyOptions { Address = ValidAddress, Username = Username, Password = Password, ChangeIpUrl = ChangeIpUrl })
            .Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "IP change link without an address")]
    public void Validate_ChangeIpUrlWithoutAddress_FailsForChangeIpUrl()
    {
        ShouldFailFor(
            new ScrapingProxyOptions { Address = "", ChangeIpUrl = "https://changeip.mobileproxy.space/?proxy_key=abc123" },
            nameof(ScrapingProxyOptions.ChangeIpUrl));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Relative IP change link")]
    public void Validate_RelativeChangeIpUrl_FailsForChangeIpUrl()
    {
        ShouldFailFor(
            new ScrapingProxyOptions { Address = ValidAddress, ChangeIpUrl = "changeip.mobileproxy.space/?proxy_key=abc123" },
            nameof(ScrapingProxyOptions.ChangeIpUrl));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Non-http IP change link")]
    public void Validate_NonHttpChangeIpUrl_FailsForChangeIpUrl()
    {
        ShouldFailFor(
            new ScrapingProxyOptions { Address = ValidAddress, ChangeIpUrl = "ftp://changeip.mobileproxy.space/?proxy_key=abc123" },
            nameof(ScrapingProxyOptions.ChangeIpUrl));
    }

    [Test]
    public void Validate_InvalidChangeIpUrl_MessageDoesNotContainProxyKey()
    {
        Validate(new ScrapingProxyOptions { Address = ValidAddress, ChangeIpUrl = "ftp://changeip.mobileproxy.space/?proxy_key=abc123" })
            .Should().ContainSingle()
            .Which.ErrorMessage.Should().NotContain(ProxyKey);
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Zero IP changes")]
    public void Validate_ZeroIpChangeAttempts_FailsForMaxIpChangeAttempts()
    {
        ShouldFailFor(
            new ScrapingProxyOptions { Address = ValidAddress, MaxIpChangeAttempts = 0 },
            nameof(ScrapingProxyOptions.MaxIpChangeAttempts));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Too many IP changes")]
    public void Validate_TooManyIpChangeAttempts_FailsForMaxIpChangeAttempts()
    {
        ShouldFailFor(
            new ScrapingProxyOptions { Address = ValidAddress, MaxIpChangeAttempts = 101 },
            nameof(ScrapingProxyOptions.MaxIpChangeAttempts));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Non-positive probe timeout")]
    public void Validate_ZeroProbeTimeout_FailsForProbeTimeout()
    {
        ShouldFailFor(
            new ScrapingProxyOptions { Address = ValidAddress, ProbeTimeout = TimeSpan.Zero },
            nameof(ScrapingProxyOptions.ProbeTimeout));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "IP change delay below the provider's limit")]
    public void Validate_ShortIpChangeDelay_FailsForIpChangeDelay()
    {
        ShouldFailFor(
            new ScrapingProxyOptions { Address = ValidAddress, IpChangeDelay = TimeSpan.FromSeconds(4) },
            nameof(ScrapingProxyOptions.IpChangeDelay));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Probe timeout too long")]
    public void Validate_LongProbeTimeout_FailsForProbeTimeout()
    {
        ShouldFailFor(
            new ScrapingProxyOptions { Address = ValidAddress, ProbeTimeout = TimeSpan.FromMinutes(6) },
            nameof(ScrapingProxyOptions.ProbeTimeout));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "IP change delay too long")]
    public void Validate_LongIpChangeDelay_FailsForIpChangeDelay()
    {
        ShouldFailFor(
            new ScrapingProxyOptions { Address = ValidAddress, IpChangeDelay = TimeSpan.FromMinutes(11) },
            nameof(ScrapingProxyOptions.IpChangeDelay));
    }

    [Test]
    public void Defaults_MatchSpec()
    {
        var options = new ScrapingProxyOptions();

        options.Should().BeEquivalentTo(
            new { MaxIpChangeAttempts = 20, ProbeTimeout = TimeSpan.FromSeconds(15), IpChangeDelay = TimeSpan.FromSeconds(10) },
            static o => o.ExcludingMissingMembers());
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "The IP change link is not exposed", "Settings text hides the IP change link")]
    public void ToString_DoesNotContainChangeIpUrl()
    {
        new ScrapingProxyOptions { Address = ValidAddress, ChangeIpUrl = ChangeIpUrl }.ToString()
            .Should().NotContain(ProxyKey);
    }

    [Test]
    public void Validate_AddressWithoutCredentials_Passes()
    {
        Validate(new ScrapingProxyOptions { Address = ValidAddress }).Should().BeEmpty();
    }

    [Test]
    public void Validate_NothingConfigured_Passes()
    {
        Validate(new ScrapingProxyOptions()).Should().BeEmpty();
    }

    private static void ShouldFailFor(ScrapingProxyOptions options, string memberName)
    {
        Validate(options).Should().ContainSingle()
            .Which.MemberNames.Should().Contain(memberName);
    }

    private static List<ValidationResult> Validate(ScrapingProxyOptions options)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(options, new ValidationContext(options), results, validateAllProperties: true);
        return results;
    }
}
