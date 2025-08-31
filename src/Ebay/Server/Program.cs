using Duende.IdentityServer.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.IdentityModel.Logging;
using OpenTelemetry.Logs;
using OpenTelemetry.Resources;
using Server;
using Server.Adapters.ChipFind;
using Server.Adapters.Smtp;
using Server.Application;
using Server.Application.Data;
using Server.Application.Data.Models;
using Secret = Duende.IdentityServer.Models.Secret;

//IdentityModelEventSource.ShowPII = true;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var options = new EbayServerOptions();
builder.Configuration.Bind("EbayServer", options);
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new NullReferenceException("Connection string cannot be null");
builder.Services.AddEmailAdapter(builder.Configuration);
builder.Services.AddChipFindAdapter();
builder.Services.AddApplicationServices(options, connectionString);

var keyStoragePath = Environment.GetEnvironmentVariable("DATA_PROTECTION_KEYS_DIR") ??
                     Path.Join(path1: Path.GetTempPath(), path2: "data_protection_keys_dir");

var clientId = Environment.GetEnvironmentVariable(WellKnown.Authorization.ClientId)
               ?? "client_id";
var scope = Environment.GetEnvironmentVariable(WellKnown.Authorization.Scope)
           ?? "scope";
var clientSecret = Environment.GetEnvironmentVariable(WellKnown.Authorization.ClientSecret)
                  ?? "secret";

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(keyStoragePath))
    .SetApplicationName("EbayHelper")
    .SetDefaultKeyLifetime(TimeSpan.FromDays(90));

builder.Services.AddIdentityServer()
    .AddApiAuthorization<ApplicationUser, ApplicationDbContext>(
        o =>
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
            spaClient.AccessTokenLifetime = (int)TimeSpan.FromDays(30).TotalSeconds;
            o.Clients.Add(spaClient);

            o.Clients.Add(
                new Duende.IdentityServer.Models.Client
                {
                    ClientId = clientId,
                    ClientSecrets = new List<Secret> { new(clientSecret.Sha256()) },
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    AllowedScopes =
                    {
                        scope
                    }
                }
            );
        }
    );



builder.Services.AddAuthentication().AddIdentityServerJwt();

builder.Logging.ClearProviders();

builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Trace);
builder.Logging.AddFilter("Npgsql.Command", LogLevel.Trace);
builder.Logging.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Trace);

builder.Logging.AddOpenTelemetry(o =>
{
    o.IncludeScopes = true;
    o.IncludeFormattedMessage = true;
    o.ParseStateValues = true;
    o.AddOtlpExporter();
});

builder.Services.AddResponseCaching();




var app = builder.Build();

app.Services.InitializeApplication();

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
