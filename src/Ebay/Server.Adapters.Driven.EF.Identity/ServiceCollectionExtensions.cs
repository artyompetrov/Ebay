using Duende.IdentityServer.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Infrastructure;
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
        // Non-pooled factory: IdentityDbContext also takes IOptions<OperationalStoreOptions> in its constructor, which
        // context pooling does not support. The factory also registers the context itself as scoped, which the
        // ASP.NET Identity and Duende operational stores (scoped library services) consume.
        services.AddDbContextFactory<IdentityDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("DefaultConnection")
                                   ?? throw new InvalidOperationException("Connection string cannot be null");
            o.UseNpgsql(connectionString, b =>
                b.MigrationsAssembly("Server.Adapters.Driven.EF.Identity.Migrations"));
            o.AddInterceptors(sp.GetServices<IInterceptor>());
        });

        ConfigureIdentity(services);

        MakeContextOptionsConfigurationsSingleton(services);
    }

    /// <summary>
    /// Duende's <c>AddOperationalStore</c> (called by <c>AddApiAuthorization</c>) registers the context through
    /// <c>AddDbContext&lt;TContext&gt;</c>, which adds its options configuration with the scoped options lifetime.
    /// The singleton <see cref="IDbContextFactory{TContext}"/> reads every configuration, so a scoped one makes it
    /// unresolvable under <c>ValidateScopes</c>. The configuration itself is kept as is; only its lifetime changes.
    /// </summary>
    private static void MakeContextOptionsConfigurationsSingleton(IServiceCollection services)
    {
        var scopedConfigurations = services
            .Where(static d => d.ServiceType == typeof(IDbContextOptionsConfiguration<IdentityDbContext>) &&
                               d.Lifetime != ServiceLifetime.Singleton)
            .ToArray();

        foreach (var descriptor in scopedConfigurations)
        {
            var factory = descriptor.ImplementationFactory ?? throw new InvalidOperationException(
                $"{descriptor.ServiceType} is expected to be registered by a factory.");
            // Same position: EF applies options configurations in registration order.
            services[services.IndexOf(descriptor)] =
                new ServiceDescriptor(descriptor.ServiceType, factory, ServiceLifetime.Singleton);
        }
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
        using var identityDbContext = serviceProvider
            .GetRequiredService<IDbContextFactory<IdentityDbContext>>()
            .CreateDbContext();

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
