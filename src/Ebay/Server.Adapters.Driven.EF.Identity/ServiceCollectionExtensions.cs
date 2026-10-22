using Duende.IdentityServer.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Server.Adapters.Driven.PostgreSql;
using Secret = Duende.IdentityServer.Models.Secret;

namespace Server.Adapters.Driven.EF.Identity;

public static class ServiceCollectionExtensions
{
    public static void AddEfIdentityAdapter(this IServiceCollection services)
    {
        services.AddPostgreSqlOptions();

        // Non-pooled factory: IdentityDbContext also takes IOptions<OperationalStoreOptions> in its constructor, which
        // context pooling does not support. The factory also registers the context itself as scoped, which the
        // ASP.NET Identity and Duende operational stores (scoped library services) consume.
        services.AddDbContextFactory<IdentityDbContext>((sp, o) =>
        {
            var connectionString = sp.GetRequiredService<IOptions<PostgreSqlOptions>>().Value.DefaultConnection;
            o.UsePostgreSql(connectionString, b =>
                b.MigrationsAssembly("Server.Adapters.Driven.EF.Identity.Migrations"));
            o.AddInterceptors(sp.GetServices<IInterceptor>());
        });

        ConfigureIdentity(services);
        DisableRegistrationPages(services);

        services.AddSingleton<UnreadableSigningKeyCleaner>();
        services.AddHostedService<UnreadableSigningKeyCleanupHostedService>();

        MakeContextOptionsConfigurationsSingleton(services);
    }

    /// <summary>
    /// The application has no self-service sign-up: removing the routes of the registration-related Identity UI
    /// pages makes their handlers (including account creation) unreachable for any request.
    /// </summary>
    private static void DisableRegistrationPages(IServiceCollection services)
    {
        services.Configure<RazorPagesOptions>(static options =>
        {
            foreach (var page in WellKnown.IdentityUi.DisabledPages)
            {
                options.Conventions.AddAreaPageRouteModelConvention(
                    WellKnown.IdentityUi.Area,
                    page,
                    static model => model.Selectors.Clear());
            }
        });
    }

    /// <summary>
    /// Duende's <c>AddOperationalStore</c> (called by <c>AddApiAuthorization</c>) registers the context through
    /// <c>AddDbContext&lt;TContext&gt;</c>, which adds its options configuration with the scoped options lifetime.
    /// The singleton <see cref="IDbContextFactory{TContext}"/> reads every configuration, so a scoped one makes it
    /// unresolvable under <c>ValidateScopes</c>. The configuration itself is kept as is; only its lifetime changes.
    /// </summary>
    // TODO: Remove this workaround by fixing its cause: AddApiAuthorization (the deprecated
    // Microsoft.AspNetCore.ApiAuthorization.IdentityServer package, no releases for .NET 8+) hard-wires
    // AddOperationalStore, which goes through AddDbContext with scoped lifetimes. Configure Duende directly instead
    // (AddAspNetIdentity, clients/resources/signing credentials, operational stores via AddPersistedGrantStore<>/
    // AddDeviceFlowStore<>/AddSigningKeyStore<> with IPersistedGrantDbContext taken from our factory), so nothing
    // calls AddDbContext; ideally drop the package altogether (ApiAuthorizationDbContext, ClientBuilder,
    // ApiAuthorizationOptions, AddIdentityServerJwt). Deferred: it changes production authentication and needs
    // login coverage for the frontend and the Chrome extension.
    private static void MakeContextOptionsConfigurationsSingleton(IServiceCollection services)
    {
        var scopedConfigurations = services
            .Where(static d => d.ServiceType == typeof(IDbContextOptionsConfiguration<IdentityDbContext>) &&
                               d.Lifetime != ServiceLifetime.Singleton)
            .ToArray();

        foreach (var descriptor in scopedConfigurations)
        {
            // EF registers these configurations by a factory. Instance registrations are always singletons, so
            // nothing else can reach this point; anything unexpected stays as registered and fails the container's
            // scope validation on startup instead of being silently captured by a singleton.
            var singleton = descriptor switch
            {
                { ImplementationFactory: { } factory } => new ServiceDescriptor(descriptor.ServiceType, factory, ServiceLifetime.Singleton),
                { ImplementationType: { } type } => new ServiceDescriptor(descriptor.ServiceType, type, ServiceLifetime.Singleton),
                _ => descriptor
            };
            // Same position: EF applies options configurations in registration order.
            services[services.IndexOf(descriptor)] = singleton;
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

    /// <summary>
    /// Answers the paths of the disabled registration pages with <c>404 Not Found</c>. Without these endpoints the
    /// SPA fallback (<c>MapFallbackToFile</c>) would serve them as the frontend's <c>index.html</c>.
    /// </summary>
    public static void MapEfIdentityAdapter(this IEndpointRouteBuilder endpoints)
    {
        foreach (var page in WellKnown.IdentityUi.DisabledPages)
        {
            endpoints.Map($"/{WellKnown.IdentityUi.Area}{page}", static () => Results.NotFound());
        }
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
