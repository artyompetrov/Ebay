using System.Globalization;
using System.Net;
using AwesomeAssertions;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Adapters.Driven.NewAudioPortal;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Models;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(NewAudioPortalAdapter))]
public sealed class NewAudioPortalAdapterTests
{
    private const string DefaultSectionPath = "/forum/197-продам-радиолампы/";
    private const string StarterId = "3913";
    private const string Starter = "brakoman";
    private const string EarlierPost = "2026-09-13T21:17:27Z";
    private const string LaterPost = "2026-10-24T15:06:25Z";

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Only the first page of each configured section is read", "Default configuration reads one section page")]
    public async Task GetRecentAdvertisementsAsync_NoSectionsConfigured_RequestsOnlyFirstPageOfTubesSection()
    {
        var handler = new RoutingHandler { Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(1, LaterPost)) };
        handler.Topics[1] = [SinglePageTopic("6Н2П 10шт")];

        var advertisements = (await CreateAdapter(handler).GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        advertisements.Should().ContainSingle();
        handler.SectionRequests.Should().Equal(DefaultSectionPath);
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "An unusable section page fails the collection", "Page without a topic list")]
    public async Task GetRecentAdvertisementsAsync_SectionPageWithoutTopicList_ReturnsError()
    {
        var handler = new RoutingHandler { Section = "<html><body>Access denied</body></html>" };

        var result = await CreateAdapter(handler).GetRecentAdvertisementsAsync(CancellationToken.None);

        result.IsT1.Should().BeTrue();
        handler.TopicRequests.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "An unusable section page fails the collection", "Section page answers with an error status")]
    public async Task GetRecentAdvertisementsAsync_SectionPageAnswers500_ReturnsErrorWithoutTopicRequests()
    {
        var handler = new RoutingHandler { SectionStatus = HttpStatusCode.InternalServerError };

        var result = await CreateAdapter(handler).GetRecentAdvertisementsAsync(CancellationToken.None);

        result.IsT1.Should().BeTrue();
        handler.TopicRequests.Should().BeEmpty();
    }

    [Test]
    public async Task GetRecentAdvertisementsAsync_SectionPageTransportFailure_Throws()
    {
        var handler = new RoutingHandler { SectionThrows = true };

        var collect = () => CreateAdapter(handler).GetRecentAdvertisementsAsync(CancellationToken.None);

        await collect.Should().ThrowAsync<HttpRequestException>();
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Topics are read only when their last post time changes", "Unchanged topic is not read again")]
    public async Task GetRecentAdvertisementsAsync_SameLastPostTimeOnNextRun_IsServedFromCache()
    {
        var handler = new RoutingHandler { Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(16745, LaterPost)) };
        handler.Topics[16745] = [SinglePageTopic("6Н2П 10шт")];
        var adapter = CreateAdapter(handler);

        var first = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;
        var second = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        handler.TopicRequests.Should().ContainSingle();
        second.Should().ContainSingle().Which.Should().BeSameAs(first.Single());
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Topics are read only when their last post time changes", "Topic with a new post is read again")]
    [OpenSpecScenario("newaudioportal-monitoring", "Advertisement lines come from the topic starter's posts", "Opening post is re-read on every topic read")]
    public async Task GetRecentAdvertisementsAsync_NewLastPostTime_ReadsTopicAgainWithEditedOpeningPost()
    {
        var handler = new RoutingHandler { Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(16745, EarlierPost)) };
        handler.Topics[16745] = [SinglePageTopic("6Н2П 10шт")];
        var adapter = CreateAdapter(handler);
        await adapter.GetRecentAdvertisementsAsync(CancellationToken.None);

        handler.Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(16745, LaterPost));
        handler.Topics[16745] =
        [
            NewAudioPortalHtml.TopicPage(
                "Лампы",
                1,
                NewAudioPortalHtml.Post(1, StarterId, Starter, EarlierPost, "<p>6Н2П 10шт</p><p>6С33С-В 4шт</p>"),
                NewAudioPortalHtml.Post(2, "3550", "buyer", LaterPost, "<p>беру</p>"))
        ];
        var advertisements = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        handler.TopicRequests.Should().HaveCount(2);
        advertisements.Should().ContainSingle().Which.Items.Should().Contain("6С33С-В 4шт");
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Opening post and latest page are read", "Single-page topic")]
    public async Task GetRecentAdvertisementsAsync_SinglePageTopic_RequestsOnePage()
    {
        var handler = new RoutingHandler { Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(7, LaterPost)) };
        handler.Topics[7] = [SinglePageTopic("6Н2П 10шт")];

        await CreateAdapter(handler).GetRecentAdvertisementsAsync(CancellationToken.None);

        handler.TopicRequests.Should().Equal("/topic/7-радиолампы/");
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Opening post and latest page are read", "Multi-page topic")]
    public async Task GetRecentAdvertisementsAsync_ThreePageTopic_RequestsFirstAndLastPagesOnly()
    {
        var handler = new RoutingHandler { Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(7, LaterPost)) };
        handler.Topics[7] =
        [
            NewAudioPortalHtml.TopicPage("Лампы", 3, NewAudioPortalHtml.Post(1, StarterId, Starter, EarlierPost, "<p>6С33С 4шт</p>")),
            NewAudioPortalHtml.TopicPage("Лампы", 3, NewAudioPortalHtml.Post(2, StarterId, Starter, EarlierPost, "<p>6П14П 8шт</p>")),
            NewAudioPortalHtml.TopicPage("Лампы", 3, NewAudioPortalHtml.Post(3, StarterId, Starter, LaterPost, "<p>ГУ-50 2шт</p>"))
        ];

        var advertisements = (await CreateAdapter(handler).GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        handler.TopicRequests.Should().Equal("/topic/7-радиолампы/", "/topic/7-радиолампы/page/3/");
        advertisements.Should().ContainSingle().Which.Items.Should().Equal("Лампы", "6С33С 4шт", "ГУ-50 2шт");
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "A failed topic read skips only that topic", "One topic fails to load")]
    public async Task GetRecentAdvertisementsAsync_TopicFails_SkipsItAndRetriesOnNextRun()
    {
        var logger = new RecordingLogger<NewAudioPortalAdapter>();
        var handler = new RoutingHandler
        {
            Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(1, LaterPost), NewAudioPortalHtml.TopicRow(2, EarlierPost)),
        };
        handler.Topics[1] = [SinglePageTopic("first")];
        handler.Topics[2] = [SinglePageTopic("second")];
        handler.FailingTopicPages.Add("/topic/1-радиолампы/");
        var adapter = CreateAdapter(handler, logger);

        var first = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;
        handler.FailingTopicPages.Clear();
        var second = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        first.Should().ContainSingle().Which.Items.Should().Contain("second");
        logger.HasWarning.Should().BeTrue();
        second.Should().HaveCount(2);
        handler.TopicRequests.Count(static x => x == "/topic/1-радиолампы/").Should().Be(2);
    }

    [Test]
    public async Task GetRecentAdvertisementsAsync_TopicTransportFailureOrTimeout_SkipsTopicAndRetriesOnNextRun()
    {
        var logger = new RecordingLogger<NewAudioPortalAdapter>();
        var handler = new RoutingHandler
        {
            Section = NewAudioPortalHtml.SectionPage(
                NewAudioPortalHtml.TopicRow(1, LaterPost),
                NewAudioPortalHtml.TopicRow(2, LaterPost),
                NewAudioPortalHtml.TopicRow(3, EarlierPost)),
        };
        handler.Topics[1] = [SinglePageTopic("first")];
        handler.Topics[2] = [SinglePageTopic("second")];
        handler.Topics[3] = [SinglePageTopic("third")];
        handler.ThrowingTopicPages["/topic/1-радиолампы/"] = new HttpRequestException("Connection reset");
        handler.ThrowingTopicPages["/topic/2-радиолампы/"] = new TaskCanceledException("Timeout");
        var adapter = CreateAdapter(handler, logger);

        var first = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;
        handler.ThrowingTopicPages.Clear();
        var second = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        first.Should().ContainSingle().Which.Items.Should().Contain("third");
        logger.HasWarningContaining("Failed to fetch newaudioportal.com page").Should().BeTrue();
        second.Should().HaveCount(3);
    }

    [Test]
    public async Task GetRecentAdvertisementsAsync_RunCancelled_PropagatesCancellationWithoutWarnings()
    {
        var logger = new RecordingLogger<NewAudioPortalAdapter>();
        var handler = new RoutingHandler { Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(1, LaterPost)) };
        handler.Topics[1] = [SinglePageTopic("first")];
        using var cancellation = new CancellationTokenSource();
        handler.OnTopicRequest = cancellation.Cancel;

        var collect = () => CreateAdapter(handler, logger).GetRecentAdvertisementsAsync(cancellation.Token);

        await collect.Should().ThrowAsync<OperationCanceledException>();
        logger.HasWarning.Should().BeFalse();
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "A failed topic read skips only that topic", "Last page of a topic fails to load")]
    public async Task GetRecentAdvertisementsAsync_LastPageFails_SkipsTopicAndRetriesOnNextRun()
    {
        var logger = new RecordingLogger<NewAudioPortalAdapter>();
        var handler = new RoutingHandler { Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(1, LaterPost)) };
        handler.Topics[1] =
        [
            NewAudioPortalHtml.TopicPage("Лампы", 2, NewAudioPortalHtml.Post(1, StarterId, Starter, EarlierPost, "<p>6С33С</p>")),
            NewAudioPortalHtml.TopicPage("Лампы", 2, NewAudioPortalHtml.Post(2, StarterId, Starter, LaterPost, "<p>ГУ-50</p>"))
        ];
        handler.FailingTopicPages.Add("/topic/1-радиолампы/page/2/");
        var adapter = CreateAdapter(handler, logger);

        var first = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;
        handler.FailingTopicPages.Clear();
        var second = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        first.Should().BeEmpty();
        logger.HasWarning.Should().BeTrue();
        second.Should().ContainSingle().Which.Items.Should().Equal("Лампы", "6С33С", "ГУ-50");
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "A failed topic read skips only that topic", "Topic page without posts is not remembered")]
    public async Task GetRecentAdvertisementsAsync_TopicPageWithoutPosts_SkipsTopicAndRetriesOnNextRun()
    {
        var logger = new RecordingLogger<NewAudioPortalAdapter>();
        var handler = new RoutingHandler { Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(1, LaterPost)) };
        handler.Topics[1] = [NewAudioPortalHtml.TopicPage("Лампы", 1)];
        var adapter = CreateAdapter(handler, logger);

        var first = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;
        handler.Topics[1] = [SinglePageTopic("6Н2П")];
        var second = (await adapter.GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        first.Should().BeEmpty();
        logger.HasWarning.Should().BeTrue();
        second.Should().ContainSingle();
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Topics without any author fail the collection", "No topic has an author")]
    public async Task GetRecentAdvertisementsAsync_NoTopicHasAuthor_ReturnsError()
    {
        var handler = new RoutingHandler
        {
            Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(1, LaterPost), NewAudioPortalHtml.TopicRow(2, LaterPost)),
        };
        handler.Topics[1] = [TopicWithoutAuthor()];
        handler.Topics[2] = [TopicWithoutAuthor()];

        var result = await CreateAdapter(handler).GetRecentAdvertisementsAsync(CancellationToken.None);

        result.IsT1.Should().BeTrue();
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Topics without any author fail the collection", "Failure repeats while the topics are remembered")]
    public async Task GetRecentAdvertisementsAsync_NoTopicHasAuthorOnNextRun_ReturnsErrorFromCache()
    {
        var handler = new RoutingHandler { Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(1, LaterPost)) };
        handler.Topics[1] = [TopicWithoutAuthor()];
        var adapter = CreateAdapter(handler);

        await adapter.GetRecentAdvertisementsAsync(CancellationToken.None);
        var second = await adapter.GetRecentAdvertisementsAsync(CancellationToken.None);

        second.IsT1.Should().BeTrue();
        handler.TopicRequests.Should().ContainSingle();
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Topics without any author fail the collection", "One topic without an author among others")]
    public async Task GetRecentAdvertisementsAsync_OneTopicWithoutAuthor_SkipsOnlyIt()
    {
        var handler = new RoutingHandler
        {
            Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(1, LaterPost), NewAudioPortalHtml.TopicRow(2, EarlierPost)),
        };
        handler.Topics[1] = [TopicWithoutAuthor()];
        handler.Topics[2] = [SinglePageTopic("6Н2П")];

        var advertisements = (await CreateAdapter(handler).GetRecentAdvertisementsAsync(CancellationToken.None)).AsT0;

        advertisements.Should().ContainSingle().Which.Items.Should().Contain("6Н2П");
    }

    [Test]
    public async Task GetRecentAdvertisementsAsync_OnlyFailedTopics_IsNotAnError()
    {
        var handler = new RoutingHandler { Section = NewAudioPortalHtml.SectionPage(NewAudioPortalHtml.TopicRow(1, LaterPost)) };
        handler.Topics[1] = [SinglePageTopic("6Н2П")];
        handler.FailingTopicPages.Add("/topic/1-радиолампы/");

        var result = await CreateAdapter(handler).GetRecentAdvertisementsAsync(CancellationToken.None);

        result.AsT0.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Seller contact is the topic starter's profile link", "Contact is the profile URL")]
    public async Task TryGetContactAsync_Nickname_ReturnsProfileUrl()
    {
        var handler = new RoutingHandler();

        var contact = await CreateAdapter(handler).TryGetContactAsync(Advertisement("3913", "brakoman"), CancellationToken.None);

        contact.Should().Be("https://newaudioportal.com/profile/3913-brakoman/");
        handler.Requests.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Seller contact is the topic starter's profile link", "Display name with spaces and Cyrillic letters")]
    public async Task TryGetContactAsync_CyrillicNameWithSpace_ReturnsEscapedSlug()
    {
        var contact = await CreateAdapter(new RoutingHandler()).TryGetContactAsync(Advertisement("3550", "Артём П"), CancellationToken.None);

        contact.Should().Be("https://newaudioportal.com/profile/3550-%D0%B0%D1%80%D1%82%D1%91%D0%BC-%D0%BF/");
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Seller contact is the topic starter's profile link", "Empty display name")]
    public async Task TryGetContactAsync_EmptyName_FallsBackToUserSlug()
    {
        var contact = await CreateAdapter(new RoutingHandler()).TryGetContactAsync(Advertisement("3913", ""), CancellationToken.None);

        contact.Should().Be("https://newaudioportal.com/profile/3913-user/");
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "Scraping requests go through the configured proxy", "newaudioportal.com request is tunnelled through the proxy with credentials")]
    public async Task GetRecentAdvertisementsAsync_ProxyWithCredentials_TunnelsThroughProxyWithBasicCredentials()
    {
        await using var proxy = new StubProxy(requireAuthentication: true);
        await using var services = ScrapingProxyServices.Build(
            static services => services.AddNewAudioPortalAdapter(),
            proxy.Address,
            withCredentials: true,
            new Dictionary<string, string?> { ["NewAudioPortal:RequestDelay"] = "00:00:00" });

        var collect = () => services.GetRequiredService<ISaleAdvertisementAdapter>().GetRecentAdvertisementsAsync(CancellationToken.None);

        await collect.Should().ThrowAsync<HttpRequestException>();
        // Сначала запрос без учётных данных, затем повтор с ними в ответ на 407.
        proxy.Requests.Should().Equal(
            new ProxyRequest("CONNECT newaudioportal.com:443 HTTP/1.1", ProxyAuthorization: null),
            new ProxyRequest("CONNECT newaudioportal.com:443 HTTP/1.1", ScrapingProxyServices.ExpectedBasicCredentials));
    }

    private static string SinglePageTopic(string line) =>
        NewAudioPortalHtml.TopicPage("Лампы", 1, NewAudioPortalHtml.Post(1, StarterId, Starter, EarlierPost, $"<p>{line}</p>"));

    private static string TopicWithoutAuthor() =>
        NewAudioPortalHtml.TopicPage("Лампы", 1, NewAudioPortalHtml.Post(1, authorId: null, "Guest", LaterPost, "<p>6Н2П</p>"));

    private static SaleAdvertisement Advertisement(string sellerKey, string sellerName) =>
        new(
            Title: "Лампы",
            SellerKey: sellerKey,
            SellerName: sellerName,
            Date: DateTimeOffset.UnixEpoch,
            Link: new Uri(NewAudioPortalHtml.TopicHref(1)),
            Items: ["Лампы"]);

    private static NewAudioPortalAdapter CreateAdapter(RoutingHandler handler, RecordingLogger<NewAudioPortalAdapter>? logger = null) =>
        new(
            logger ?? new RecordingLogger<NewAudioPortalAdapter>(),
            new SingleClientFactory(new HttpClient(handler)),
            new MemoryCache(new MemoryCacheOptions()),
            Options.Create(new NewAudioPortalAdapterOptions { RequestDelay = TimeSpan.Zero }));

    /// <summary>
    /// Отвечает на запросы раздела и тем: страница N темы - элемент N-1 списка <see cref="Topics"/>.
    /// </summary>
    private sealed class RoutingHandler : HttpMessageHandler
    {
        private readonly List<Uri> _requests = [];

        public string Section { get; set; } = NewAudioPortalHtml.SectionPage();

        public HttpStatusCode SectionStatus { get; init; } = HttpStatusCode.OK;

        public bool SectionThrows { get; init; }

        public Dictionary<long, string[]> Topics { get; } = [];

        public HashSet<string> FailingTopicPages { get; } = [];

        public Dictionary<string, Exception> ThrowingTopicPages { get; } = [];

        public Action? OnTopicRequest { get; set; }

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

        public string[] SectionRequests => [.. Requests.Where(static x => Path(x).StartsWith("/forum/", StringComparison.Ordinal)).Select(Path)];

        public string[] TopicRequests => [.. Requests.Where(static x => Path(x).StartsWith("/topic/", StringComparison.Ordinal)).Select(Path)];

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var uri = request.RequestUri ?? throw new InvalidOperationException("Request without URI");

            lock (_requests)
            {
                _requests.Add(uri);
            }

            var path = Path(uri);

            if (path.StartsWith("/forum/", StringComparison.Ordinal))
            {
                return SectionThrows
                    ? throw new HttpRequestException("Connection refused")
                    : Task.FromResult(new HttpResponseMessage(SectionStatus) { Content = new StringContent(Section) });
            }

            OnTopicRequest?.Invoke();
            cancellationToken.ThrowIfCancellationRequested();

            if (ThrowingTopicPages.TryGetValue(path, out var exception))
            {
                throw exception;
            }

            if (FailingTopicPages.Contains(path))
            {
                return Task.FromResult(new HttpResponseMessage(HttpStatusCode.BadGateway));
            }

            // /topic/<id>-<slug>/ или /topic/<id>-<slug>/page/<n>/
            var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
            var id = long.Parse(segments[1].Split('-')[0], CultureInfo.InvariantCulture);
            var page = segments.Length > 3 ? int.Parse(segments[3], CultureInfo.InvariantCulture) : 1;

            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(Topics[id][page - 1]) });
        }

        private static string Path(Uri uri) => Uri.UnescapeDataString(uri.AbsolutePath);
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
}
