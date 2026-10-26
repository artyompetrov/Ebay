using System.Collections.Concurrent;
using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Tests.Frontend;

/// <summary>
/// Serves the built Blazor frontend (its static web assets manifest) from a real Kestrel server, with a fake backend:
/// the authorization configuration, the telemetry relay (which records every posted batch) and the API answers a
/// test configures. <see cref="SignInScript"/> stores a signed-in user, so the app gets access tokens without a login.
/// </summary>
internal sealed class FrontendAppServer : IAsyncDisposable
{
    private const string ClientId = "Frontend";

    private readonly WebApplication _app;
    private readonly ConcurrentQueue<TelemetryPost> _posts = new();

    private FrontendAppServer(WebApplication app)
    {
        _app = app;
    }

    public string BaseAddress { get; private set; } = string.Empty;

    public IReadOnlyCollection<TelemetryPost> Posts => _posts;

    /// <summary>Stores a signed-in user in session storage before the app starts.</summary>
    public string SignInScript
    {
        get
        {
            var user = JsonSerializer.Serialize(new
            {
                id_token = "test-id-token",
                access_token = "test-access-token",
                token_type = "Bearer",
                scope = "openid profile",
                profile = new { sub = "test-user", name = "test@localhost" },
                expires_at = DateTimeOffset.UtcNow.AddHours(1).ToUnixTimeSeconds()
            });
            return $"sessionStorage.setItem({JsonSerializer.Serialize($"oidc.user:{BaseAddress}:{ClientId}")}, {JsonSerializer.Serialize(user)});";
        }
    }

    public static async Task<FrontendAppServer> StartAsync(Action<WebApplication> mapApi)
    {
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions
        {
            ApplicationName = "Frontend",
            ContentRootPath = AppContext.BaseDirectory,
            EnvironmentName = Environments.Production
        });
        builder.WebHost.UseSetting(WebHostDefaults.StaticWebAssetsKey,
            Path.Combine(AppContext.BaseDirectory, "Frontend.staticwebassets.runtime.json"));
        builder.WebHost.UseStaticWebAssets();
        builder.WebHost.UseUrls("http://127.0.0.1:0");
        builder.Logging.SetMinimumLevel(LogLevel.Warning);
        var app = builder.Build();
        var server = new FrontendAppServer(app);
        // The framework also downloads .dat (ICU) and .pdb files, which have no default content type.
        app.UseStaticFiles(new StaticFileOptions { ServeUnknownFileTypes = true, DefaultContentType = "application/octet-stream" });
        app.MapGet("/_configuration/" + ClientId, (HttpContext context) =>
        {
            var origin = $"{context.Request.Scheme}://{context.Request.Host}";
            return Results.Json(new Dictionary<string, string>
            {
                ["authority"] = origin,
                ["client_id"] = ClientId,
                ["redirect_uri"] = origin + "/authentication/login-callback",
                ["post_logout_redirect_uri"] = origin + "/authentication/logout-callback",
                ["response_type"] = "code",
                ["scope"] = "openid profile"
            });
        });
        app.MapGet("/api/telemetry/v1/settings", static () => Results.Json(new { minLevel = "Debug" }));
        app.MapPost("/api/telemetry/v1/{signal}", async (string signal, HttpContext context) =>
        {
            using var reader = new StreamReader(context.Request.Body);
            server._posts.Enqueue(new TelemetryPost(
                signal,
                await reader.ReadToEndAsync(context.RequestAborted),
                context.Request.Headers.ContainsKey("traceparent"),
                DateTimeOffset.UtcNow));
            return Results.Ok();
        });
        app.MapGet("/.well-known/openid-configuration", static () => Results.NotFound());
        mapApi(app);
        app.MapFallbackToFile("index.html");
        await app.StartAsync();
        var address = app.Services.GetRequiredService<IServer>().Features.Get<IServerAddressesFeature>()!.Addresses.First();
        server.BaseAddress = address.TrimEnd('/');
        return server;
    }

    public async ValueTask DisposeAsync() => await _app.DisposeAsync();

    internal sealed record TelemetryPost(string Signal, string Body, bool HasTraceParent, DateTimeOffset ReceivedAt);
}
