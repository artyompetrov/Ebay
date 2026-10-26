using AwesomeAssertions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Adapters.Driven.EF.Identity;
using Tests.Shared;

namespace Tests.Integration.Tests;

/// <summary>
/// Every test seeds its own empty scratch database: the shared fixture database is not empty, and the rule under
/// test is about a database without users.
/// </summary>
[TestOf(typeof(DevelopmentUserSeeder))]
public class DevelopmentUserSeederTests
{
    // AddDefaultIdentity sets it, and the Identity migrations were generated with it (see IdentityStoreIsolatedTests).
    private const int AppMaxLengthForKeys = 128;
    private const string Email = "dev@localhost";
    private const string Password = "Dev-Passw0rd!";
    private const string ExistingUserEmail = "existing@localhost";

    private static readonly DevelopmentUserOptions ConfiguredCredentials = new() { Email = Email, Password = Password };

    [Test]
    [OpenSpecScenario("user-accounts", "Local development run gets a sign-in user", "Empty development database gets the configured user")]
    public async Task Start_DevelopmentWithCredentialsAndNoUsers_CreatesConfirmedUser()
    {
        await using var database = await IdentityDatabase.CreateAsync();

        await database.StartSeederAsync(Environments.Development, ConfiguredCredentials);

        using var scope = database.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var user = await userManager.FindByEmailAsync(Email);
        user.Should().NotBeNull();
        user.EmailConfirmed.Should().BeTrue();
        (await userManager.CheckPasswordAsync(user, Password)).Should().BeTrue();
    }

    [Test]
    [OpenSpecScenario("user-accounts", "Local development run gets a sign-in user", "Existing users prevent seeding")]
    public async Task Start_DevelopmentWithExistingUser_CreatesNoUser()
    {
        await using var database = await IdentityDatabase.CreateAsync();
        using (var scope = database.Services.CreateScope())
        {
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var created = await userManager.CreateAsync(
                new ApplicationUser { UserName = ExistingUserEmail, Email = ExistingUserEmail, EmailConfirmed = true },
                Password);
            created.Succeeded.Should().BeTrue();
        }

        await database.StartSeederAsync(Environments.Development, ConfiguredCredentials);

        (await database.GetUserEmailsAsync()).Should().Equal(ExistingUserEmail);
    }

    [Test]
    [OpenSpecScenario("user-accounts", "Local development run gets a sign-in user", "Without configured credentials nothing is seeded")]
    public async Task Start_DevelopmentWithoutCredentials_CreatesNoUser()
    {
        await using var database = await IdentityDatabase.CreateAsync();

        await database.StartSeederAsync(Environments.Development, new DevelopmentUserOptions());

        (await database.GetUserEmailsAsync()).Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("user-accounts", "Local development run gets a sign-in user", "Outside Development nothing is seeded")]
    public async Task Start_ProductionWithCredentialsAndNoUsers_CreatesNoUser()
    {
        await using var database = await IdentityDatabase.CreateAsync();

        await database.StartSeederAsync(Environments.Production, ConfiguredCredentials);

        (await database.GetUserEmailsAsync()).Should().BeEmpty();
    }

    private sealed class IdentityDatabase : IAsyncDisposable
    {
        private readonly string _name;

        private IdentityDatabase(string name, ServiceProvider services)
        {
            _name = name;
            Services = services;
        }

        public ServiceProvider Services { get; }

        public static async Task<IdentityDatabase> CreateAsync()
        {
            var name = $"test_ebay_dev_user_{Guid.NewGuid():N}";
            var connectionString = PostgresTestServer.CreateDatabaseConnectionString(name);

            var services = new ServiceCollection();
            services.AddLogging();
            services.AddDataProtection();
            services.AddDbContextFactory<IdentityDbContext>(o =>
                o.UseNpgsql(connectionString, static b => b.MigrationsAssembly("Server.Adapters.Driven.EF.Identity.Migrations")));
            services.AddIdentityCore<ApplicationUser>(static o => o.Stores.MaxLengthForKeys = AppMaxLengthForKeys)
                .AddEntityFrameworkStores<IdentityDbContext>()
                .AddDefaultTokenProviders();

            var provider = services.BuildServiceProvider(new ServiceProviderOptions { ValidateOnBuild = true, ValidateScopes = true });
            var database = new IdentityDatabase(name, provider);

            await using var context = await provider.GetRequiredService<IDbContextFactory<IdentityDbContext>>()
                .CreateDbContextAsync(CancellationToken.None);
            await context.Database.MigrateAsync();

            return database;
        }

        public Task StartSeederAsync(string environmentName, DevelopmentUserOptions options)
        {
            var seeder = new DevelopmentUserSeeder(
                new HostingEnvironment { EnvironmentName = environmentName },
                Options.Create(options),
                Services.GetRequiredService<IServiceScopeFactory>(),
                Services.GetRequiredService<ILogger<DevelopmentUserSeeder>>());

            return seeder.StartAsync(CancellationToken.None);
        }

        public async Task<string?[]> GetUserEmailsAsync()
        {
            using var scope = Services.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            return await userManager.Users.Select(static u => u.Email).ToArrayAsync();
        }

        public async ValueTask DisposeAsync()
        {
            await Services.DisposeAsync();
            await PostgresTestServer.DropDatabaseAsync(_name);
        }
    }
}
