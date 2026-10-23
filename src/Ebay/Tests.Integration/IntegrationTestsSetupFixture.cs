using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using OpenTelemetry;
using OpenTelemetry.Metrics;
using OpenTelemetry.Trace;

namespace Tests.Integration;

[SetUpFixture]
public class IntegrationTestsSetupFixture
{
    private static readonly string DatabaseName = $"test_ebay_{Guid.NewGuid():N}";
    private static readonly LaunchSettingsParameters LaunchSettings = ReadLaunchSettings();
    private static string _serverConnectionString = null!;

    public static string AuthorizationClientId => LaunchSettings.AuthorizationClientId;

    public static string AuthorizationClientScope => LaunchSettings.AuthorizationClientScope;

    public static string AuthorizationClientSecret => LaunchSettings.AuthorizationClientSecret;

    public static WebApplicationFactory<Server.Program> Factory { get; private set; } = null!;

    public static DatabaseCommandCounter DatabaseCommandCounter { get; } = new();

    public static SpanCollector SpanCollector { get; } = new();

    public static MetricCollector MetricCollector { get; } = new();

    /// <summary>Connection string of this fixture's scratch database.</summary>
    public static string DatabaseConnectionString => _serverConnectionString;

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
        await PostgresTestServer.StartAsync();
        _serverConnectionString = PostgresTestServer.CreateDatabaseConnectionString(DatabaseName);

        Factory = new WebApplicationFactory<Server.Program>()
            .WithWebHostBuilder(builder =>
            {
                builder.UseEnvironment("Development");
                builder.ConfigureAppConfiguration((_, configBuilder) =>
                {
                    configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
                    {
                        ["ConnectionStrings:DefaultConnection"] = _serverConnectionString,
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
                builder.ConfigureServices(services =>
                {
                    services.AddSingleton<IInterceptor>(DatabaseCommandCounter);
                    // Registered after AddPlatform, so the platform's span processors run first, as in production.
                    services.ConfigureOpenTelemetryTracerProvider(static tracing =>
                        tracing.AddProcessor(new SimpleActivityExportProcessor(SpanCollector)));
                    services.ConfigureOpenTelemetryMeterProvider(static metrics => metrics.AddReader(MetricCollector.Reader));
                });
            });

        // The scoped SQL counter uses AsyncLocal; TestServer otherwise drops it at the HTTP boundary.
        Factory.Server.PreserveExecutionContext = true;
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
        await PostgresTestServer.DropDatabaseAsync(DatabaseName);
        await PostgresTestServer.StopAsync();
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

    private sealed record LaunchSettingsParameters(
        string AuthorizationClientId,
        string AuthorizationClientScope,
        string AuthorizationClientSecret
    );
}
