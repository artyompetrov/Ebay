using System.Net;

namespace Tests.Integration.Tests;

[Parallelizable(ParallelScope.Self)]
public class HealthCheckTests
{
    [Test]
    public async Task HealthEndpoint_ReturnsOk()
    {
        using var client = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.RetryUntilValidationSuccessAsync(
            async () =>
            {
                using var response = await client.GetAsync("/api/health");
                if (response.StatusCode != HttpStatusCode.OK)
                {
                    throw new AssertionException(
                        $"Expected status OK, but got {(int)response.StatusCode} ({response.StatusCode}).");
                }
            },
            timeout: 20);
    }

    [Test]
    public async Task RobotsTxt_ReturnsExpectedContent()
    {
        using var client = IntegrationTestsSetupFixture.Factory.CreateClient();
        using var response = await client.GetAsync("/robots.txt");
        var body = await response.Content.ReadAsStringAsync();

        using (Assert.EnterMultipleScope())
        {
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType?.MediaType, Is.EqualTo("text/plain"));
            Assert.That(body, Is.EqualTo("User-agent: *\nDisallow: /"));
        }
    }

    [Test]
    public async Task ChromeExtensionAuth_ReturnsHtmlPage()
    {
        using var client = IntegrationTestsSetupFixture.Factory.CreateClient();
        using var response = await client.GetAsync("/chrome_extensions/auth");
        var body = await response.Content.ReadAsStringAsync();

        using (Assert.EnterMultipleScope())
        {
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType?.MediaType, Is.EqualTo("text/html"));
            Assert.That(body, Does.Contain("Chrome extension auth page"));
        }
    }
}