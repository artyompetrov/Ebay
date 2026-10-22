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
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Credentials without an address")]
    public void Validate_CredentialsWithoutAddress_FailsForCredentials()
    {
        ShouldFailFor(new ScrapingProxyOptions { Address = "", Username = Username, Password = Password }, nameof(ScrapingProxyOptions.Username));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Valid proxy settings")]
    public void Validate_AddressWithCredentials_Passes()
    {
        Validate(new ScrapingProxyOptions { Address = ValidAddress, Username = Username, Password = Password }).Should().BeEmpty();
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
