using Duende.IdentityServer.Models;
using MassTransit;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Serilog;
using Server;
using Server.Adapters.ChipFind;
using Server.Application;
using Server.Application.Consumers;
using Server.Application.Controllers;
using Server.Application.Data;
using Server.Controllers.Generated;
using Server.Application.Data.Models;
using Server.Application.HostedServices.ChipFind;
using Server.Application.HostedServices.Currencies;
using Server.Application.Pages;
using Server.Application.Services;
using Secret = Duende.IdentityServer.Models.Secret;

IdentityModelEventSource.ShowPII = true;

var builder = WebApplication.CreateBuilder(args);

// Настройка Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
var options = new EbayServerOptions();
builder.Configuration.Bind("EbayServer", options);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new NullReferenceException("Connection string cannot be null");

builder.Services.AddApplicationServices(options, connectionString);

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddSingleton<IChipfindAdapter, ChipfindAdapter>();

builder.Services.AddIdentityServer()
    .AddApiAuthorization<ApplicationUser, ApplicationDbContext>(
        options =>
        {
            var domain = Environment.GetEnvironmentVariable("DOMAIN") ?? "localhost";

            var spaClient = ClientBuilder
                .SPA(WellKnown.ChromeExtension.ClientId)
                .WithRedirectUri($"https://{domain}/chrome_extensions/auth")
                .WithLogoutRedirectUri($"https://{domain}/chrome_extensions/logout")
                .Build();
            spaClient.AllowedCorsOrigins = [
                $"chrome-extension://{WellKnown.ChromeExtension.Id}",
                "https://" + domain
            ];
            options.Clients.Add(spaClient);

            options.Clients.Add(
                new Client
                {
                    ClientId = WellKnown.Authorization.PythonClientId,
                    ClientSecrets = new List<Secret> { new(WellKnown.Authorization.ClientSecret.Sha256()) },
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    AllowedScopes =
                    {
                        WellKnown.Authorization.Scope
                    }
                }
            );
        }
    );

var keyStoragePath = Environment.GetEnvironmentVariable("DATA_PROTECTION_KEYS_DIR") ??
    Path.Join(path1: Path.GetTempPath(), path2: "data_protection_keys_dir");

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(keyStoragePath))
    .SetApplicationName("EbayHelper");

builder.Services.AddAuthentication().AddIdentityServerJwt();

builder.Services.AddControllersWithViews(option => { option.Filters.Add<ErrorFilter>(); })
    .AddNewtonsoftJson();
builder.Services.AddRazorPages().AddApplicationPart(typeof(MeasurementPage).Assembly);
builder.Services.AddLogging(
    options =>
    {
        options.AddSimpleConsole(
            c =>
            {
                c.TimestampFormat = "[yyyy-MM-dd HH:mm:ss] ";
                c.UseUtcTimestamp = true;
            });
    });

var app = builder.Build();

builder.Services.AddResponseCaching();

app.Services.InitializeApplication();

app.UseSerilogRequestLogging();


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
app.MapFallbackToFile("index.html");

app.Run();