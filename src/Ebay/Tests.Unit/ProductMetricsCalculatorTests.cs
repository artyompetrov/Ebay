using AwesomeAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.New.PriceCalculator;
using Server.Domain;
using Server.Domain.Measurements;
using Server.Domain.Product;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ProductMetricsCalculator))]
public sealed class ProductMetricsCalculatorTests
{
    [Test]
    public async Task CalculateAsync_RecalculatesAndSavesProductMetrics_WhenProductExists()
    {
        var product = Product.Create(name: "test-product", weight: 10, searchQueries: [], ruSearchQueries: []);
        var lotCalculationResults = new[]
        {
            new LotCalculationResult { Revenue = 10.0, QuantityTotal = 1, ListingPriceSumm = 20.0, CalculationDate = DateTimeOffset.UtcNow }
        };
        var unitOfWork = new RecordingUnitOfWork();

        var calculator = new ProductMetricsCalculator(
            productQueries: new StaticProductQueries(lotCalculationResults, unpublishedCreated: 2, unpublishedSelling: 3),
            productRepository: new SingleProductRepository(product),
            unitOfWork: unitOfWork,
            logger: NullLogger<ProductMetricsCalculator>.Instance);

        await calculator.CalculateAsync(product.Id, CancellationToken.None);

        product.ProductCalculationResult.Should().NotBeNull();
        product.ProductCalculationResult!.Revenue.Should().Be(10.0);
        product.ProductCalculationResult.UnpublishedOnEbayCountCreated.Should().Be(2);
        product.ProductCalculationResult.UnpublishedOnEbayCountSelling.Should().Be(3);
        unitOfWork.SaveChangesCallCount.Should().Be(1);
    }

    [Test]
    public async Task CalculateAsync_DoesNothing_WhenProductNotFound()
    {
        var unitOfWork = new RecordingUnitOfWork();
        var calculator = new ProductMetricsCalculator(
            productQueries: new StaticProductQueries([], unpublishedCreated: 0, unpublishedSelling: 0),
            productRepository: new SingleProductRepository(null),
            unitOfWork: unitOfWork,
            logger: NullLogger<ProductMetricsCalculator>.Instance);

        await calculator.CalculateAsync(Guid.NewGuid(), CancellationToken.None);

        unitOfWork.SaveChangesCallCount.Should().Be(0);
    }

    private sealed class SingleProductRepository : IProductRepository
    {
        private readonly Product? _product;

        public SingleProductRepository(Product? product)
        {
            _product = product;
        }

        public Task<Product?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
            Task.FromResult(_product != null && _product.Id == id ? _product : null);

        public Task AddAsync(Product aggregate, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(Guid id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(IReadOnlySet<Guid> id, CancellationToken cancellationToken) => throw new NotSupportedException();
    }

    private sealed class StaticProductQueries : IProductQueries
    {
        private readonly IReadOnlyList<LotCalculationResult> _lotCalculationResults;
        private readonly int _unpublishedCreated;
        private readonly int _unpublishedSelling;

        public StaticProductQueries(IReadOnlyList<LotCalculationResult> lotCalculationResults, int unpublishedCreated, int unpublishedSelling)
        {
            _lotCalculationResults = lotCalculationResults;
            _unpublishedCreated = unpublishedCreated;
            _unpublishedSelling = unpublishedSelling;
        }

        public Task<Server.Application.Abstractions.Driven.Models.ProductInfo?> GetProductAsync(Guid productId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<Server.Application.Abstractions.Driven.Models.ProductInfo>> GetAllProductsAsync(CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<Guid>> GetAllProductsIdsAsync(CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task<IReadOnlyList<LotCalculationResult>> GetLotCalculationResultsAsync(Guid productId, CancellationToken cancellationToken) =>
            Task.FromResult(_lotCalculationResults);

        public Task<int> GetUnpublishedOnEbayCountAsync(
            Guid productId,
            MeasurementState measurementState,
            DateTimeOffset publishedThreshold,
            CancellationToken cancellationToken) =>
            Task.FromResult(measurementState == MeasurementState.Created ? _unpublishedCreated : _unpublishedSelling);
    }

    private sealed class RecordingUnitOfWork : IWriteModelUnitOfWork
    {
        public int SaveChangesCallCount { get; private set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            SaveChangesCallCount++;
            return Task.FromResult(1);
        }

        public Task<IUnitOfWorkTransaction> BeginTransactionAsync(
            CancellationToken cancellationToken,
            System.Data.IsolationLevel isolationLevel = System.Data.IsolationLevel.ReadCommitted) =>
            throw new NotSupportedException();
    }
}
