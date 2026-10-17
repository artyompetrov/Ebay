using System.Net;
using AwesomeAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driven.EF.Identity;
using Tests.Shared;

namespace Tests.Integration.Tests;

public class UserRegistrationTests
{
    private const string RegisterPath = "/Identity/Account/Register";

    private static readonly string[] ConfirmationPaths =
    [
        "/Identity/Account/RegisterConfirmation",
        "/Identity/Account/ConfirmEmail",
        "/Identity/Account/ResendEmailConfirmation"
    ];

    [Test]
    [OpenSpecScenario("user-accounts", "No self-service registration", "Registration page is not served")]
    public async Task RegisterPage_Get_ReturnsNotFound()
    {
        using var client = CreateClient();

        using var response = await client.GetAsync(RegisterPath);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Test]
    [OpenSpecScenario("user-accounts", "No self-service registration", "Registration form submission creates no account")]
    public async Task RegisterPage_Post_ReturnsNotFound_AndCreatesNoAccount()
    {
        using var client = CreateClient();
        var email = $"registration-{Guid.NewGuid():N}@localhost";
        using var form = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["Input.Email"] = email,
            ["Input.Password"] = "P@ssw0rd!123",
            ["Input.ConfirmPassword"] = "P@ssw0rd!123"
        });

        using var response = await client.PostAsync(RegisterPath, form);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        using var scope = IntegrationTestsSetupFixture.Factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        (await userManager.FindByEmailAsync(email)).Should().BeNull();
    }

    [Test]
    [OpenSpecScenario("user-accounts", "No self-service registration", "Confirmation pages are not served")]
    public async Task ConfirmationPages_GetAndPost_ReturnNotFound()
    {
        using var client = CreateClient();

        foreach (var path in ConfirmationPaths)
        {
            using var getResponse = await client.GetAsync(path);
            using var form = new FormUrlEncodedContent(new Dictionary<string, string>());
            using var postResponse = await client.PostAsync(path, form);

            getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound, $"GET {path} must not be served");
            postResponse.StatusCode.Should().Be(HttpStatusCode.NotFound, $"POST {path} must not be served");
        }
    }

    private static HttpClient CreateClient() =>
        IntegrationTestsSetupFixture.Factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
}
