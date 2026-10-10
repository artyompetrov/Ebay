using Duende.IdentityServer.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Secret = Duende.IdentityServer.Models.Secret;

namespace Server.Adapters.Driven.EF.Identity;

public static class ServiceCollectionExtensions
{
    public static void AddEfIdentityAdapter(this IServiceCollection services)
    {
        services.AddDbContext<IdentityDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            o.UseNpgsql(connectionString, b =>
                b.MigrationsAssembly("Server.Adapters.Driven.EF.Identity.Migrations"));
            o.AddInterceptors(sp.GetServices<IInterceptor>());
        });

        ConfigureIdentity(services);
    }

    /// <summary>
    /// Встраивает в конвейер аутентификацию, IdentityServer и авторизацию - в этом порядке.
    /// </summary>
    public static void UseEfIdentityAdapterAuthentication(this IApplicationBuilder app)
    {
        app.UseAuthentication();
        app.UseIdentityServer();
        app.UseAuthorization();
    }

    public static void UseEfIdentityAdapter(this IServiceProvider serviceProvider)
    {
        using var serviceScope = serviceProvider.CreateScope();

        var identityDbContext = serviceScope.ServiceProvider.GetRequiredService<IdentityDbContext>();

        identityDbContext.Database.Migrate();
    }

    private static void ConfigureIdentity(IServiceCollection services)
    {
        services
            .AddOptions<AuthorizationClientOptions>()
            .BindConfiguration(AuthorizationClientOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services
            .AddDataProtection()
            .SetApplicationName("EbayHelper")
            .SetDefaultKeyLifetime(TimeSpan.FromDays(90));

        services.AddOptions<KeyManagementOptions>()
            .Configure<IOptions<AuthorizationClientOptions>, ILoggerFactory>(
                (options, authorizationClientOptions, loggerFactory) =>
                {
                    var directory = Directory.CreateDirectory(
                        authorizationClientOptions.Value.DataProtectionKeysDirectory
                    );

                    options.XmlRepository = new FileSystemXmlRepository(directory, loggerFactory);
                }
            );

        services.AddDefaultIdentity<ApplicationUser>(o => o.SignIn.RequireConfirmedAccount = true)
            .AddEntityFrameworkStores<IdentityDbContext>();

        services.AddIdentityServer()
            .AddApiAuthorization<ApplicationUser, IdentityDbContext>();

        services.AddOptions<ApiAuthorizationOptions>()
            .PostConfigure<IOptions<AuthorizationClientOptions>>(
                (options, authorizationClientOptions) =>
                {
                    var authorizationOptions = authorizationClientOptions.Value;

                    var frontendClient = ClientBuilder
                        .IdentityServerSPA("Frontend")
                        .WithRedirectUri("/authentication/login-callback")
                        .WithLogoutRedirectUri("/authentication/logout-callback")
                        .WithScopes("openid", "profile", authorizationOptions.Scope)
                        .Build();
                    options.Clients.Add(frontendClient);

                    var spaClient = ClientBuilder
                        .SPA(WellKnown.ChromeExtension.ClientId)
                        .WithRedirectUri($"https://{authorizationOptions.Domain}/chrome_extensions/auth")
                        .WithLogoutRedirectUri($"https://{authorizationOptions.Domain}/chrome_extensions/logout")
                        .WithScopes(authorizationOptions.Scope)
                        .Build();

                    spaClient.AllowedCorsOrigins =
                    [
                        $"chrome-extension://{WellKnown.ChromeExtension.Id}",
                        "https://" + authorizationOptions.Domain
                    ];
                    spaClient.AccessTokenLifetime = (int)TimeSpan.FromDays(30).TotalSeconds;
                    options.Clients.Add(spaClient);

                    options.Clients.Add(
                        new Duende.IdentityServer.Models.Client
                        {
                            ClientId = authorizationOptions.ClientId,
                            ClientSecrets = [new Secret(authorizationOptions.ClientSecret.Sha256())],
                            AllowedGrantTypes = GrantTypes.ClientCredentials,
                            AllowedScopes = { authorizationOptions.Scope }
                        }
                    );
                }
            );

        services.AddAuthentication().AddIdentityServerJwt();
    }
}
