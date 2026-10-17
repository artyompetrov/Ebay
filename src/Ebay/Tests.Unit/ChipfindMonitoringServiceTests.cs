using System.Data;
using AwesomeAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Server.Application;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.SaleAdvertisements;
using Server.Domain;
using Server.Domain.Measurements;
using Server.Domain.Product;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ChipfindMonitoringService))]
public sealed class ChipfindMonitoringServiceTests
{
    private const string TargetEmail = "target@localhost";
    private const string Seller = "seller";
    private const string ProductName = "6н2п";

    private static readonly Guid ProductId = Guid.NewGuid();
    private static readonly DateTimeOffset AdvertisementDate = new(2026, 1, 2, 3, 4, 5, TimeSpan.Zero);

    [Test]
    public async Task ProcessRecentAdvertisementsAsync_AdvertisementMatchesProduct_RecordsHistoryAndCommits()
    {
        var historyRepository = new RecordingHistoryRepository();
        var unitOfWork = new RecordingUnitOfWork();
        var emailSender = new RecordingEmailSender();
        var service = CreateService(
            historyRepository,
            new StaticHistoryQueries(existingId: null),
            unitOfWork,
            emailSender,
            CreateAdvertisement("Лампа 6Н2П новая", "Конденсатор К73"));

        await service.ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        var record = historyRepository.Added.Should().ContainSingle().Subject;
        record.ProductId.Should().Be(ProductId);
        record.Seller.Should().Be(Seller);
        record.Marketplace.Should().Be(WellKnown.ChipFind.Marketplace);
        record.IsAmbiguous.Should().BeFalse();
        record.AdvertisementDate.Should().Be(AdvertisementDate);
        unitOfWork.SaveChangesCallCount.Should().Be(1);
        unitOfWork.CommittedTransactionCount.Should().Be(1);
        emailSender.SentCount.Should().Be(0, "product without calculation result is not interesting");
    }

    [Test]
    public async Task ProcessRecentAdvertisementsAsync_AdvertisementAlreadyRecorded_UpdatesExistingRecordWithoutAddingNew()
    {
        var existing = ProductEmailSendHistory.Create(
            productId: ProductId,
            seller: Seller,
            link: "https://old.example/",
            marketplace: WellKnown.ChipFind.Marketplace,
            isAmbiguous: false,
            advertisementDate: AdvertisementDate.AddDays(-1),
            contact: null);
        var historyRepository = new RecordingHistoryRepository(existing);
        var emailSender = new RecordingEmailSender();
        var service = CreateService(
            historyRepository,
            new StaticHistoryQueries(existing.Id),
            new RecordingUnitOfWork(),
            emailSender,
            CreateAdvertisement("Лампа 6Н2П новая"));

        await service.ProcessRecentAdvertisementsAsync(TargetEmail, CancellationToken.None);

        historyRepository.Added.Should().BeEmpty();
        existing.AdvertisementDate.Should().Be(AdvertisementDate);
        existing.Link.Should().Be("https://chipfind.example/ad/");
        emailSender.SentCount.Should().Be(0);
    }

    private static ChipfindMonitoringService CreateService(
        RecordingHistoryRepository historyRepository,
        StaticHistoryQueries historyQueries,
        RecordingUnitOfWork unitOfWork,
        RecordingEmailSender emailSender,
        SaleAdvertisement advertisement)
    {
        var product = new ProductInfo(
            Id: ProductId,
            Name: ProductName,
            SearchQueries: [],
            RuSearchQueries: [],
            Weight: 100,
            CalculationResult: null,
            LastCheckTime: AdvertisementDate,
            Description: null);
        var productService = new ProductService(
            new SingleUnitOfWorkFactory(unitOfWork),
            new NotSupportedProductRepository(),
            new StaticProductQueries(product),
            new NotSupportedPriceRecalculationPublisher(),
            new ProductDescriptionSanitizer());

        return new ChipfindMonitoringService(
            NullLogger<ChipfindMonitoringService>.Instance,
            historyRepository,
            historyQueries,
            new SingleUnitOfWorkFactory(unitOfWork),
            new StaticChipfindAdapter(advertisement),
            emailSender,
            productService);
    }

