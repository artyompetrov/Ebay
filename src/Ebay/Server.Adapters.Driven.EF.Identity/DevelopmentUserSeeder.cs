using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Server.Adapters.Driven.EF.Identity;

/// <summary>
/// Creates the <see cref="DevelopmentUserOptions" /> user on start, so a local run can be signed in to without
/// registration (the application has none). All three gates are required: the <c>Development</c> environment,
/// configured credentials and no users in the database. Production has neither of the first two, and the last one
/// keeps a known password away from a database that already has real accounts.
/// </summary>
internal sealed class DevelopmentUserSeeder : IHostedService
{
    private readonly IHostEnvironment _environment;
    private readonly DevelopmentUserOptions _options;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<DevelopmentUserSeeder> _logger;

    public DevelopmentUserSeeder(
        IHostEnvironment environment,
        IOptions<DevelopmentUserOptions> options,
        IServiceScopeFactory scopeFactory,
        ILogger<DevelopmentUserSeeder> logger)
    {
        _environment = environment;
        _options = options.Value;
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.Email) || string.IsNullOrWhiteSpace(_options.Password))
        {
            return;
        }

        if (!_environment.IsDevelopment())
        {
            _logger.LogWarning(
                "Development user credentials are configured in the {Environment} environment; they are ignored outside Development",
                _environment.EnvironmentName);
            return;
        }

        // UserManager is a scoped Identity service.
        using var scope = _scopeFactory.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        if (await userManager.Users.AnyAsync(cancellationToken))
        {
            _logger.LogDebug("Development user is not created: the database already has users");
            return;
        }

        var result = await userManager.CreateAsync(
            new ApplicationUser { UserName = _options.Email, Email = _options.Email, EmailConfirmed = true },
            _options.Password);

        if (result.Succeeded)
        {
            _logger.LogInformation("Development user {Email} is created", _options.Email);
        }
        else
        {
            _logger.LogWarning(
                "Development user {Email} is not created: {Errors}",
                _options.Email,
                string.Join("; ", result.Errors.Select(static e => e.Description)));
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
