using Duende.IdentityServer.Models;
using MassTransit;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Server;
using Server.Controllers;
using Server.Controllers.Generated;
using Server.Data;
using Server.Data.Models;
using Server.HostedServices;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Serilog;
using Server.Consumers;
using Server.Services;
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
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new NullReferenceException("Connection string cannot be null");
builder.Services.AddNpgsqlDataSource(connectionString);
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql());
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddSingleton<ShippingRatesService>();
builder.Services.AddScoped<IEbayController, EbayControllerImplementation>();
builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();

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
    Path.Join(path1: Path.GetTempPath(), path2: "data_protection_keys_dir");

builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(keyStoragePath))
    .SetApplicationName("EbayHelper");

builder.Services.AddAuthentication(options =>
    {
        // Это явное указание использовать куки-схему по умолчанию
        options.DefaultScheme = IdentityConstants.ApplicationScheme;
        options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
        options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
    })
    .AddIdentityServerJwt();

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


builder.Services.AddOptions<SqlTransportOptions>()
    .Configure(options =>
    {
        options.ConnectionString = connectionString;
    });

builder.Services.AddPostgresMigrationHostedService(x =>
{
    x.CreateDatabase = false;
    x.CreateInfrastructure = true;
});
builder.Services.AddMassTransit(
    x =>
    {
        x.AddConsumer<CalculatePricesForAllConsumer>();
        x.AddConsumer<CalculatePricesForProductConsumer>();
        x.AddConsumer<CalculatePricesForLotConsumer>();
        x.AddConsumer<CalculateTotalAveragePriceForProductConsumer>(
            c => c.Options<BatchOptions>(o =>
            {
                o.ConcurrencyLimit = 1;
                o.MessageLimit = 100;
            }));
        x.AddEntityFrameworkOutbox<ApplicationDbContext>(
            o =>
            {
                o.UsePostgres();
                o.UseBusOutbox();
            });

        x.AddSqlMessageScheduler();

        x.UsingPostgres(
            (context, cfg) =>
            {
                cfg.UseSqlMessageScheduler();

                cfg.ConfigureEndpoints(context);
            });

    });

var app = builder.Build();

builder.Services.AddResponseCaching();
app.UseSerilogRequestLogging();




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
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseIdentityServer();

app.MapGet("/auth/check", (HttpContext ctx) =>
{
    if (!ctx.User.Identity?.IsAuthenticated ?? true)
        return Results.Unauthorized();

    return Results.Ok();
});
app.UseWhen(ctx => IsBlazorStaticResource(ctx.Request), appBuilder =>
{
    appBuilder.Use(async (context, next) =>
    {
        if (!context.User.Identity?.IsAuthenticated ?? true)
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }

        await next();
    });
});

app.UseBlazorFrameworkFiles();
app.UseStaticFiles();
app.UseResponseCaching();
app.MapRazorPages();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();

static bool IsBlazorStaticResource(HttpRequest request)
{
    var path = request.Path.Value ?? string.Empty;

    return path.StartsWith("/_framework", StringComparison.OrdinalIgnoreCase)
           || path.StartsWith("/_content", StringComparison.OrdinalIgnoreCase)
           || path.EndsWith(".wasm", StringComparison.OrdinalIgnoreCase)
           || path.EndsWith(".dll", StringComparison.OrdinalIgnoreCase)
           || path.EndsWith("blazor.boot.json", StringComparison.OrdinalIgnoreCase)
           || path.EndsWith("blazor.webassembly.js", StringComparison.OrdinalIgnoreCase);
}