    private static SaleAdvertisement CreateAdvertisement(params string[] items) =>
        new(
            Title: "Продам лампы",
            Seller: Seller,
            Date: AdvertisementDate,
            Link: new Uri("https://chipfind.example/ad/"),
            Items: items,
            Body: string.Join(" ", items));

    private sealed class RecordingHistoryRepository : IProductEmailSendHistoryRepository
    {
        private readonly ProductEmailSendHistory? _existing;

        public RecordingHistoryRepository(ProductEmailSendHistory? existing = null)
        {
            _existing = existing;
        }

        public List<ProductEmailSendHistory> Added { get; } = [];

        public Task<ProductEmailSendHistory?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken) =>
            Task.FromResult(_existing?.Id == id ? _existing : null);

        public Task AddAsync(IWriteModelUnitOfWork unitOfWork, ProductEmailSendHistory aggregate, CancellationToken cancellationToken)
        {
            Added.Add(aggregate);
            return Task.CompletedTask;
        }

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<Guid> id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveOlderThanAsync(IWriteModelUnitOfWork unitOfWork, DateTimeOffset threshold, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class StaticHistoryQueries : IProductEmailSendHistoryQueries
    {
        private readonly Guid? _existingId;

        public StaticHistoryQueries(Guid? existingId)
        {
            _existingId = existingId;
        }

        public Task<Guid?> FindIdAsync(Guid productId, string seller, string marketplace, CancellationToken cancellationToken) =>
            Task.FromResult(_existingId);

        public Task<IReadOnlyList<ProductEmailSendHistoryDetails>> GetForProductAsync(Guid productId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class StaticChipfindAdapter : IChipfindAdapter
    {
        private readonly SaleAdvertisement _advertisement;

        public StaticChipfindAdapter(SaleAdvertisement advertisement)
        {
            _advertisement = advertisement;
        }

        public Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentSaleAdvertisements(CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyCollection<SaleAdvertisement>>([_advertisement]);

        public Task<string?> TryGetAdvertisementContactAsync(SaleAdvertisement saleAdvertisement, CancellationToken cancellationToken) =>
            Task.FromResult<string?>(null);
    }

    private sealed class RecordingEmailSender : IEmailSender
    {
        public int SentCount { get; private set; }

        public Task Send(string targetAddress, string topic, string messageText)
        {
            SentCount++;
            return Task.CompletedTask;
        }
    }

    private sealed class RecordingUnitOfWork : IWriteModelUnitOfWork
    {
        public ValueTask DisposeAsync() => ValueTask.CompletedTask;

        public int SaveChangesCallCount { get; private set; }

        public int CommittedTransactionCount { get; private set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            SaveChangesCallCount++;
            return Task.FromResult(1);
        }

        public Task<IUnitOfWorkTransaction> BeginTransactionAsync(
            CancellationToken cancellationToken,
            IsolationLevel isolationLevel = IsolationLevel.ReadCommitted) =>
            Task.FromResult<IUnitOfWorkTransaction>(new RecordingTransaction(this));

        private sealed class RecordingTransaction : IUnitOfWorkTransaction
        {
            private readonly RecordingUnitOfWork _owner;

            public RecordingTransaction(RecordingUnitOfWork owner)
            {
                _owner = owner;
            }

            public Task CommitAsync(CancellationToken cancellationToken)
            {
                _owner.CommittedTransactionCount++;
                return Task.CompletedTask;
            }

            public void Dispose()
            {
            }

            public ValueTask DisposeAsync() => ValueTask.CompletedTask;
        }
    }

    private sealed class StaticProductQueries : IProductQueries
    {
        private readonly ProductInfo _product;

        public StaticProductQueries(ProductInfo product)
        {
            _product = product;
        }

        public Task<IReadOnlyList<ProductInfo>> GetAllProductsAsync(CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyList<ProductInfo>>([_product]);

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
