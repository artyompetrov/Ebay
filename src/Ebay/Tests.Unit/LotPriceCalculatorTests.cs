using AwesomeAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.New.PriceCalculator;
using Server.Domain;
using Server.Domain.Measurements;
using Tests.Shared;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(LotPriceCalculator))]
public sealed class LotPriceCalculatorTests
{
    [Test]
    public async Task CalculateAsync_SetsLotAndPurchaseCalculationResults_AndSavesThroughUnitOfWork()
    {
        var productId = Guid.NewGuid();
        var lot = Lot.Create(
            id: 12345,
            productId: productId,
            name: "test-lot",
            pcs: 2,
            lotSize: null,
            currencyId: "USD",
            shippingCountry: "US",
            price: 100.0,
            shipping: 5.0,
            shippingAdditional: 1.0,
            description: "description",
            shortDescription: null,
            condition: "new",
            conditionDescription: null,
            seller: "seller",
            locatedIn: "US",
            titleChangeDate: DateTimeOffset.UtcNow.AddDays(-10),
            updateDate: DateTimeOffset.UtcNow,
            categories: new Dictionary<string, string>());
        lot.UpsertPurchase(DateTimeOffset.UtcNow.AddDays(-1), price: null, quantity: 3);

        var product = new ProductInfo(
            Id: productId,
            Name: "test-product",
            SearchQueries: [],
            RuSearchQueries: [],
            Weight: 10,
            CalculationResult: null,
            LastCheckTime: DateTimeOffset.UtcNow);

        var currencyRates = new Dictionary<string, double> { ["USD"] = 1.0, ["KZT"] = 450.0 };
        var unitOfWork = new RecordingUnitOfWork();

        var calculator = new LotPriceCalculator(
            lotRepository: new SingleLotRepository(lot),
            productQueries: new SingleProductQueries(product),
            currencyQueries: new StaticCurrencyQueries(currencyRates),
            unitOfWork: unitOfWork,
            logger: NullLogger<LotPriceCalculator>.Instance);

        var returnedProductId = await calculator.CalculateAsync(lot.Id, CancellationToken.None);

        returnedProductId.Should().Be(productId);
        lot.LotCalculationResult.Should().NotBeNull();
        lot.LotCalculationResult!.QuantityTotal.Should().Be(lot.Pcs * 3);
        lot.Purchases.Single().PurchaseCalculationResult.Should().NotBeNull();
        lot.Purchases.Single().PurchaseCalculationResult!.QuantityTotal.Should().Be(lot.Pcs * 3);
        unitOfWork.SaveChangesCallCount.Should().Be(1);
    }

    private sealed class SingleLotRepository : ILotRepository
    {
        private readonly Lot _lot;

        public SingleLotRepository(Lot lot)
        {
            _lot = lot;
        }

        public Task<Lot?> GetByIdAsync(long id, CancellationToken cancellationToken) =>
            Task.FromResult(_lot.Id == id ? _lot : null);

        public Task AddAsync(Lot aggregate, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(long id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(IReadOnlySet<long> id, CancellationToken cancellationToken) => throw new NotSupportedException();
    }

    private sealed class SingleProductQueries : IProductQueries
    {
        private readonly ProductInfo _product;

        public SingleProductQueries(ProductInfo product)
        {
            _product = product;
        }

        public Task<ProductInfo?> GetProductAsync(Guid productId, CancellationToken cancellationToken) =>
            Task.FromResult(_product.Id == productId ? _product : null);

        public Task<IReadOnlyList<ProductInfo>> GetAllProductsAsync(CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task<IReadOnlyList<Guid>> GetAllProductsIdsAsync(CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task<IReadOnlyList<LotCalculationResult>> GetLotCalculationResultsAsync(Guid productId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<int> GetUnpublishedOnEbayCountAsync(
            Guid productId,
            MeasurementState measurementState,
            DateTimeOffset publishedThreshold,
            CancellationToken cancellationToken) => throw new NotSupportedException();
    }

    private sealed class StaticCurrencyQueries : ICurrencyQueries
    {
        private readonly IReadOnlyDictionary<string, double> _rates;

        public StaticCurrencyQueries(IReadOnlyDictionary<string, double> rates)
        {
            _rates = rates;
        }

        public Task<IReadOnlyList<CurrencyInfo>> GetAllCurrenciesAsync(CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task<IReadOnlyDictionary<string, double>> GetCurrencyRatesAsync(CancellationToken cancellationToken) => Task.FromResult(_rates);
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
