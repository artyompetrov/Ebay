using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Tests;

[Parallelizable(ParallelScope.Self)]
public class HealthCheckTest
{
    private WebApplicationFactory<Program> factory = null!;

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        factory = new WebApplicationFactory<Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Testing");
                builder.ConfigureAppConfiguration((_, configBuilder) =>
                {
                    configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
                    {
                        ["ConnectionStrings:DefaultConnection"] =
                            "Host=localhost;Port=5432;Database=ebay_test;Username=postgres;Password=postgres",
                        ["EbayServer:TargetEmail"] = "integration-tests@localhost",
                        ["EbayServer:IsLocalRun"] = "true"
                    });
                });

                builder.ConfigureServices(services =>
                {
                    services.RemoveAll<IHostedService>();
                });
            });
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        factory.Dispose();
    }

    [Test]
    public async Task ExampleTest()
    {
        using var client = factory.CreateClient();

        var response = await client.GetAsync("/api/health");

        Assert.That(response.IsSuccessStatusCode, Is.True);
    }
}
