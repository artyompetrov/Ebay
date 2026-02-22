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
        builder.Host.UseDefaultServiceProvider(options =>
        {
            options.ValidateOnBuild = true;
            options.ValidateScopes = true;
        });
        
        // Add services to the container.
        builder.Services.AddMemoryCache();
        builder.Services.AddEmailAdapter(builder.Configuration);
        builder.Services.AddUTracerAdapter();
        builder.Services.AddChipFindAdapter();
        builder.Services.AddEfReadModelAdapter(builder.Configuration);
        builder.Services.AddApplicationServices(builder.Configuration);
        builder.Services.AddWebApiAdapter();
        builder.Services.AddEfWriteModelAdapter(builder.Configuration);
        builder.Services.AddHealthChecks();

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

        app.Services.UseEfWriteModelAdapter(ensureCreatedInsteadOfMigrate: app.Environment.IsEnvironment("Testing"));

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

    private static void ConfigureIdentity(IServiceCollection services, ConfigurationManager configuration)
    {
        services
            .AddOptions<AuthorizationClientOptions>()
            .BindConfiguration(AuthorizationClientOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        var options = new AuthorizationClientOptions();
        configuration.Bind(AuthorizationClientOptions.SectionName, options);

        services.AddDataProtection()
            .PersistKeysToFileSystem(new DirectoryInfo(options.DataProtectionKeysDirectory))
            .SetApplicationName("EbayHelper")
            .SetDefaultKeyLifetime(TimeSpan.FromDays(90));

        services.AddIdentityServer()
            .AddApiAuthorization<ApplicationUser, ApplicationDbContext>(o =>
                {
                    var spaClient = ClientBuilder
                        .SPA(WellKnown.ChromeExtension.ClientId)
                        .WithRedirectUri($"https://{options.Domain}/chrome_extensions/auth")
                        .WithLogoutRedirectUri($"https://{options.Domain}/chrome_extensions/logout")
                        .Build();
                    spaClient.AllowedCorsOrigins =
                    [
                        $"chrome-extension://{WellKnown.ChromeExtension.Id}",
                        "https://" + options.Domain
                    ];
                    spaClient.AccessTokenLifetime = (int)TimeSpan.FromDays(30).TotalSeconds;
                    o.Clients.Add(spaClient);

                    o.Clients.Add(
                        new Duende.IdentityServer.Models.Client
                        {
                            ClientId = options.ClientId,
                            ClientSecrets = [new Secret(options.ClientSecret.Sha256())],
                            AllowedGrantTypes = GrantTypes.ClientCredentials,
                            AllowedScopes = { options.Scope }
                        }
                    );
                }
            );

        services.AddAuthentication().AddIdentityServerJwt();
    }
}
