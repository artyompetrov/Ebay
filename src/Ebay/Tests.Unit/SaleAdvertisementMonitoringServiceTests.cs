using System.Data;
using System.Diagnostics;
using System.Text.RegularExpressions;
using AwesomeAssertions;
using Server.Application;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.SaleAdvertisements;
using Server.Domain;
using Server.Domain.Measurements;
using Server.Domain.Product;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(SaleAdvertisementMonitoringService))]
public sealed class SaleAdvertisementMonitoringServiceTests
{
    private const string TargetEmail = "target@localhost";
    private const string SellerKey = "seller-key";
    private const string SellerName = "Seller Name";
    private const string Marketplace = "TestMarket";
    private const string AdvertisementTitle = "Продам лампы";
    private const string AmbiguousMarker = "[Нашлось несколько товаров]";
    private const double RubRate = 80;

    private static readonly DateTimeOffset AdvertisementDate = new(2026, 1, 2, 3, 4, 5, TimeSpan.Zero);
    private static readonly Uri AdvertisementLink = new("https://market.example/ad/");

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Advertisement lines are matched against tracked products", "A line matching one product is attributed to it")]
    public async Task ProcessRecentAdvertisementsAsync_LineMatchesOneProduct_RecordsUnambiguousSighting()
    {
        var product = CreateProduct("6н2п", isInteresting: false);
        var context = new TestContext([product]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая", "Конденсатор К73"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        var record = context.Repository.Committed.Should().ContainSingle().Subject;
        record.ProductId.Should().Be(product.Id);
        record.SellerKey.Should().Be(SellerKey);
        record.SellerName.Should().Be(SellerName);
        record.Marketplace.Should().Be(Marketplace);
        record.IsAmbiguous.Should().BeFalse();
        record.AdvertisementDate.Should().Be(AdvertisementDate);
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Advertisement lines are matched against tracked products", "A line matching several products is ambiguous")]
    public async Task ProcessRecentAdvertisementsAsync_LineMatchesTwoProducts_RecordsAmbiguousSightingForEach()
    {
        var first = CreateProduct("6н2п", isInteresting: false);
        var second = CreateProduct("6н2п", isInteresting: false);
        var context = new TestContext([first, second]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        context.Repository.Committed.Select(static x => x.ProductId).Should().BeEquivalentTo([first.Id, second.Id]);
        context.Repository.Committed.Should().AllSatisfy(static x => x.IsAmbiguous.Should().BeTrue());
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "One notification per product, seller and marketplace", "First sighting of an interesting product is notified")]
    public async Task ProcessRecentAdvertisementsAsync_FirstSightingOfInterestingProduct_CreatesRecordAndNotifiesOnce()
    {
        var product = CreateProduct("6н2п", isInteresting: true);
        var context = new TestContext([product]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        context.Repository.Committed.Should().ContainSingle();
        context.EmailSender.Sent.Should().ContainSingle();
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "One notification per product, seller and marketplace", "Repeated sighting is not notified again")]
    public async Task ProcessRecentAdvertisementsAsync_SellerAlreadyRecorded_UpdatesRecordWithoutNotifying()
    {
        var product = CreateProduct("6н2п", isInteresting: true);
        var context = new TestContext([product]);
        var existing = context.Repository.Seed(product.Id, SellerKey, Marketplace, AdvertisementDate.AddDays(-1), "https://old.example/");
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        context.Repository.Committed.Should().ContainSingle().Which.Should().BeSameAs(existing);
        existing.AdvertisementDate.Should().Be(AdvertisementDate);
        existing.Link.Should().Be(AdvertisementLink.ToString());
        context.EmailSender.Sent.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "One notification per product, seller and marketplace", "Several advertisement lines for the same product create one record")]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification contents", "All matching lines appear in the notification")]
    public async Task ProcessRecentAdvertisementsAsync_TwoLinesForSameProduct_CreateOneRecordAndOneNotificationWithBothLines()
    {
        var product = CreateProduct("6н2п", isInteresting: true);
        var context = new TestContext([product]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("6Н2П 10 шт", "6Н2П-ЕВ 5 шт"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        context.Repository.Committed.Should().ContainSingle();
        var email = context.EmailSender.Sent.Should().ContainSingle().Subject;
        email.Body.Should().Contain("6Н2П 10 шт").And.Contain("6Н2П-ЕВ 5 шт");
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Sightings of non-interesting products are recorded without notification", "Non-interesting product is recorded silently")]
    public async Task ProcessRecentAdvertisementsAsync_NonInterestingProduct_RecordsWithoutNotifying()
    {
        var product = CreateProduct("6н2п", isInteresting: false);
        var context = new TestContext([product]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        context.Repository.Committed.Should().ContainSingle();
        context.EmailSender.Sent.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Sightings of non-interesting products are recorded without notification", "Product that became interesting is not notified for an already recorded seller")]
    public async Task ProcessRecentAdvertisementsAsync_ProductBecameInterestingAfterRecording_DoesNotNotify()
    {
        var notInteresting = CreateProduct("6н2п", isInteresting: false);
        var context = new TestContext([notInteresting]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая"));
        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        context.Products.Replace(notInteresting with { CalculationResult = InterestingCalculation() });
        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        context.Repository.Committed.Should().ContainSingle();
        context.EmailSender.Sent.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Marketplaces are deduplicated independently", "Same seller key on two marketplaces")]
    public async Task ProcessRecentAdvertisementsAsync_SameSellerKeyOnTwoMarketplaces_RecordsAndNotifiesEach()
    {
        var product = CreateProduct("6н2п", isInteresting: true);
        var context = new TestContext([product]);
        var first = new StaticAdapter("MarketA", CreateAdvertisement("Лампа 6Н2П новая"));
        var second = new StaticAdapter("MarketB", CreateAdvertisement("Лампа 6Н2П новая"));

        await context.CreateService(first, second).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        context.Repository.Committed.Select(static x => x.Marketplace).Should().BeEquivalentTo(["MarketA", "MarketB"]);
        context.EmailSender.Sent.Should().HaveCount(2);
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification contents", "Subject uses the seller display name")]
    public async Task ProcessRecentAdvertisementsAsync_Notification_UsesTitleAndSellerDisplayNameInSubject()
    {
        var product = CreateProduct("6н2п", isInteresting: true);
        var context = new TestContext([product]);
        var advertisement = CreateAdvertisement("Лампа 6Н2П новая") with
        {
            Title = "Радиолампы",
            SellerKey = "968d583acd6460911adbe0e9f5e97edb",
            SellerName = "Евгений Смирнов"
        };

        await context.CreateService(new StaticAdapter(Marketplace, advertisement, contact: "https://www.qrz.ru/user/968d583acd6460911adbe0e9f5e97edb"))
            .ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        var email = context.EmailSender.Sent.Should().ContainSingle().Subject;
        email.Topic.Should().Be("Радиолампы [Евгений Смирнов]");
        email.Address.Should().Be(TargetEmail);
        email.Body.Should().Contain(AdvertisementLink.ToString()).And.Contain("https://www.qrz.ru/user/968d583acd6460911adbe0e9f5e97edb");
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification contents", "Ambiguous line is marked")]
    public async Task ProcessRecentAdvertisementsAsync_AmbiguousLine_IsMarkedInNotification()
    {
        var context = new TestContext([CreateProduct("6н2п", isInteresting: true), CreateProduct("6н2п", isInteresting: true)]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая", "Лампа 6Н2П старая"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        var email = context.EmailSender.Sent.Should().ContainSingle().Subject;
        email.Body.Should().Contain($"<div>Лампа 6Н2П новая {AmbiguousMarker} </div>");
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification lists notified products with their estimated prices", "Table row shows the product's estimated price in roubles")]
    public async Task ProcessRecentAdvertisementsAsync_NotifiedProduct_ShowsEstimatedPriceInRoubles()
    {
        var product = CreateProduct("6Н2П", revenueAvgUsd: 15.4, quantityTotal: 7);
        var context = new TestContext([product]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        var email = context.EmailSender.Sent.Should().ContainSingle().Subject;
        email.Body.Should().Contain("<tr><td>6Н2П</td><td>1232 RUB</td><td>7</td></tr>");
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification lists notified products with their estimated prices", "Products that did not trigger the notification are not listed")]
    public async Task ProcessRecentAdvertisementsAsync_ProductsThatDidNotTriggerNotification_AreNotListed()
    {
        var notified = CreateProduct("6н2п", isInteresting: true);
        var alreadyRecorded = CreateProduct("6н3п", isInteresting: true);
        var notInteresting = CreateProduct("6н1п", isInteresting: false);
        var context = new TestContext([notified, alreadyRecorded, notInteresting]);
        context.Repository.Seed(alreadyRecorded.Id, SellerKey, Marketplace, AdvertisementDate, AdvertisementLink.ToString());
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П", "Лампа 6Н3П", "Лампа 6Н1П"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        var email = context.EmailSender.Sent.Should().ContainSingle().Subject;
        PriceTableRows(email.Body).Should().ContainSingle().Which.Should().StartWith("<tr><td>6н2п</td>");
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification lists notified products with their estimated prices", "A product matched by several lines has one row")]
    public async Task ProcessRecentAdvertisementsAsync_ProductMatchedBySeveralLines_HasOneRow()
    {
        var context = new TestContext([CreateProduct("6н2п", isInteresting: true)]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("6Н2П 10 шт", "6Н2П-ЕВ 5 шт"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        var email = context.EmailSender.Sent.Should().ContainSingle().Subject;
        PriceTableRows(email.Body).Should().ContainSingle();
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification lists notified products with their estimated prices", "Product name is HTML-encoded")]
    public async Task ProcessRecentAdvertisementsAsync_ProductNameWithMarkup_IsHtmlEncoded()
    {
        var product = CreateProduct("<b>6Н2П</b>", isInteresting: true) with
        {
            RuSearchQueries = [new SearchQueryWithId(Guid.NewGuid(), "6н2п")]
        };
        var context = new TestContext([product]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        var email = context.EmailSender.Sent.Should().ContainSingle().Subject;
        email.Body.Should().Contain("<td>&lt;b&gt;6Н2П&lt;/b&gt;</td>").And.NotContain("<b>6Н2П</b>");
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Estimated price falls back to USD without a RUB rate", "Missing RUB rate shows the price in dollars")]
    public async Task ProcessRecentAdvertisementsAsync_NoRubRate_ShowsEstimatedPriceInDollars()
    {
        var product = CreateProduct("6Н2П", revenueAvgUsd: 15.4, quantityTotal: 7);
        var context = new TestContext([product]) { CurrencyRates = new Dictionary<string, double>() };
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая"));

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        var email = context.EmailSender.Sent.Should().ContainSingle().Subject;
        email.Body.Should().Contain("<td>15 USD</td>");
        context.Logger.HasWarningContaining("RUB").Should().BeTrue();
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "A failed notification is retried on the next run", "Email failure leaves no record behind")]
    public async Task ProcessRecentAdvertisementsAsync_EmailFails_PersistsNothingAndNextRunNotifies()
    {
        var product = CreateProduct("6н2п", isInteresting: true);
        var context = new TestContext([product]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая"));
        context.EmailSender.FailNext = true;

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        context.Repository.Committed.Should().BeEmpty();
        context.EmailSender.Sent.Should().BeEmpty();

        await context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        context.Repository.Committed.Should().ContainSingle();
        context.EmailSender.Sent.Should().ContainSingle();
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Sources are processed independently", "One failing source does not block the others")]
    public async Task ProcessRecentAdvertisementsAsync_FirstSourceFails_SecondSourceIsStillProcessed()
    {
        var product = CreateProduct("6н2п", isInteresting: true);
        var context = new TestContext([product]);
        var failing = new FailingAdapter("Broken");
        var working = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая"));

        await context.CreateService(failing, working).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        context.Repository.Committed.Should().ContainSingle().Which.Marketplace.Should().Be(Marketplace);
        context.EmailSender.Sent.Should().ContainSingle();
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Monitoring is traced", "A run produces nested spans")]
    public async Task ProcessRecentAdvertisementsAsync_WithListener_EmitsRunSourceAdvertisementAndNotifySpans()
    {
        var product = CreateProduct("6н2п", isInteresting: true);
        var context = new TestContext([product]);
        var adapter = new StaticAdapter(Marketplace, CreateAdvertisement("Лампа 6Н2П новая"));
        using var recorder = new ActivityRecorder();

        await recorder.RunTracedAsync(() => context.CreateService(adapter).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None));

        var run = recorder.Single("sale-advertisements.run");
        var source = recorder.Single("sale-advertisements.source");
        var advertisement = recorder.Single("sale-advertisements.advertisement");
        var notify = recorder.Single("sale-advertisements.notify");
        source.ParentSpanId.Should().Be(run.SpanId);
        source.GetTagItem("marketplace").Should().Be(Marketplace);
        advertisement.ParentSpanId.Should().Be(source.SpanId);
        advertisement.GetTagItem("marketplace").Should().Be(Marketplace);
        advertisement.GetTagItem("seller.key").Should().Be(SellerKey);
        advertisement.GetTagItem("matches.count").Should().Be(1);
        notify.ParentSpanId.Should().Be(advertisement.SpanId);
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Monitoring is traced", "A failing source marks its span as an error")]
    public async Task ProcessRecentAdvertisementsAsync_SourceFails_MarksSourceSpanAsError()
    {
        var context = new TestContext([CreateProduct("6н2п", isInteresting: true)]);
        using var recorder = new ActivityRecorder();

        await recorder.RunTracedAsync(() => context.CreateService(new FailingAdapter("Broken")).ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None));

        recorder.Single("sale-advertisements.source").Status.Should().Be(ActivityStatusCode.Error);
    }

    private static ProductInfo CreateProduct(string name, bool isInteresting) =>
        new(
            Id: Guid.NewGuid(),
            Name: name,
            SearchQueries: [],
            RuSearchQueries: [],
            Weight: 100,
            CalculationResult: isInteresting ? InterestingCalculation() : null,
            LastCheckTime: AdvertisementDate,
            Description: null);

    private static ProductInfo CreateProduct(string name, double revenueAvgUsd, int quantityTotal) =>
        CreateProduct(name, isInteresting: true) with
        {
            CalculationResult = new ProductCalculationResult
            {
                Revenue = revenueAvgUsd * quantityTotal,
                QuantityTotal = quantityTotal
            }
        };

    private static string[] PriceTableRows(string body) =>
        [.. Regex.Matches(body, "<tr><td>.*?</tr>").Select(static x => x.Value)];

    private static ProductCalculationResult InterestingCalculation() =>
        new()
        {
            Revenue = (WellKnown.IsInterestingRevenueUsd + 1) * WellKnown.IsInterestingRelevantStatistics,
            QuantityTotal = WellKnown.IsInterestingRelevantStatistics
        };

    private static SaleAdvertisement CreateAdvertisement(params string[] items) =>
        new(
            Title: AdvertisementTitle,
            SellerKey: SellerKey,
            SellerName: SellerName,
            Date: AdvertisementDate,
            Link: AdvertisementLink,
            Items: items);

    private sealed class TestContext
    {
        public TestContext(IReadOnlyList<ProductInfo> products)
        {
            Products = new MutableProductQueries(products);
            UnitOfWork = new CommittingUnitOfWork(Repository);
        }

        public InMemoryHistoryRepository Repository { get; } = new();

        public RecordingEmailSender EmailSender { get; } = new();

        public MutableProductQueries Products { get; }

        public CommittingUnitOfWork UnitOfWork { get; }

        public RecordingLogger<SaleAdvertisementMonitoringService> Logger { get; } = new();

        public IReadOnlyDictionary<string, double> CurrencyRates { get; init; } =
            new Dictionary<string, double> { [WellKnown.CurrencyRate.TargetCurrency] = RubRate };

        public SaleAdvertisementMonitoringService CreateService(params ISaleAdvertisementAdapter[] adapters)
        {
            var productService = new ProductService(
                new SingleUnitOfWorkFactory(UnitOfWork),
                new NotSupportedProductRepository(),
                Products,
                new NotSupportedPriceRecalculationPublisher(),
                new ProductDescriptionSanitizer());

            return new SaleAdvertisementMonitoringService(
                Logger,
                Repository,
                new SingleUnitOfWorkFactory(UnitOfWork),
                adapters,
                EmailSender,
                productService,
                new StaticCurrencyQueries(CurrencyRates),
                delayAfterEmail: TimeSpan.Zero);
        }
    }

    /// <summary>
    /// Records spans of the monitoring source that belong to the trace started by <see cref="RunTracedAsync"/>,
    /// so spans of tests running in parallel are not mixed in.
    /// </summary>
    private sealed class ActivityRecorder : IDisposable
    {
        private static readonly ActivitySource TestSource = new(nameof(SaleAdvertisementMonitoringServiceTests));

        private readonly ActivityListener _listener;
        private readonly List<Activity> _activities = [];
        private ActivityTraceId _traceId;

        public ActivityRecorder()
        {
            _listener = new ActivityListener
            {
                ShouldListenTo = static source =>
                    source.Name is WellKnown.SaleAdvertisements.ActivitySourceName or nameof(SaleAdvertisementMonitoringServiceTests),
                Sample = static (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllDataAndRecorded,
                ActivityStopped = activity =>
                {
                    lock (_activities)
                    {
                        _activities.Add(activity);
                    }
                }
            };
            ActivitySource.AddActivityListener(_listener);
        }

        public async Task RunTracedAsync(Func<Task> action)
        {
            using (var root = TestSource.StartActivity("test-root"))
            {
                _traceId = root!.TraceId; // the listener above samples this source, so the activity is always created
                await action();
            }
        }

        public Activity Single(string operationName)
        {
            lock (_activities)
            {
                return _activities.Should()
                    .ContainSingle(x => x.TraceId == _traceId && x.OperationName == operationName)
                    .Subject;
            }
        }

        public void Dispose() => _listener.Dispose();
    }

    private sealed class StaticAdapter : ISaleAdvertisementAdapter
    {
        private readonly SaleAdvertisement _advertisement;
        private readonly string? _contact;

        public StaticAdapter(string marketplace, SaleAdvertisement advertisement, string? contact = null)
        {
            Marketplace = marketplace;
            _advertisement = advertisement;
            _contact = contact;
        }

        public string Marketplace { get; }

        public Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentAdvertisementsAsync(CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyCollection<SaleAdvertisement>>([_advertisement]);

        public Task<string?> TryGetContactAsync(SaleAdvertisement saleAdvertisement, CancellationToken cancellationToken) =>
            Task.FromResult(_contact);
    }

    private sealed class FailingAdapter : ISaleAdvertisementAdapter
    {
        public FailingAdapter(string marketplace)
        {
            Marketplace = marketplace;
        }

        public string Marketplace { get; }

        public Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentAdvertisementsAsync(CancellationToken cancellationToken) =>
            throw new HttpRequestException("Marketplace is down");

        public Task<string?> TryGetContactAsync(SaleAdvertisement saleAdvertisement, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    /// <summary>
    /// History store that makes added records visible only after the unit of work commits, like the real database.
    /// </summary>
    private sealed class InMemoryHistoryRepository : IProductEmailSendHistoryRepository
    {
        private readonly List<ProductEmailSendHistory> _pending = [];

        public List<ProductEmailSendHistory> Committed { get; } = [];

        public ProductEmailSendHistory Seed(Guid productId, string sellerKey, string marketplace, DateTimeOffset date, string link)
        {
            var record = ProductEmailSendHistory.Create(
                productId: productId,
                sellerKey: sellerKey,
                sellerName: SellerName,
                link: link,
                marketplace: marketplace,
                isAmbiguous: false,
                advertisementDate: date,
                contact: null);
            Committed.Add(record);
            return record;
        }

        public void Commit()
        {
            Committed.AddRange(_pending);
            _pending.Clear();
        }

        public void Rollback() => _pending.Clear();

        public Task<ProductEmailSendHistory?> FindAsync(
            IWriteModelUnitOfWork unitOfWork,
            Guid productId,
            string sellerKey,
            string marketplace,
            CancellationToken cancellationToken) =>
            Task.FromResult(Committed.SingleOrDefault(x =>
                x.ProductId == productId && x.SellerKey == sellerKey && x.Marketplace == marketplace));

        public Task AddAsync(IWriteModelUnitOfWork unitOfWork, ProductEmailSendHistory aggregate, CancellationToken cancellationToken)
        {
            _pending.Add(aggregate);
            return Task.CompletedTask;
        }

        public Task<ProductEmailSendHistory?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<Guid> id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveOlderThanAsync(IWriteModelUnitOfWork unitOfWork, DateTimeOffset threshold, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed record SentEmail(string Address, string Topic, string Body);

    private sealed class RecordingEmailSender : IEmailSender
    {
        public List<SentEmail> Sent { get; } = [];

        public bool FailNext { get; set; }

        public Task Send(string targetAddress, string topic, string messageText)
        {
            if (FailNext)
            {
                FailNext = false;
                throw new InvalidOperationException("SMTP is down");
            }

            Sent.Add(new SentEmail(targetAddress, topic, messageText));
            return Task.CompletedTask;
        }
    }

    private sealed class CommittingUnitOfWork : IWriteModelUnitOfWork
    {
        private readonly InMemoryHistoryRepository _repository;

        public CommittingUnitOfWork(InMemoryHistoryRepository repository)
        {
            _repository = repository;
        }

        public ValueTask DisposeAsync() => ValueTask.CompletedTask;

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken) => Task.FromResult(1);

        public Task<IUnitOfWorkTransaction> BeginTransactionAsync(
            CancellationToken cancellationToken,
            IsolationLevel isolationLevel = IsolationLevel.ReadCommitted) =>
            Task.FromResult<IUnitOfWorkTransaction>(new Transaction(_repository));

        private sealed class Transaction : IUnitOfWorkTransaction
        {
            private readonly InMemoryHistoryRepository _repository;
            private bool _isCommitted;

            public Transaction(InMemoryHistoryRepository repository)
            {
                _repository = repository;
            }

            public Task CommitAsync(CancellationToken cancellationToken)
            {
                _repository.Commit();
                _isCommitted = true;
                return Task.CompletedTask;
            }

            public void Dispose() => RollbackIfNotCommitted();

            public ValueTask DisposeAsync()
            {
                RollbackIfNotCommitted();
                return ValueTask.CompletedTask;
            }

            private void RollbackIfNotCommitted()
            {
                if (!_isCommitted)
                {
                    _repository.Rollback();
                }
            }
        }
    }

    private sealed class MutableProductQueries : IProductQueries
    {
        private IReadOnlyList<ProductInfo> _products;

        public MutableProductQueries(IReadOnlyList<ProductInfo> products)
        {
            _products = products;
        }

        public void Replace(ProductInfo product) =>
            _products = [.. _products.Select(x => x.Id == product.Id ? product : x)];

        public Task<IReadOnlyList<ProductInfo>> GetAllProductsAsync(CancellationToken cancellationToken) =>
            Task.FromResult(_products);

        public Task<ProductInfo?> GetProductAsync(Guid productId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<Guid>> GetAllProductsIdsAsync(CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<LotCalculationResult>> GetLotCalculationResultsAsync(Guid productId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<int> GetUnpublishedOnEbayCountAsync(
            Guid productId,
            MeasurementState measurementState,
            DateTimeOffset publishedThreshold,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class NotSupportedProductRepository : IProductRepository
    {
        public Task<Product?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task AddAsync(IWriteModelUnitOfWork unitOfWork, Product aggregate, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<Guid> id, CancellationToken cancellationToken) => throw new NotSupportedException();
    }

    private sealed class NotSupportedPriceRecalculationPublisher : IPriceRecalculationPublisher
    {
        public Task PublishForLotAsync(IWriteModelUnitOfWork unitOfWork, long lotId, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task PublishForProductAsync(IWriteModelUnitOfWork unitOfWork, Guid productId, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task PublishForAllAsync(IWriteModelUnitOfWork unitOfWork, CancellationToken cancellationToken) => throw new NotSupportedException();
    }
}
