using System.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace Tests;

[Parallelizable(ParallelScope.Self)]
public class HealthCheckTest
{
    private WebApplicationFactory<Server.Program> _factory = null!;

    [OneTimeSetUp]
    public void OneTimeSetUp()
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
                            "User ID=ebay;Password=catnip0-spoil4-untrimmed;Server=localhost;Port=15432;Database=ebay;Pooling=true;MinPoolSize=1;MaxPoolSize=60;Enlist=true;Include Error Detail=true;",
                        ["EbayServer:TargetEmail"] = "integration-tests@localhost",
                        ["EbayServer:IsLocalRun"] = "true"
                    });
                });
            });
    }

    [OneTimeTearDown]
    public void OneTimeTearDown() => _factory.Dispose();

    [Test]
    public async Task HealthCheck()
    {
        using var client = _factory.CreateClient();
        using var timeoutCts = new CancellationTokenSource(TimeSpan.FromSeconds(20));

        var stopwatch = Stopwatch.StartNew();
        string? lastError = null;

        while (!timeoutCts.IsCancellationRequested)
        {
            using var response = await client.GetAsync("/api/health", timeoutCts.Token);
            if (response.IsSuccessStatusCode)
            {
                return;
            }

            var responseBody = await response.Content.ReadAsStringAsync(timeoutCts.Token);
            lastError = $"status={(int)response.StatusCode}, body={responseBody}";

            await Task.Delay(TimeSpan.FromMilliseconds(250), timeoutCts.Token);
        }

        Assert.Fail(
            $"Health endpoint did not become healthy in {stopwatch.Elapsed.TotalSeconds:F1}s. Last response: {lastError}");
    }
}
