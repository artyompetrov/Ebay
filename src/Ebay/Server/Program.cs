using Duende.IdentityServer.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using OpenTelemetry.Logs;
using Server.Adapters.Driven.ChipFind;
using Server.Adapters.Driven.EF.ReadModel;
using Server.Adapters.Driven.EF.WriteModel;
using Server.Adapters.Driven.Smtp;
using Server.Adapters.Driven.uTracer;
using Server.Adapters.Driving.WebApi;
using Server.Application;
using Server.Application.Data;
using Server.Configuration;
using Secret = Duende.IdentityServer.Models.Secret;

namespace Server;

public class Program
{
    public static void Main(string[] args)
    {

        //IdentityModelEventSource.ShowPII = true;

        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddMemoryCache();
        builder.Services.AddEmailAdapter(builder.Configuration);
        builder.Services.AddUTracerAdapter();
        builder.Services.AddChipFindAdapter();
        builder.Services.AddEfReadModelAdapter(builder.Configuration);
        builder.Services.AddApplicationServices(builder.Configuration);
        builder.Services.AddWebApiAdapter();
        builder.Services.AddEfWriteModelAdapter();
        builder.Services.AddHealthChecks();

        builder.Services
            .AddOptions<AuthorizationClientOptions>()
            .Bind(builder.Configuration.GetSection(AuthorizationClientOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        ConfigureIdentity(builder.Services, builder.Configuration);

        builder.Logging.ClearProviders();

        builder.Logging.AddConsole();
        builder.Logging.SetMinimumLevel(LogLevel.Trace);

        builder.Logging.AddOpenTelemetry(o =>
        {
            o.IncludeScopes = true;
            o.IncludeFormattedMessage = true;
            o.ParseStateValues = true;
            _ = o.AddOtlpExporter();
        });

        builder.Services.AddResponseCaching();

        var app = builder.Build();
        app.UseApplication(ensureCreatedInsteadOfMigrate: app.Environment.IsEnvironment("Testing"));

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            _ = app.UseMigrationsEndPoint();
            app.UseWebAssemblyDebugging();
        }
        else
        {
            _ = app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            _ = app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseBlazorFrameworkFiles();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseResponseCaching();

        if (!app.Environment.IsEnvironment("Testing"))
        {
            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();
        }

        app.MapRazorPages();
        app.MapControllers();
        app.MapHealthChecks("/api/health");
        app.MapFallbackToFile("index.html");

        app.Run();
    }

    private static void ConfigureIdentity(IServiceCollection services, IConfiguration configuration)
    {
        var options = configuration
            .GetRequiredSection(AuthorizationClientOptions.SectionName)
            .Get<AuthorizationClientOptions>()
            ?? throw new InvalidOperationException(
                $"{AuthorizationClientOptions.SectionName} configuration section is required.");

        var keyStoragePath = Environment.GetEnvironmentVariable("DATA_PROTECTION_KEYS_DIR")
                             ?? options.DataProtectionKeysDirectory;
        var domain = Environment.GetEnvironmentVariable("DOMAIN")
                     ?? options.Domain;
        var clientId = Environment.GetEnvironmentVariable(WellKnown.Authorization.ClientId)
                       ?? options.ClientId;
        var authScope = Environment.GetEnvironmentVariable(WellKnown.Authorization.Scope)
                        ?? options.Scope;
        var clientSecret = Environment.GetEnvironmentVariable(WellKnown.Authorization.ClientSecret)
                           ?? options.ClientSecret;

        services.AddDataProtection()
            .PersistKeysToFileSystem(new DirectoryInfo(keyStoragePath))
            .SetApplicationName("EbayHelper")
            .SetDefaultKeyLifetime(TimeSpan.FromDays(90));

        services.AddIdentityServer()
            .AddApiAuthorization<ApplicationUser, ApplicationDbContext>(o =>
                {
                    var spaClient = ClientBuilder
                        .SPA(WellKnown.ChromeExtension.ClientId)
                        .WithRedirectUri($"https://{domain}/chrome_extensions/auth")
                        .WithLogoutRedirectUri($"https://{domain}/chrome_extensions/logout")
                        .Build();
                    spaClient.AllowedCorsOrigins =
                    [
                        $"chrome-extension://{WellKnown.ChromeExtension.Id}",
                        "https://" + domain
                    ];
                    spaClient.AccessTokenLifetime = (int)TimeSpan.FromDays(30).TotalSeconds;
                    o.Clients.Add(spaClient);

                    o.Clients.Add(
                        new Duende.IdentityServer.Models.Client
                        {
                            ClientId = clientId,
                            ClientSecrets = [new Secret(clientSecret.Sha256())],
                            AllowedGrantTypes = GrantTypes.ClientCredentials,
                            AllowedScopes = { authScope }
                        }
                    );
                }
            );

        services.AddAuthentication().AddIdentityServerJwt();
    }
}
