using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Polly;
using Polly.Timeout;

namespace Tests;

[Parallelizable(ParallelScope.Self)]
public class HealthCheckTest
{
    private WebApplicationFactory<Server.Program> _factory = null!;

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
        _factory = new WebApplicationFactory<Server.Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Testing");
                builder.ConfigureAppConfiguration((_, configBuilder) =>
                {
                    configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
                    {
                        ["ConnectionStrings:DefaultConnection"] =
                            "User ID=ebay;Password=catnip0-spoil4-untrimmed;Server=localhost;Port=15432;Database=test_ebay;Pooling=true;MinPoolSize=1;MaxPoolSize=60;Enlist=true;Include Error Detail=true;",
                        ["EbayServer:TargetEmail"] = "integration-tests@localhost",
                        ["EbayServer:IsLocalRun"] = "true"
                    });
                });
            });

        using var client = _factory.CreateClient();
        await RetryUntilValidationSuccessAsync(
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

    [OneTimeTearDown]
    public void OneTimeTearDown() => _factory.Dispose();


    [Test]
    public async Task RobotsTxt_ReturnsExpectedContent()
    {
        using var client = _factory.CreateClient();
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
        using var client = _factory.CreateClient();
        using var response = await client.GetAsync("/chrome_extensions/auth");
        var body = await response.Content.ReadAsStringAsync();

        using (Assert.EnterMultipleScope())
        {
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType?.MediaType, Is.EqualTo("text/html"));
            Assert.That(body, Does.Contain("Chrome extension auth page"));
        }
    }

    protected static Task RetryUntilValidationSuccessAsync(
        Func<Task> assertAction,
        int timeout = 20)
    {
        AssertionException? lastAssertion = null;

        var retryPolicy = Policy
            .Handle<AssertionException>()
            .WaitAndRetryForeverAsync(
                sleepDurationProvider: _ => TimeSpan.FromMilliseconds(250),
                onRetry: (exception, _) => lastAssertion = exception as AssertionException);
        var timeoutPolicy = Policy.TimeoutAsync(TimeSpan.FromSeconds(timeout));
        var policy = Policy.WrapAsync(timeoutPolicy, retryPolicy);

        return ExecuteAsync();

        async Task ExecuteAsync()
        {
            try
            {
                await policy.ExecuteAsync(_ => assertAction(), CancellationToken.None);
            }
            catch (TimeoutRejectedException) when (lastAssertion != null)
            {
                Assert.Fail(
                    $"Assertion did not pass in {timeout:F1}s. Last assertion: {lastAssertion.Message}");
            }
        }
    }
}