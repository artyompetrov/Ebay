using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Tests.Integration;

[SetUpFixture]
public class IntegrationTestsSetupFixture
{
    private static readonly string DatabaseName = $"test_ebay_{Guid.NewGuid():N}";
    private static readonly string ServerConnectionString = BuildServerConnectionString();

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
                        ["ConnectionStrings:DefaultConnection"] = ServerConnectionString,
                        ["EbayServer:TargetEmail"] = "integration-tests@localhost",
                        ["EbayServer:IsLocalRun"] = "true",
                        ["AuthorizationClient:DataProtectionKeysDirectory"] = Path.Join(Path.GetTempPath(), "data_protection_keys_dir_tests"),
                        ["AuthorizationClient:Domain"] = "localhost",
                        ["AuthorizationClient:ClientId"] = AuthorizationConstants.TestClientId,
                        ["AuthorizationClient:Scope"] = AuthorizationConstants.TestScope,
                        ["AuthorizationClient:ClientSecret"] = AuthorizationConstants.TestClientSecret,
                        ["IdentityServer:Key:Type"] = "Development"
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


    private static string BuildServerConnectionString()
    {
        var serverProjectDirectory = Path.GetFullPath(
            Path.Combine(TestContext.CurrentContext.TestDirectory, "../../../../Server"));

        var defaultConnectionString =
            TryReadConnectionStringFromLaunchSettings(serverProjectDirectory)
            ?? throw new InvalidOperationException("ConnectionStrings:DefaultConnection is required.");

        var connectionStringBuilder = new NpgsqlConnectionStringBuilder(defaultConnectionString)
        {
            Database = DatabaseName
        };

        return connectionStringBuilder.ConnectionString;
    }


    private static string? TryReadConnectionStringFromLaunchSettings(string serverProjectDirectory)
    {
        var launchSettingsPath = Path.Combine(serverProjectDirectory, "Properties", "launchSettings.json");
        if (!File.Exists(launchSettingsPath))
        {
            return null;
        }

        using var document = JsonDocument.Parse(File.ReadAllText(launchSettingsPath));

        if (!document.RootElement.TryGetProperty("profiles", out var profiles)
            || !profiles.TryGetProperty("Server", out var serverProfile)
            || !serverProfile.TryGetProperty("environmentVariables", out var environmentVariables)
            || !environmentVariables.TryGetProperty("ConnectionStrings__DefaultConnection", out var connectionStringValue))
        {
            return null;
        }

        return connectionStringValue.GetString();
    }

    private static async Task DropTestDatabaseAsync()
    {
        var adminConnectionStringBuilder = new NpgsqlConnectionStringBuilder(ServerConnectionString)
        {
            Database = "postgres",
            Pooling = false
        };

        await using var connection = new NpgsqlConnection(adminConnectionStringBuilder.ConnectionString);
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
