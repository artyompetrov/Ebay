using System.Diagnostics;
using System.Runtime.InteropServices.JavaScript;
using Client.Clients.Generated;
using Client.Telemetry;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.Extensions.DependencyInjection;
namespace Client;

public class Program
{
    private const string ServerApiHttpClientName = "ServerAPI";

    public static async Task Main(string[] args)
    {
        // Only TracingMessageHandler sends trace context, and only to the backend (openspec/specs/client-telemetry).
        DistributedContextPropagator.Current = DistributedContextPropagator.CreateNoOutputPropagator();

        var builder = WebAssemblyHostBuilder.CreateDefault(args);
        // Same strict container validation as the server host, in every environment.
        builder.ConfigureContainer(new DefaultServiceProviderFactory(new ServiceProviderOptions
        {
            ValidateOnBuild = true,
            ValidateScopes = true
        }));
        builder.RootComponents.Add<App>("#app");
        builder.RootComponents.Add<HeadOutlet>("head::after");

        var backendBaseAddress = new Uri(builder.HostEnvironment.BaseAddress);
        builder.Services.AddFrontendTelemetry(backendBaseAddress);
        builder.Services.AddHttpClient(
                name: ServerApiHttpClientName,
                client => client.BaseAddress = backendBaseAddress)
            .AddTracing(backendBaseAddress)
            .AddHttpMessageHandler<BaseAddressAuthorizationMessageHandler>();

        // The API client uses the named "ServerAPI" HttpClient, which attaches access tokens to requests to the server.
        // Singleton: a Blazor WebAssembly app has a single DI scope for its whole lifetime, so this keeps the lifetime
        // the client already had; the browser fetch handler has no connection pooling or DNS state to refresh.
        builder.Services.AddSingleton(static sp =>
            new WebApiClient(sp.GetRequiredService<IHttpClientFactory>().CreateClient(ServerApiHttpClientName)));

        builder.Services.AddApiAuthorization();

        if (!OperatingSystem.IsBrowser())
        {
            throw new UnreachableException("The frontend runs only in the browser (Blazor WebAssembly).");
        }

        // Browser-only services: they use JS interop.
        builder.Services.AddSingleton<Interop>();
        builder.Services.AddSingleton<IBarcodeScanner, BarcodeScanner>();
        builder.Services.AddSingleton<IBrowserTelemetry, BrowserTelemetry>();
        await JSHost.ImportAsync(moduleName: "interop", moduleUrl: "/js/interop.js");
        await BrowserTelemetry.StartAsync();

        var host = builder.Build();
        var exporter = host.Services.StartFrontendTelemetry();
        TelemetryJsExports.Attach(exporter);
        _ = exporter.RunAsync(CancellationToken.None);
        await host.RunAsync();
    }
}
