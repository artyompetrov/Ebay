using System.Net;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Server.Adapters.Driven.ScrapingProxy;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Как часто открывать новые соединения через прокси: мобильный прокси меняет внешний IP, а долгоживущее
    /// соединение держало бы старый. Совпадает со временем жизни обработчика по умолчанию в IHttpClientFactory.
    /// </summary>
    private static readonly TimeSpan PooledConnectionLifetime = TimeSpan.FromMinutes(2);

    /// <summary>
    /// Регистрирует настройки прокси (секция <c>ScrapingProxy</c>) с проверкой при старте хоста; повторный вызов ничего не делает, поэтому его вызывает
    /// каждый адаптер, которому нужен прокси.
    /// </summary>
    public static void AddScrapingProxyOptions(this IServiceCollection services)
    {
        if (services.Any(static d => d.ServiceType == typeof(IValidateOptions<ScrapingProxyOptions>)))
        {
            return;
        }

        services.AddOptions<ScrapingProxyOptions>()
            .BindConfiguration(ScrapingProxyOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();
    }

    /// <summary>
    /// Направляет запросы клиента через прокси из секции <c>ScrapingProxy</c>, а без адреса - напрямую,
    /// игнорируя системные настройки прокси процесса (<c>HTTP_PROXY</c>/<c>HTTPS_PROXY</c>). Обхода прокси
    /// при его ошибке нет: запрос просто падает. Требует <see cref="AddScrapingProxyOptions"/>.
    /// </summary>
    public static IHttpClientBuilder UseScrapingProxy(this IHttpClientBuilder builder) =>
        builder.ConfigurePrimaryHttpMessageHandler(static serviceProvider =>
            CreateHandler(serviceProvider.GetRequiredService<IOptions<ScrapingProxyOptions>>().Value));

    private static SocketsHttpHandler CreateHandler(ScrapingProxyOptions options)
    {
        var handler = new SocketsHttpHandler { PooledConnectionLifetime = PooledConnectionLifetime };

        if (options.AddressUri is not { } address)
        {
            handler.UseProxy = false;
            return handler;
        }

        handler.UseProxy = true;
        handler.Proxy = new WebProxy(address)
        {
            Credentials = options.HasCredentials ? new NetworkCredential(options.Username, options.Password) : null
        };

        return handler;
    }
}
