using System.Net;
using AwesomeAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Adapters.Driven.ChipFind;
using Server.Adapters.Driven.Qrz;
using Tests.Shared;
using Tests.Unit.Fakes;
using ChipFindWellKnown = Server.Adapters.Driven.ChipFind.WellKnown;
using QrzWellKnown = Server.Adapters.Driven.Qrz.WellKnown;
using ScrapingProxyRegistration = Server.Adapters.Driven.ScrapingProxy.ServiceCollectionExtensions;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ScrapingProxyRegistration))]
public sealed class ScrapingProxyRegistrationTests
{
    private const string UnrelatedClientName = "unrelated";

    private static readonly Uri ProxyAddress = new("http://proxy.example:8080");

    [Test]
    [OpenSpecScenario("scraping-proxy", "Without a configured proxy, scraping requests go directly", "No proxy address configured")]
    public async Task UseScrapingProxy_NoAddress_DisablesProxy()
    {
        await using var services = BuildServices(proxyAddress: null);

        foreach (var clientName in new[] { QrzWellKnown.HttpClientName, ChipFindWellKnown.HttpClientName })
        {
            ScrapingProxyServices.GetPrimaryHandler(services, clientName).Should().BeOfType<SocketsHttpHandler>()
                .Which.UseProxy.Should().BeFalse(clientName);
        }
    }

    [Test]
    public async Task UseScrapingProxy_Address_ConfiguresProxyWithCredentials()
    {
        await using var services = BuildServices(ProxyAddress);

        foreach (var clientName in new[] { QrzWellKnown.HttpClientName, ChipFindWellKnown.HttpClientName })
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
    public async Task AddScrapingProxyOptions_InvalidAddress_FailsStartupValidation()
    {
        await using var services = BuildServices(new Uri("socks5://proxy.example:1080"));

        var validate = () => services.GetRequiredService<IStartupValidator>().Validate();

        validate.Should().Throw<OptionsValidationException>();
    }

    private static ServiceProvider BuildServices(Uri? proxyAddress, Action<IServiceCollection>? registerOther = null) =>
        ScrapingProxyServices.Build(
            services =>
            {
                services.AddQrzAdapter();
                services.AddChipFindAdapter();
                registerOther?.Invoke(services);
            },
            proxyAddress,
            withCredentials: proxyAddress is not null);
}
