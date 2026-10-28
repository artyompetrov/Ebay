using System.Net;
using AwesomeAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Adapters.Driven.ChipFind;
using Server.Adapters.Driven.NewAudioPortal;
using Server.Adapters.Driven.Qrz;
using Server.Adapters.Driven.ScrapingProxy;
using Server.Application.Abstractions.Driven.Abstractions;
using Tests.Shared;
using Tests.Unit.Fakes;
using ChipFindWellKnown = Server.Adapters.Driven.ChipFind.WellKnown;
using NewAudioPortalWellKnown = Server.Adapters.Driven.NewAudioPortal.WellKnown;
using QrzWellKnown = Server.Adapters.Driven.Qrz.WellKnown;
using ScrapingProxyRegistration = Server.Adapters.Driven.ScrapingProxy.ServiceCollectionExtensions;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ScrapingProxyRegistration))]
public sealed class ScrapingProxyRegistrationTests
{
    private const string UnrelatedClientName = "unrelated";
    private const string ChangeIpClientName = "scraping-proxy-change-ip";

    private static readonly Uri ProxyAddress = new("http://proxy.example:8080");

    [Test]
    [OpenSpecScenario("scraping-proxy", "Without a configured proxy, scraping requests go directly", "No proxy address configured")]
    public async Task UseScrapingProxy_NoAddress_DisablesProxy()
    {
        await using var services = BuildServices(proxyAddress: null);

        foreach (var clientName in new[] { QrzWellKnown.HttpClientName, ChipFindWellKnown.HttpClientName, NewAudioPortalWellKnown.HttpClientName })
        {
            ScrapingProxyServices.GetPrimaryHandler(services, clientName).Should().BeOfType<SocketsHttpHandler>()
                .Which.UseProxy.Should().BeFalse(clientName);
        }
    }

    [Test]
    public async Task UseScrapingProxy_Address_ConfiguresProxyWithCredentials()
    {
        await using var services = BuildServices(ProxyAddress);

        foreach (var clientName in new[] { QrzWellKnown.HttpClientName, ChipFindWellKnown.HttpClientName, NewAudioPortalWellKnown.HttpClientName })
        {
            var handler = ScrapingProxyServices.GetPrimaryHandler(services, clientName).Should().BeOfType<SocketsHttpHandler>().Subject;
            handler.UseProxy.Should().BeTrue(clientName);
            var proxy = handler.Proxy.Should().BeOfType<WebProxy>().Subject;
            proxy.Address.Should().Be(ProxyAddress, clientName);
            proxy.Credentials.Should().BeOfType<NetworkCredential>()
                .Which.Should().BeEquivalentTo(
                    new { UserName = ScrapingProxyServices.Username, Password = ScrapingProxyServices.Password },
                    static options => options.ExcludingMissingMembers());
        }
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Other outgoing HTTP traffic is not proxied", "Unrelated HTTP client ignores the scraping proxy")]
    public async Task UseScrapingProxy_UnrelatedClient_IsNotConfiguredWithScrapingProxy()
    {
        await using var services = BuildServices(ProxyAddress, static services => services.AddHttpClient(UnrelatedClientName));

        var handler = ScrapingProxyServices.GetPrimaryHandler(services, UnrelatedClientName);

        // Без явного Proxy обработчик использует системные настройки процесса, а не прокси парсеров.
        handler.Should().BeOfType<SocketsHttpHandler>()
            .Which.Proxy.Should().BeNull();
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Invalid proxy settings fail startup", "Non-http proxy address")]
    public async Task AddScrapingProxy_InvalidAddress_FailsStartupValidation()
    {
        await using var services = BuildServices(new Uri("socks5://proxy.example:1080"));

        var validate = () => services.GetRequiredService<IStartupValidator>().Validate();

        validate.Should().Throw<OptionsValidationException>();
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "A failed probe switches the proxy exit IP and probes again", "IP change link is requested directly with a browser User-Agent")]
    public async Task AddScrapingProxy_ChangeIpClient_IsNotProxiedAndSendsBrowserUserAgent()
    {
        await using var services = BuildServices(ProxyAddress);

        // Без явного Proxy обработчик использует системные настройки процесса, а не прокси парсеров.
        ScrapingProxyServices.GetPrimaryHandler(services, ChangeIpClientName).Should().BeOfType<SocketsHttpHandler>()
            .Which.Proxy.Should().BeNull();
        services.GetRequiredService<IHttpClientFactory>().CreateClient(ChangeIpClientName)
            .DefaultRequestHeaders.UserAgent.ToString().Should().Be(ScrapingProxyDefaults.BrowserUserAgent);
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "A collection starts with a probe of the site's main page", "Each source probes its own main page")]
    public async Task Collections_WithProxyAddress_ProbeTheirOwnMainPageFirst()
    {
        var expectedProbes = new Dictionary<string, Uri>
        {
            [QrzWellKnown.HttpClientName] = new("https://www.qrz.ru/"),
            [ChipFindWellKnown.HttpClientName] = new("https://www.chipfind.ru/"),
            [NewAudioPortalWellKnown.HttpClientName] = new("https://newaudioportal.com/"),
        };
        // Проба не проходит (403), а ссылки смены IP нет: каждый сбор останавливается сразу после первого запроса.
        var handlers = expectedProbes.Keys.ToDictionary(
            static name => name,
            static _ => new ScriptedHandler(TimeProvider.System, static _ => HttpStatusCode.Forbidden));
        await using var services = BuildServices(ProxyAddress, services =>
        {
            foreach (var (name, handler) in handlers)
            {
                services.AddHttpClient(name).ConfigurePrimaryHttpMessageHandler(() => handler);
            }
        });

        foreach (var adapter in services.GetServices<ISaleAdvertisementAdapter>())
        {
            (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).IsT1.Should().BeTrue(adapter.Marketplace);
        }

        foreach (var (name, probeUri) in expectedProbes)
        {
            handlers[name].Requests.Should().ContainSingle(name)
                .Which.Should().Match<ScriptedHandler.RecordedRequest>(r => r.Method == HttpMethod.Get && r.Uri == probeUri);
        }
    }

    private static ServiceProvider BuildServices(Uri? proxyAddress, Action<IServiceCollection>? registerOther = null) =>
        ScrapingProxyServices.Build(
            services =>
            {
                services.AddQrzAdapter();
                services.AddChipFindAdapter();
                services.AddNewAudioPortalAdapter();
                registerOther?.Invoke(services);
            },
            proxyAddress,
            withCredentials: proxyAddress is not null);
}
