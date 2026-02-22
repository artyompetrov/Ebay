using Npgsql;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;

namespace IntegrationTests;

[SetUpFixture]
public class IntegrationTestsSetupFixture
{
    private static readonly string DatabaseName = $"test_ebay_{Guid.NewGuid():N}";

    public static WebApplicationFactory<Server.Program> Factory { get; private set; } = null!;

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
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
    public async Task OneTimeTearDown()
    {
        Factory.Dispose();
        await DropTestDatabaseAsync();
    }

    private static async Task DropTestDatabaseAsync()
    {
        var adminConnectionString =
            "Host=localhost;Port=15432;Database=postgres;Username=ebay;Password=catnip0-spoil4-untrimmed;Pooling=false;Include Error Detail=true;";

        await using var connection = new NpgsqlConnection(adminConnectionString);
        await connection.OpenAsync();

        await using (var terminateCommand = connection.CreateCommand())
        {
            terminateCommand.CommandText =
                $"""
                 SELECT pg_terminate_backend(pid)
                 FROM pg_stat_activity
                 WHERE datname = '{DatabaseName}'
                   AND pid <> pg_backend_pid();
                 """;
            await terminateCommand.ExecuteNonQueryAsync();
        }

        await using var dropCommand = connection.CreateCommand();
        dropCommand.CommandText = $"""DROP DATABASE IF EXISTS "{DatabaseName}";""";
        await dropCommand.ExecuteNonQueryAsync();
    }
}

public static class AuthorizationConstants
{
    public const string TestClientId = "client_id";
    public const string TestClientSecret = "secret";
    public const string TestScope = "ServerAPI";
}
