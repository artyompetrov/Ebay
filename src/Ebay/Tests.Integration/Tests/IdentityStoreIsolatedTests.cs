using System.Text.Json;
using AwesomeAssertions;
using Duende.IdentityServer.EntityFramework.Entities;
using Duende.IdentityServer.EntityFramework.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;
using Server.Adapters.Driven.EF.Identity;

namespace Tests.Integration.Tests;

// Verifies the new Server.Adapters.Driven.EF.Identity context in isolation, against its own scratch database,
// without going through IntegrationTestsSetupFixture's WebApplicationFactory. The new context is not yet wired
// into Server/Program.cs (that cutover, together with deleting the legacy ApplicationDbContext migrations that
// create the same physical tables, is deferred to a later task) so it cannot share that fixture's database.
public class IdentityStoreIsolatedTests
{
    private static readonly string DatabaseName = $"test_ebay_identity_{Guid.NewGuid():N}";

    private string _connectionString = null!;
    private ServiceProvider _serviceProvider = null!;

    [OneTimeSetUp]
    public async Task OneTimeSetUp()
    {
        var baseConnectionString = ReadConnectionStringFromLaunchSettings();
        var connectionStringBuilder = new NpgsqlConnectionStringBuilder(baseConnectionString)
        {
            Database = DatabaseName
        };
        _connectionString = connectionStringBuilder.ConnectionString;

        var services = new ServiceCollection();
        services.AddDataProtection();
        services.AddDbContext<IdentityDbContext>(o =>
            o.UseNpgsql(_connectionString, b => b.MigrationsAssembly("Server.Adapters.Driven.EF.Identity.Migrations")));
        services.AddIdentityCore<ApplicationUser>()
            .AddEntityFrameworkStores<IdentityDbContext>()
            .AddDefaultTokenProviders();

        _serviceProvider = services.BuildServiceProvider();

        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<IdentityDbContext>();
        await dbContext.Database.MigrateAsync();
    }

    [OneTimeTearDown]
    public async Task OneTimeTearDown()
    {
        await _serviceProvider.DisposeAsync();
        await DropDatabaseAsync();
    }

    [Test]
    public async Task UserManager_CreatesUserAndVerifiesPassword_AgainstNewIdentityContext()
    {
        using var scope = _serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        var user = new ApplicationUser { UserName = "identity-store-test@localhost", Email = "identity-store-test@localhost" };
        var createResult = await userManager.CreateAsync(user, "P@ssw0rd!123");
        createResult.Succeeded.Should().BeTrue();

        var correctPasswordCheck = await userManager.CheckPasswordAsync(user, "P@ssw0rd!123");
        correctPasswordCheck.Should().BeTrue();

        var wrongPasswordCheck = await userManager.CheckPasswordAsync(user, "wrong-password");
        wrongPasswordCheck.Should().BeFalse();

        var foundUser = await userManager.FindByNameAsync(user.UserName);
        foundUser.Should().NotBeNull();
    }

    [Test]
    public async Task PersistedGrantStore_RoundTripsGrant_AgainstNewIdentityContext()
    {
        var grantKey = Guid.NewGuid().ToString();

        using (var writeScope = _serviceProvider.CreateScope())
        {
            var writeContext = writeScope.ServiceProvider.GetRequiredService<IdentityDbContext>();
            ((IPersistedGrantDbContext)writeContext).PersistedGrants.Add(new PersistedGrant
            {
                Key = grantKey,
                Type = "refresh_token",
                SubjectId = "test-subject",
                ClientId = "test-client",
                CreationTime = DateTime.UtcNow,
                Expiration = DateTime.UtcNow.AddDays(1),
                Data = "{}"
            });
            await writeContext.SaveChangesAsync();
        }

        using (var readScope = _serviceProvider.CreateScope())
        {
            var readContext = readScope.ServiceProvider.GetRequiredService<IdentityDbContext>();
            var persistedGrants = ((IPersistedGrantDbContext)readContext).PersistedGrants;
            var storedGrant = await persistedGrants.SingleAsync(g => g.Key == grantKey);
            storedGrant.ClientId.Should().Be("test-client");

            persistedGrants.Remove(storedGrant);
            await readContext.SaveChangesAsync();
        }

        using (var verifyScope = _serviceProvider.CreateScope())
        {
            var verifyContext = verifyScope.ServiceProvider.GetRequiredService<IdentityDbContext>();
            var remaining = await ((IPersistedGrantDbContext)verifyContext).PersistedGrants
                .SingleOrDefaultAsync(g => g.Key == grantKey);
            remaining.Should().BeNull();
        }
    }

    private static string ReadConnectionStringFromLaunchSettings()
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
            || !serverProfile.TryGetProperty("environmentVariables", out var environmentVariables)
            || !environmentVariables.TryGetProperty("ConnectionStrings__DefaultConnection", out var connectionStringElement)
            || string.IsNullOrWhiteSpace(connectionStringElement.GetString()))
        {
            throw new InvalidOperationException("ConnectionStrings__DefaultConnection is required in Server launchSettings.json.");
        }

        return connectionStringElement.GetString()!;
    }

    private async Task DropDatabaseAsync()
    {
        var adminConnectionStringBuilder = new NpgsqlConnectionStringBuilder(_connectionString)
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
