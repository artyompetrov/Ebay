using System.Runtime.InteropServices.JavaScript;
using Client.Clients.Generated;
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

        var builder = WebAssemblyHostBuilder.CreateDefault(args);
        // Same strict container validation as the server host, in every environment.
        builder.ConfigureContainer(new DefaultServiceProviderFactory(new ServiceProviderOptions
        {
            ValidateOnBuild = true,
            ValidateScopes = true
        }));
        builder.RootComponents.Add<App>("#app");
        builder.RootComponents.Add<HeadOutlet>("head::after");

        builder.Services.AddHttpClient(
                name: ServerApiHttpClientName,
                client => client.BaseAddress = new Uri(builder.HostEnvironment.BaseAddress))
            .AddHttpMessageHandler<BaseAddressAuthorizationMessageHandler>();

        // The API client uses the named "ServerAPI" HttpClient, which attaches access tokens to requests to the server.
        // Singleton: a Blazor WebAssembly app has a single DI scope for its whole lifetime, so this keeps the lifetime
        // the client already had; the browser fetch handler has no connection pooling or DNS state to refresh.
        builder.Services.AddSingleton(static sp =>
            new WebApiClient(sp.GetRequiredService<IHttpClientFactory>().CreateClient(ServerApiHttpClientName)));

        builder.Services.AddApiAuthorization();

        if (OperatingSystem.IsBrowser())
        {
            // The scanner uses the browser camera through JS interop, so it exists only in the browser.
            builder.Services.AddSingleton<IBarcodeScanner, BarcodeScanner>();
            await JSHost.ImportAsync(moduleName: "interop", moduleUrl: "/js/interop.js");
        }

        await builder.Build().RunAsync();
    }
}