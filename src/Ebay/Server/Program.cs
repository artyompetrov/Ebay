using Duende.IdentityServer.Models;
using MassTransit;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.DataProtection.Repositories;
using Microsoft.Extensions.Options;
using OpenTelemetry.Logs;
using Server.Adapters.Driven.ChipFind;
using Server.Adapters.Driven.EF.ReadModel;
using Server.Adapters.Driven.EF.WriteModel;
using Server.Adapters.Driven.Smtp;
using Server.Adapters.Driven.uTracer;
using Server.Adapters.Driving.MassTransit.Consumers.MatchedPairs;
using Server.Adapters.Driving.WebApi;
using Server.Application;
using Server.Application.Consumers.EbayCurvesCacheWarmUp;
using Server.Adapters.Driving.MassTransit.Consumers.MeasurementWatching;
using Server.Application.Consumers.PriceCalculator;
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
        builder.Configuration.AddEnvironmentVariables(prefix: "ASPNETCORE_");

        builder.Host.UseDefaultServiceProvider(options =>
        {
            options.ValidateOnBuild = true;
            options.ValidateScopes = true;
        });


        // Add services to the container.
        builder.Services.AddMemoryCache();
        builder.Services.AddEmailAdapter();
        builder.Services.AddUTracerAdapter();
        builder.Services.AddChipFindAdapter();
        builder.Services.AddEfReadModelAdapter();
        builder.Services.AddApplicationServices();
        builder.Services.AddWebApiAdapter();
        builder.Services.AddEfWriteModelAdapter();
        builder.Services.AddHealthChecks();
        ConfigureMassTransit(builder.Services);

        ConfigureIdentity(builder.Services);
        AddOpenTelemetry(builder);


        builder.Services.AddResponseCaching();

        var app = builder.Build();

        app.Services.UseApplication();
        app.Services.UseEfWriteModelAdapter();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseMigrationsEndPoint();
            app.UseWebAssemblyDebugging();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseBlazorFrameworkFiles();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseResponseCaching();

        app.UseAuthentication();
        app.UseIdentityServer();
        app.UseAuthorization();

        app.MapRazorPages();
        app.MapControllers();
        app.MapHealthChecks("/api/health");
        app.MapFallbackToFile("index.html");

        app.Run();
    }


    private static void ConfigureMassTransit(IServiceCollection services)
    {
        services.AddOptions<SqlTransportOptions>()
            .Configure<IConfiguration>((o, cfg) =>
            {
                o.ConnectionString = cfg.GetConnectionString("DefaultConnection")
                                    ?? throw new InvalidOperationException("Connection string cannot be null");
            });

        services.AddPostgresMigrationHostedService(x =>
        {
            x.CreateDatabase = false;
            x.CreateInfrastructure = true;
        });

        services.AddMassTransit(x =>
        {
            x.AddConsumer<CalculatePricesForAllConsumer>();
            x.AddConsumer<CalculatePricesForProductConsumer>();
            x.AddConsumer<CalculatePricesForLotConsumer>();
            x.AddConsumer<MeasurementWatchedOnEbayConsumer>();
            x.AddConsumer<CalculateEbayCurvesForMeasurementConsumer>(c =>
            {
                c.UseConcurrencyLimit(10);
            });
            x.AddConsumer<MatchedPairsCalculatorConsumer>(c =>
            {
                c.UseConcurrencyLimit(1);
            });
            x.AddConsumer<CalculateTotalAveragePriceForProductConsumer>(c => c.Options<BatchOptions>(o =>
            {
                o.ConcurrencyLimit = 1;
                o.MessageLimit = 100;
            }));

            x.AddEntityFrameworkOutbox<WriteModelDbContext>(o =>
            {
                o.UsePostgres();
                o.UseBusOutbox();
            });

            x.AddSqlMessageScheduler();

            x.UsingPostgres((context, cfg) =>
            {
                cfg.UseSqlMessageScheduler();
                cfg.ConfigureEndpoints(context);
            });
        });
    }

    private static void AddOpenTelemetry(WebApplicationBuilder builder)
    {
        builder.Logging.ClearProviders();

        builder.Logging.AddConsole();
        builder.Logging.SetMinimumLevel(LogLevel.Information);

        builder.Logging.AddOpenTelemetry(o =>
        {
            o.IncludeScopes = true;
            o.IncludeFormattedMessage = true;
            o.ParseStateValues = true;
            o.AddOtlpExporter();
        });
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

        services.AddIdentityServer()
            .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

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
