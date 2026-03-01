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
    private static readonly LaunchSettingsParameters LaunchSettings = ReadLaunchSettings();
    private static readonly string ServerConnectionString = BuildServerConnectionString();

    public static string AuthorizationClientId => LaunchSettings.AuthorizationClientId;

    public static string AuthorizationClientScope => LaunchSettings.AuthorizationClientScope;

    public static string AuthorizationClientSecret => LaunchSettings.AuthorizationClientSecret;

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
                        ["AuthorizationClient:ClientId"] = LaunchSettings.AuthorizationClientId,
                        ["AuthorizationClient:Scope"] = LaunchSettings.AuthorizationClientScope,
                        ["AuthorizationClient:ClientSecret"] = LaunchSettings.AuthorizationClientSecret,
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
        await Factory.DisposeAsync();
        await DropTestDatabaseAsync();
    }

    private static string BuildServerConnectionString()
    {
        var connectionStringBuilder = new NpgsqlConnectionStringBuilder(LaunchSettings.ConnectionString)
        {
            Database = DatabaseName
        };

        return connectionStringBuilder.ConnectionString;
    }

    private static LaunchSettingsParameters ReadLaunchSettings()
    {
        var serverProjectDirectory = Path.GetFullPath(
            Path.Combine(TestContext.CurrentContext.TestDirectory, "../../../../Server"));

        var launchSettingsPath = Path.Combine(serverProjectDirectory, "Properties", "launchSettings.json");
        if (!File.Exists(launchSettingsPath))
        {
            throw new InvalidOperationException($"Launch settings file not found: {launchSettingsPath}");
        }

        using var document = JsonDocument.Parse(File.ReadAllText(launchSettingsPath));
        if (!document.RootElement.TryGetProperty("profiles", out var profiles)
            || !profiles.TryGetProperty("Server", out var serverProfile)
            || !serverProfile.TryGetProperty("environmentVariables", out var environmentVariables))
        {
            throw new InvalidOperationException("Profile 'Server' with environmentVariables is required in launchSettings.json.");
        }

        return new LaunchSettingsParameters(
            ConnectionString: ReadRequiredEnvironmentVariable(environmentVariables, "ConnectionStrings__DefaultConnection"),
            AuthorizationClientId: ReadRequiredEnvironmentVariable(environmentVariables, "AuthorizationClient__ClientId"),
            AuthorizationClientScope: ReadRequiredEnvironmentVariable(environmentVariables, "AuthorizationClient__Scope"),
            AuthorizationClientSecret: ReadRequiredEnvironmentVariable(environmentVariables, "AuthorizationClient__ClientSecret")
        );
    }

    private static string ReadRequiredEnvironmentVariable(JsonElement environmentVariables, string key)
    {
        if (!environmentVariables.TryGetProperty(key, out var valueElement)
            || string.IsNullOrWhiteSpace(valueElement.GetString()))
        {
            throw new InvalidOperationException($"{key} is required in Server launchSettings.json.");
        }

        return valueElement.GetString()!;
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

    private sealed record LaunchSettingsParameters(
        string ConnectionString,
        string AuthorizationClientId,
        string AuthorizationClientScope,
        string AuthorizationClientSecret
    );
}