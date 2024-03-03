using Duende.IdentityServer.Models;
using Ebay.Server;
using Ebay.Server.Controllers;
using Ebay.Server.Controllers.Generated;
using Ebay.Server.Data;
using Ebay.Server.Data.Models;
using Ebay.Server.HostedServices;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Client = Duende.IdentityServer.Models.Client;
using Secret = Duende.IdentityServer.Models.Secret;

IdentityModelEventSource.ShowPII = true;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
builder.Services.AddScoped<IEbayController, EbayControllerImplementation>();
builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddIdentityServer()
    .AddApiAuthorization<ApplicationUser, ApplicationDbContext>(
        options =>
        {
            options.Clients.Add(
                new Client
                {
                    ClientId = "Ebay.Python",
                    ClientSecrets = new List<Secret>() { new("ac4ab670-ae20-451a-ab4a-3a20275e807d".Sha256()) },
                    AllowedGrantTypes = GrantTypes.ClientCredentials,
                    AllowedScopes =
                    {
                        "Ebay.ServerAPI"
                    }
                });
        });

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

app.UseIdentityServer();
app.UseAuthentication();
app.UseAuthorization();

app.MapRazorPages();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();