using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace IntegrationTests;

[SetUpFixture]
public class IntegrationTestsSetupFixture
{
    public static WebApplicationFactory<Server.Program> Factory { get; private set; } = null!;

    [OneTimeSetUp]
    public void OneTimeSetUp()
    {
        Factory = new WebApplicationFactory<Server.Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Development");
                builder.ConfigureAppConfiguration((_, configBuilder) =>
                {
                    configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
                    {
                        ["ConnectionStrings:DefaultConnection"] =
                            "User ID=ebay;Password=catnip0-spoil4-untrimmed;Server=localhost;Port=15432;Database=test_ebay;Pooling=true;MinPoolSize=1;MaxPoolSize=60;Enlist=true;Include Error Detail=true;",
                        ["EbayServer:TargetEmail"] = "integration-tests@localhost",
                        ["EbayServer:IsLocalRun"] = "true",
                        ["AuthorizationClient:DataProtectionKeysDirectory"] = Path.Join(Path.GetTempPath(), "data_protection_keys_dir_tests"),
                        ["AuthorizationClient:Domain"] = "localhost",
                        ["AuthorizationClient:ClientId"] = AuthorizationConstants.TestClientId,
                        ["AuthorizationClient:Scope"] = AuthorizationConstants.TestScope,
                        ["AuthorizationClient:ClientSecret"] = AuthorizationConstants.TestClientSecret
                    });
                });
            });
    }

    [OneTimeTearDown]
    public void OneTimeTearDown() => Factory.Dispose();
}

public static class AuthorizationConstants
{
    public const string TestClientId = "healthcheck-client";
    public const string TestClientSecret = "healthcheck-secret";
    public const string TestScope = "healthcheck.scope";
}
