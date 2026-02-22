using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Server;

namespace IntegrationTests;

[SetUpFixture]
public class IntegrationTestsSetupFixture
{
    private static readonly string DatabaseName = $"test_ebay_{Guid.NewGuid():N}";

    public static WebApplicationFactory<Server.Program> Factory { get; private set; } = null!;

    private string? _previousDomain;
    private string? _previousClientId;
    private string? _previousScope;
    private string? _previousClientSecret;
    private string? _previousKeysDir;

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
        _previousDomain = Environment.GetEnvironmentVariable("DOMAIN");
        _previousClientId = Environment.GetEnvironmentVariable(WellKnown.Authorization.ClientId);
        _previousScope = Environment.GetEnvironmentVariable(WellKnown.Authorization.Scope);
        _previousClientSecret = Environment.GetEnvironmentVariable(WellKnown.Authorization.ClientSecret);
        _previousKeysDir = Environment.GetEnvironmentVariable("DATA_PROTECTION_KEYS_DIR");

        Environment.SetEnvironmentVariable("DOMAIN", "localhost");
        Environment.SetEnvironmentVariable(WellKnown.Authorization.ClientId, AuthorizationConstants.TestClientId);
        Environment.SetEnvironmentVariable(WellKnown.Authorization.Scope, AuthorizationConstants.TestScope);
        Environment.SetEnvironmentVariable(WellKnown.Authorization.ClientSecret, AuthorizationConstants.TestClientSecret);
        Environment.SetEnvironmentVariable("DATA_PROTECTION_KEYS_DIR", Path.Join(Path.GetTempPath(), "data_protection_keys_dir_tests"));

        Factory = new WebApplicationFactory<Server.Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Development");
                builder.ConfigureAppConfiguration((_, configBuilder) =>
                {
                    configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
                    {
                        ["ConnectionStrings:DefaultConnection"] =
                            $"User ID=ebay;Password=catnip0-spoil4-untrimmed;Server=localhost;Port=15432;Database={DatabaseName};Pooling=true;MinPoolSize=1;MaxPoolSize=60;Enlist=true;Include Error Detail=true;",
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

        using var client = Factory.CreateClient();
        await TestHelpers.RetryUntilValidationSuccessAsync(
            async () =>
            {
                using var response = await client.GetAsync("/api/health");
                if (!response.IsSuccessStatusCode)
                {
                    throw new AssertionException(
                        $"Expected successful status for /api/health, but got {(int)response.StatusCode} ({response.StatusCode}).");
                }
            },
            timeout: 30);
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        Factory.Dispose();

        Environment.SetEnvironmentVariable("DOMAIN", _previousDomain);
        Environment.SetEnvironmentVariable(WellKnown.Authorization.ClientId, _previousClientId);
        Environment.SetEnvironmentVariable(WellKnown.Authorization.Scope, _previousScope);
        Environment.SetEnvironmentVariable(WellKnown.Authorization.ClientSecret, _previousClientSecret);
        Environment.SetEnvironmentVariable("DATA_PROTECTION_KEYS_DIR", _previousKeysDir);
    }
}

public static class AuthorizationConstants
{
    public const string TestClientId = "healthcheck-client";
    public const string TestClientSecret = "healthcheck-secret";
    public const string TestScope = "ServerAPI";
}
