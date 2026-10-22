using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Tests.Unit.Fakes;

/// <summary>
/// Контейнер с регистрациями адаптеров и настройками прокси из памяти - как в хосте, но без него.
/// </summary>
internal static class ScrapingProxyServices
{
    public const string Username = "user";
    public const string Password = "secret";

    public static string ExpectedBasicCredentials { get; } =
        "Basic " + Convert.ToBase64String(Encoding.UTF8.GetBytes($"{Username}:{Password}"));

    public static ServiceProvider Build(
        Action<IServiceCollection> registerAdapters,
        Uri? proxyAddress,
        bool withCredentials,
        IReadOnlyDictionary<string, string?>? extraSettings = null)
    {
        var settings = new Dictionary<string, string?>(extraSettings ?? new Dictionary<string, string?>())
        {
            // Без прокси - пустая строка, как из docker-compose (`${SCRAPING_PROXY_ADDRESS:-}`).
            ["ScrapingProxy:Address"] = proxyAddress?.ToString() ?? "",
        };

        if (withCredentials)
        {
            settings["ScrapingProxy:Username"] = Username;
            settings["ScrapingProxy:Password"] = Password;
        }

        var services = new ServiceCollection();
        services.AddSingleton<IConfiguration>(new ConfigurationBuilder().AddInMemoryCollection(settings).Build());
        services.AddLogging();
        registerAdapters(services);
        return services.BuildServiceProvider(new ServiceProviderOptions { ValidateOnBuild = true, ValidateScopes = true });
    }

    /// <summary>
    /// Первичный обработчик именованного клиента: снимает обёртки IHttpClientFactory (DelegatingHandler).
    /// </summary>
    public static HttpMessageHandler GetPrimaryHandler(IServiceProvider serviceProvider, string clientName)
    {
        HttpMessageHandler handler = serviceProvider.GetRequiredService<IHttpMessageHandlerFactory>().CreateHandler(clientName);
        while (handler is DelegatingHandler { InnerHandler: { } inner })
        {
            handler = inner;
        }

        return handler;
    }
}
