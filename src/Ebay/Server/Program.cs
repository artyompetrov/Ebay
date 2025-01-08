using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Server;
using Server.Controllers;
using Server.Controllers.Generated;
using Server.Data;
using Server.Data.Models;
using Server.HostedServices;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Secret = Duende.IdentityServer.Models.Secret;

IdentityModelEventSource.ShowPII = true;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new NullReferenceException("Connection string cannot be null");
builder.Services.AddNpgsqlDataSource(connectionString);
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql());
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddScoped<IEbayController, EbayControllerImplementation>();
builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddIdentityServer()
    .AddApiAuthorization<ApplicationUser, ApplicationDbContext>(
        options =>
        {
            var spaClient = ClientBuilder
                .SPA("Ebay.ChromeExtension")
                .WithRedirectUri("https://www.ebay.com/")
                .WithLogoutRedirectUri("https://www.ebay.com/logout")
                .Build();
            spaClient.AllowedCorsOrigins = [
                "chrome-extension://mlebgdemjnpnfgcgbbncllpniiicffbm"
            ];
            options.Clients.Add(spaClient);
            
            options.Clients.Add(
                new Duende.IdentityServer.Models.Client
                {
                    ClientId = WellKnown.Authorization.PythonClientId,
                    ClientSecrets = new List<Secret> { new(WellKnown.Authorization.AuthToken.Sha256()) },
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
    Path.Join(Path.GetTempPath(), "data_protection_keys_dir");

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(keyStoragePath))
    .SetApplicationName("EbayHelper");

builder.Services.AddAuthentication().AddIdentityServerJwt();

builder.Services.AddControllersWithViews(option => { option.Filters.Add<ErrorFilter>(); })
    .AddNewtonsoftJson();
builder.Services.AddRazorPages();
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
builder.Services.AddHostedService<CurrencyRateHostedService>();


var app = builder.Build();

// Migrate DB
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

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

app.UseAuthentication();
app.UseIdentityServer();
app.UseAuthorization();

app.MapRazorPages();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();