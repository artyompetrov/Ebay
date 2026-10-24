using System.Globalization;
using System.Net;
using System.Net.Sockets;
using AwesomeAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Adapters.Driven.Qrz;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Models;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(QrzAdapter))]
public sealed class QrzAdapterTests
{
    private const string ListPagePath = "/classifieds/category/components/tubes";
    private const string ListingHref = "/classifieds/detail/radiolampy-6s19p-w_439891";
    private const string SellerHash = "af7abbd4175636376db6b7c22d1809c8";

    private const string SellType = "type=0";

    // Now = 15:00 по Москве: «Сегодня 14:30» попадает в двухчасовое окно свежести, «Сегодня 11:00» - нет.
    private const string RecentDate = "Сегодня 14:30";
    private const string StaleDate = "Сегодня 11:00";

    private static readonly DateTimeOffset Now = new(2026, 10, 18, 12, 0, 0, TimeSpan.Zero);

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Configured categories are polled for offers only", "One category produces three list requests")]
    [OpenSpecScenario("qrz-monitoring", "Recent list pages are read until entries get older than the lookback window", "Paging stops at a page older than the lookback window")]
    public async Task GetRecentAdvertisementsAsync_FirstPagesOlderThanLookback_RequestsOnlyFirstPageForSellExchangeAndGiveAway()
    {
        var handler = new RoutingHandler(listPage: static query => QrzHtml.ListPage(QrzHtml.ListEntry(DetailHref(OfferTypeId(query)), StaleDate)));
        var adapter = CreateAdapter(handler, ["components/tubes"]);

        var advertisements = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        advertisements.Should().HaveCount(3);
        ListRequests(handler).Should().BeEquivalentTo(
        [
            $"{ListPagePath}?o=date&type=0",
            $"{ListPagePath}?o=date&type=2",
            $"{ListPagePath}?o=date&type=3"
        ]);
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Recent list pages are read until entries get older than the lookback window", "Next page is read while the page has recent entries")]
    [OpenSpecScenario("qrz-monitoring", "Recent list pages are read until entries get older than the lookback window", "Later pages contribute only recent listings")]
    public async Task GetRecentAdvertisementsAsync_PagesWithRecentEntries_ReadsNextPagesUntilStalePage()
    {
        var handler = new RoutingHandler(listPage: static query => (IsSellType(query), GetPage(query)) switch
        {
            (true, 1) => QrzHtml.ListPage(QrzHtml.ListEntry(DetailHref(1), RecentDate), QrzHtml.ListEntry(DetailHref(6), StaleDate)),
            (true, 2) => QrzHtml.ListPage(QrzHtml.ListEntry(DetailHref(2), RecentDate), QrzHtml.ListEntry(DetailHref(3), StaleDate)),
            (true, 3) => QrzHtml.ListPage(QrzHtml.ListEntry(DetailHref(4), StaleDate)),
            (true, _) => QrzHtml.ListPage(QrzHtml.ListEntry(DetailHref(5), StaleDate)),
            _ => QrzHtml.ListPage()
        });
        var adapter = CreateAdapter(handler, ["components/tubes"]);

        var advertisements = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        SellListRequests(handler).Should().Equal(
            $"{ListPagePath}?o=date&type=0",
            $"{ListPagePath}?o=date&type=0&p=2",
            $"{ListPagePath}?o=date&type=0&p=3");
        advertisements.Select(static x => x.Link.AbsolutePath).Should().BeEquivalentTo(
            [DetailHref(1), DetailHref(6), DetailHref(2)]);
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Recent list pages are read until entries get older than the lookback window", "Paging stops at an empty page")]
    public async Task GetRecentAdvertisementsAsync_EmptyNextPage_StopsPaging()
    {
        var handler = new RoutingHandler(listPage: static query => IsSellType(query) && GetPage(query) == 1
            ? QrzHtml.ListPage(QrzHtml.ListEntry(DetailHref(1), RecentDate))
            : QrzHtml.ListPage());
        var adapter = CreateAdapter(handler, ["components/tubes"]);

        await adapter.GetRecentAdvertisementsAsync(CancellationToken.None);

        SellListRequests(handler).Should().Equal(
            $"{ListPagePath}?o=date&type=0",
            $"{ListPagePath}?o=date&type=0&p=2");
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Recent list pages are read until entries get older than the lookback window", "Paging stops at a page without new listings")]
    public async Task GetRecentAdvertisementsAsync_SamePageReturnedForEveryPageNumber_StopsPaging()
    {
        var handler = new RoutingHandler(listPage: static query => IsSellType(query)
            ? QrzHtml.ListPage(QrzHtml.ListEntry(DetailHref(1), RecentDate))
            : QrzHtml.ListPage());
        var adapter = CreateAdapter(handler, ["components/tubes"]);

        await adapter.GetRecentAdvertisementsAsync(CancellationToken.None);

        SellListRequests(handler).Should().HaveCount(2);
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Recent list pages are read until entries get older than the lookback window", "Paging stops at the page limit")]
    public async Task GetRecentAdvertisementsAsync_EveryPageRecent_StopsAtPageLimitWithWarning()
    {
        const int maxListPages = 3;
        var handler = new RoutingHandler(listPage: static query => IsSellType(query)
            ? QrzHtml.ListPage(QrzHtml.ListEntry(DetailHref(GetPage(query)), RecentDate))
            : QrzHtml.ListPage());
        var logger = new RecordingLogger<QrzAdapter>();
        var adapter = CreateAdapter(handler, ["components/tubes"], logger, maxListPages);

        var advertisements = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        SellListRequests(handler).Should().HaveCount(maxListPages);
        advertisements.Should().HaveCount(maxListPages);
        logger.HasWarningContaining("page limit").Should().BeTrue();
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "A failed later list page keeps the listings already collected", "Failure on the second page keeps first-page listings")]
    public async Task GetRecentAdvertisementsAsync_SecondPageFails_ReturnsFirstPageListingsWithWarning()
    {
        var handler = new RoutingHandler(listPage: static query => IsSellType(query)
            ? QrzHtml.ListPage(QrzHtml.ListEntry(DetailHref(GetPage(query)), RecentDate))
            : QrzHtml.ListPage())
        {
            FailListQuery = static query => IsSellType(query) && GetPage(query) == 2
        };
        var logger = new RecordingLogger<QrzAdapter>();
        var adapter = CreateAdapter(handler, ["components/tubes"], logger);

        var advertisements = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        SellListRequests(handler).Should().HaveCount(2);
        advertisements.Should().ContainSingle().Which.Link.AbsolutePath.Should().Be(DetailHref(1));
        logger.HasWarningContaining("list page 2").Should().BeTrue();
    }

    [Test]
    public async Task GetRecentAdvertisementsAsync_FirstPageFails_Throws()
    {
        var handler = new RoutingHandler(listPage: static _ => QrzHtml.ListPage())
        {
            FailListQuery = static _ => true
        };
        var adapter = CreateAdapter(handler, ["components/tubes"]);

        var act = () => adapter.GetRecentAdvertisementsAsync(CancellationToken.None);

        await act.Should().ThrowAsync<HttpRequestException>();
    }

    [Test]
    public async Task GetRecentAdvertisementsAsync_CategoriesNotConfigured_PollsDefaultTubesCategory()
    {
        var handler = new RoutingHandler(listPage: static _ => QrzHtml.ListPage());
        var adapter = CreateAdapter(handler, []);

        await adapter.GetRecentAdvertisementsAsync(CancellationToken.None);

        handler.Requests.Should().HaveCount(3).And.OnlyContain(static x => x.AbsolutePath == ListPagePath);
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Configured categories are polled for offers only", "Listing present under two types is collected once")]
    public async Task GetRecentAdvertisementsAsync_ListingUnderTwoTypes_IsCollectedAndFetchedOnce()
    {
        var handler = new RoutingHandler(listPage: static query =>
            query.EndsWith("type=1", StringComparison.Ordinal)
                ? QrzHtml.ListPage()
                : QrzHtml.ListPage(QrzHtml.ListEntry(ListingHref, "17.10.2026 06:36")));
        var adapter = CreateAdapter(handler, ["components/tubes"]);

        var advertisements = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        var advertisement = advertisements.Should().ContainSingle().Subject;
        advertisement.SellerKey.Should().Be(SellerHash);
        advertisement.SellerName.Should().Be("Иван Петров");
        advertisement.Link.Should().Be(new Uri($"https://www.qrz.ru{ListingHref}"));
        handler.ListingRequestCount.Should().Be(1);
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Listing pages are fetched only for new or changed listings", "Unchanged listing is not fetched again")]
    public async Task GetRecentAdvertisementsAsync_SameListingAndDateOnNextRun_IsServedFromCache()
    {
        var handler = new RoutingHandler(listPage: static _ => QrzHtml.ListPage(QrzHtml.ListEntry(ListingHref, "17.10.2026 06:36")));
        var adapter = CreateAdapter(handler, ["components/tubes"]);

        var first = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;
        var second = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        handler.ListingRequestCount.Should().Be(1);
        second.Should().ContainSingle().Which.Should().Be(first.Single());
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Listing pages are fetched only for new or changed listings", "Re-dated listing is fetched again")]
    public async Task GetRecentAdvertisementsAsync_ListingWithNewDate_IsFetchedAgain()
    {
        var date = "16.10.2026 20:47";
        var handler = new RoutingHandler(listPage: _ => QrzHtml.ListPage(QrzHtml.ListEntry(ListingHref, date)));
        var adapter = CreateAdapter(handler, ["components/tubes"]);

        await adapter.GetRecentAdvertisementsAsync(CancellationToken.None);
        date = "Сегодня 11:19";
        var advertisements = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        handler.ListingRequestCount.Should().Be(2);
        advertisements.Should().ContainSingle().Which.Date.Should().Be(new DateTimeOffset(2026, 10, 18, 11, 19, 0, TimeSpan.FromHours(3)));
    }

    [Test]
    public async Task GetRecentAdvertisementsAsync_ListingPageFails_SkipsItAndRetriesOnNextRun()
    {
        var handler = new RoutingHandler(listPage: static _ => QrzHtml.ListPage(QrzHtml.ListEntry(ListingHref, "17.10.2026 06:36")))
        {
            FailListingRequests = 1
        };
        var adapter = CreateAdapter(handler, ["components/tubes"]);

        var first = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;
        var second = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        first.Should().BeEmpty();
        second.Should().ContainSingle();
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Seller contact is the author's profile link", "Contact is the profile URL")]
    public async Task TryGetContactAsync_ReturnsProfileUrlWithoutHttpRequests()
    {
        var handler = new RoutingHandler(listPage: static _ => QrzHtml.ListPage());
        var adapter = CreateAdapter(handler, ["components/tubes"]);
        var advertisement = new SaleAdvertisement(
            Title: "Лампы",
            SellerKey: SellerHash,
            SellerName: "Иван Петров",
            Date: Now,
            Link: new Uri($"https://www.qrz.ru{ListingHref}"),
            Items: ["Лампы"]);

        var contact = await adapter.TryGetContactAsync(advertisement, CancellationToken.None);

        contact.Should().Be($"https://www.qrz.ru/user/{SellerHash}");
        handler.Requests.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Scraping requests go through the configured proxy", "qrz.ru request is tunnelled through the proxy with credentials")]
    public async Task GetRecentAdvertisementsAsync_ProxyWithCredentials_TunnelsThroughProxyWithBasicCredentials()
    {
        await using var proxy = new StubProxy(requireAuthentication: true);
        await using var services = BuildServicesWithProxy(proxy.Address, withCredentials: true);

        var collect = () => services.GetRequiredService<ISaleAdvertisementAdapter>().GetRecentAdvertisementsAsync(CancellationToken.None);

        await collect.Should().ThrowAsync<HttpRequestException>();
        // Сначала запрос без учётных данных, затем повтор с ними в ответ на 407.
        proxy.Requests.Should().Equal(
            new ProxyRequest("CONNECT www.qrz.ru:443 HTTP/1.1", ProxyAuthorization: null),
            new ProxyRequest("CONNECT www.qrz.ru:443 HTTP/1.1", ScrapingProxyServices.ExpectedBasicCredentials));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Scraping requests go through the configured proxy", "Proxy without credentials")]
    public async Task GetRecentAdvertisementsAsync_ProxyWithoutCredentials_TunnelsThroughProxyWithoutAuthorization()
    {
        await using var proxy = new StubProxy(requireAuthentication: false);
        await using var services = BuildServicesWithProxy(proxy.Address, withCredentials: false);

        var collect = () => services.GetRequiredService<ISaleAdvertisementAdapter>().GetRecentAdvertisementsAsync(CancellationToken.None);

        await collect.Should().ThrowAsync<HttpRequestException>();
        proxy.Requests.Should().ContainSingle()
            .Which.Should().Be(new ProxyRequest("CONNECT www.qrz.ru:443 HTTP/1.1", ProxyAuthorization: null));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "A proxy failure never falls back to a direct connection", "Unreachable proxy fails the qrz.ru collection")]
    public async Task GetRecentAdvertisementsAsync_UnreachableProxy_Fails()
    {
        var closedPort = new TcpListener(IPAddress.Loopback, 0);
        closedPort.Start();
        var address = new Uri($"http://{IPAddress.Loopback}:{((IPEndPoint)closedPort.LocalEndpoint).Port}");
        closedPort.Stop();
        await using var services = BuildServicesWithProxy(address, withCredentials: true);

        var collect = () => services.GetRequiredService<ISaleAdvertisementAdapter>().GetRecentAdvertisementsAsync(CancellationToken.None);

        // Отказ в соединении с портом прокси, а не ошибка DNS или ответа сайта, как было бы при прямом запросе.
        (await collect.Should().ThrowAsync<HttpRequestException>())
            .Which.HttpRequestError.Should().Be(HttpRequestError.ConnectionError);
    }

    private static ServiceProvider BuildServicesWithProxy(Uri proxyAddress, bool withCredentials) =>
        ScrapingProxyServices.Build(
            static services => services.AddQrzAdapter(),
            proxyAddress,
            withCredentials,
            new Dictionary<string, string?> { ["Qrz:RequestDelay"] = "00:00:00" });

    private static QrzAdapter CreateAdapter(
        RoutingHandler handler,
        string[] categories,
        RecordingLogger<QrzAdapter>? logger = null,
        int? maxListPages = null)
    {
        var options = new QrzAdapterOptions { Categories = categories, RequestDelay = TimeSpan.Zero };

        return new QrzAdapter(
            logger ?? new RecordingLogger<QrzAdapter>(),
            new SingleClientFactory(new HttpClient(handler)),
            new MemoryCache(new MemoryCacheOptions()),
            new FixedTimeProvider(Now),
            Options.Create(maxListPages is { } pages ? options with { MaxListPages = pages } : options));
    }

    private static string DetailHref(int id) => $"/classifieds/detail/lampa_{id}";

    private static bool IsSellType(string query) => query.Contains(SellType, StringComparison.Ordinal);

    private static int GetPage(string query)
    {
        const string pagePrefix = "&p=";
        var index = query.IndexOf(pagePrefix, StringComparison.Ordinal);
        return index < 0 ? 1 : int.Parse(query[(index + pagePrefix.Length)..], CultureInfo.InvariantCulture);
    }

    private static int OfferTypeId(string query)
    {
        const string typePrefix = "type=";
        var index = query.IndexOf(typePrefix, StringComparison.Ordinal);
        return int.Parse(query.AsSpan(index + typePrefix.Length, 1), CultureInfo.InvariantCulture);
    }

    private static string[] ListRequests(RoutingHandler handler) =>
    [
        .. handler.Requests
            .Where(static x => x.AbsolutePath == ListPagePath)
            .Select(static x => x.PathAndQuery)
    ];

    private static string[] SellListRequests(RoutingHandler handler) =>
    [
        .. handler.Requests
            .Where(static x => x.AbsolutePath == ListPagePath && IsSellType(x.Query))
            .Select(static x => x.PathAndQuery)
    ];

    private sealed class RoutingHandler : HttpMessageHandler
    {
        private readonly Func<string, string> _listPage;
        private readonly List<Uri> _requests = [];

        public RoutingHandler(Func<string, string> listPage)
        {
            _listPage = listPage;
        }

        public int FailListingRequests { get; set; }

        public Func<string, bool>? FailListQuery { get; init; }

        public IReadOnlyList<Uri> Requests
        {
            get
            {
                lock (_requests)
                {
                    return [.. _requests];
                }
            }
        }

        public int ListingRequestCount => Requests.Count(static x => x.AbsolutePath.StartsWith("/classifieds/detail/", StringComparison.Ordinal));

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var uri = request.RequestUri ?? throw new InvalidOperationException("Request without URI");

            lock (_requests)
            {
                _requests.Add(uri);
            }

            if (uri.AbsolutePath.StartsWith("/classifieds/detail/", StringComparison.Ordinal))
            {
                if (FailListingRequests > 0)
                {
                    FailListingRequests--;
                    return Task.FromResult(new HttpResponseMessage(HttpStatusCode.BadGateway));
                }

                return Ok(QrzHtml.ListingPage("Радиолампы 6С19П-В", "Иван Петров.", $"/user/{SellerHash}", "6С19П-В новые"));
            }

            if (FailListQuery?.Invoke(uri.Query) == true)
            {
                return Task.FromResult(new HttpResponseMessage(HttpStatusCode.BadGateway));
            }

            return Ok(_listPage(uri.Query));
        }

        private static Task<HttpResponseMessage> Ok(string content) =>
            Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(content) });
    }

    private sealed class SingleClientFactory : IHttpClientFactory
    {
        private readonly HttpClient _client;

        public SingleClientFactory(HttpClient client)
        {
            _client = client;
        }

        public HttpClient CreateClient(string name) => _client;
    }

    private sealed class FixedTimeProvider : TimeProvider
    {
        private readonly DateTimeOffset _utcNow;

        public FixedTimeProvider(DateTimeOffset utcNow)
        {
            _utcNow = utcNow;
        }

        public override DateTimeOffset GetUtcNow() => _utcNow;
    }
}
