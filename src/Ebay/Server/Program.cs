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

        if (!builder.Environment.IsEnvironment("Testing"))
        {
            var keyStoragePath = Environment.GetEnvironmentVariable("DATA_PROTECTION_KEYS_DIR") ??
                                 Path.Join(path1: Path.GetTempPath(), path2: "data_protection_keys_dir");

            var clientId = Environment.GetEnvironmentVariable(WellKnown.Authorization.ClientId)
                           ?? "client_id";
            var authScope = Environment.GetEnvironmentVariable(WellKnown.Authorization.Scope)
                            ?? "scope";
            var clientSecret = Environment.GetEnvironmentVariable(WellKnown.Authorization.ClientSecret)
                               ?? "secret";

            builder.Services.AddDataProtection()
                .PersistKeysToFileSystem(new DirectoryInfo(keyStoragePath))
                .SetApplicationName("EbayHelper")
                .SetDefaultKeyLifetime(TimeSpan.FromDays(90));

            builder.Services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>(o =>
                    {
                        var domain = Environment.GetEnvironmentVariable("DOMAIN") ?? "localhost";

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

            builder.Services.AddAuthentication().AddIdentityServerJwt();
        }

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
}