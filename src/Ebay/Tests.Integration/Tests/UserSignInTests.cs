using System.Net;
using System.Text.RegularExpressions;
using AwesomeAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driven.EF.Identity;
using Tests.Shared;

namespace Tests.Integration.Tests;

public partial class UserSignInTests
{
    private const string LoginPath = "/Identity/Account/Login";
    private const string ReturnUrl = "/products";
    private const string Password = "P@ssw0rd!123";
    private const string AuthenticationCookieName = ".AspNetCore.Identity.Application";

    [Test]
    [OpenSpecScenario("user-accounts", "UI offers no way to register", "Sign-in page has no registration links")]
    public async Task LoginPage_HasSignInForm_AndNoRegistrationLinks()
    {
        using var client = CreateClient();

        using var response = await client.GetAsync(LoginPath);
        var html = await response.Content.ReadAsStringAsync();

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        html.Should().Contain("id=\"account\"").And.Contain("__RequestVerificationToken");
        html.Should().NotContain("/Identity/Account/Register");
        html.Should().NotContain("/Identity/Account/ResendEmailConfirmation");
    }

    [Test]
    [OpenSpecScenario("user-accounts", "Existing users can sign in", "Valid credentials sign the user in")]
    public async Task Login_WithValidCredentials_RedirectsToReturnUrl_AndSetsAuthenticationCookie()
    {
        var email = await CreateConfirmedUserAsync();
        using var client = CreateClient();

        using var response = await SubmitLoginFormAsync(client, email, Password);

        response.StatusCode.Should().Be(HttpStatusCode.Redirect);
        response.Headers.Location?.OriginalString.Should().Be(ReturnUrl);
        SetCookies(response).Should().Contain(static c => c.StartsWith(AuthenticationCookieName + "="));
    }

    [Test]
    [OpenSpecScenario("user-accounts", "Existing users can sign in", "Wrong password is rejected")]
    public async Task Login_WithWrongPassword_ShowsFormAgainWithError_AndSetsNoAuthenticationCookie()
    {
        var email = await CreateConfirmedUserAsync();
        using var client = CreateClient();

        using var response = await SubmitLoginFormAsync(client, email, "Wr0ng!password");
        var html = await response.Content.ReadAsStringAsync();

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        html.Should().Contain("id=\"account\"").And.Contain("Invalid login attempt.");
        SetCookies(response).Should().NotContain(static c => c.StartsWith(AuthenticationCookieName + "="));
    }

    private static HttpClient CreateClient() =>
        IntegrationTestsSetupFixture.Factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });

    private static async Task<string> CreateConfirmedUserAsync()
    {
        var email = $"sign-in-{Guid.NewGuid():N}@localhost";
        using var scope = IntegrationTestsSetupFixture.Factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var result = await userManager.CreateAsync(
            new ApplicationUser { UserName = email, Email = email, EmailConfirmed = true },
            Password);
        result.Succeeded.Should().BeTrue(string.Join("; ", result.Errors.Select(static e => e.Description)));
        return email;
    }

    private static async Task<HttpResponseMessage> SubmitLoginFormAsync(HttpClient client, string email, string password)
    {
        var loginUrl = $"{LoginPath}?returnUrl={Uri.EscapeDataString(ReturnUrl)}";
        using var page = await client.GetAsync(loginUrl);
        var antiforgeryToken = AntiforgeryTokenRegex().Match(await page.Content.ReadAsStringAsync()).Groups["token"].Value;
        antiforgeryToken.Should().NotBeEmpty();

        using var form = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["Input.Email"] = email,
            ["Input.Password"] = password,
            ["__RequestVerificationToken"] = antiforgeryToken
        });
        return await client.PostAsync(loginUrl, form);
    }

    private static IEnumerable<string> SetCookies(HttpResponseMessage response) =>
        response.Headers.TryGetValues("Set-Cookie", out var values) ? values : [];

    [GeneratedRegex("name=\"__RequestVerificationToken\" type=\"hidden\" value=\"(?<token>[^\"]+)\"")]
    private static partial Regex AntiforgeryTokenRegex();
}
