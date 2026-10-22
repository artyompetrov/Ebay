using System.Data;
using AwesomeAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using OneOf;
using OneOf.Types;
using Server.Application;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.Currencies;
using Server.Application.LotForSale;
using Server.Domain;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(CurrencyRateService))]
public sealed class CurrencyRateServiceTests
{
    private static readonly DateTimeOffset PreviousUpdate = new(2026, 1, 1, 0, 0, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset Now = new(2026, 10, 10, 12, 0, 0, TimeSpan.Zero);

    [Test]
    public async Task RefreshRatesAsync_AppliesRatesFromSourceToCurrencies_AndCommits()
    {
        var euro = Currency.Create("EUR", "Евро", "eur-api", 1.0, PreviousUpdate);
        var pound = Currency.Create("GBP", "Фунт", "gbp-api", 1.0, PreviousUpdate);
        var rateSource = new StaticRateSource(new Dictionary<string, double> { ["eur-api"] = 0.9, ["gbp-api"] = 0.8 });
        var unitOfWork = new RecordingUnitOfWork();
        var service = new CurrencyRateService(
            NullLogger<CurrencyRateService>.Instance,
            new StaticCurrencyQueries([ToInfo(euro), ToInfo(pound)]),
            new InMemoryCurrencyRepository(euro, pound),
            rateSource,
            new SingleUnitOfWorkFactory(unitOfWork),
            new FixedTimeProvider(Now));

        await service.RefreshRatesAsync(CancellationToken.None);

        rateSource.RequestedBaseCurrency.Should().Be(WellKnown.CurrencyRate.BaseCurrency);
        rateSource.RequestedApiNames.Should().BeEquivalentTo(["eur-api", "gbp-api"]);
        euro.CurrencyRate.Should().Be(0.9);
        euro.LastUpdate.Should().Be(Now);
        pound.CurrencyRate.Should().Be(0.8);
        pound.LastUpdate.Should().Be(Now);
        unitOfWork.SaveChangesCallCount.Should().Be(1);
    }

    private static CurrencyInfo ToInfo(Currency currency) =>
        new(currency.Id, currency.CurrencyRusName, currency.CurrencyApiName, currency.CurrencyRate, currency.LastUpdate);

    private sealed class FixedTimeProvider : ICurrentTimeProvider
    {
        public FixedTimeProvider(DateTimeOffset utcNow)
        {
            UtcNow = utcNow;
        }

        public DateTimeOffset UtcNow { get; }
    }

    private sealed class StaticRateSource : ICurrencyRateSource
    {
        private readonly IReadOnlyDictionary<string, double> _rates;

        public StaticRateSource(IReadOnlyDictionary<string, double> rates)
        {
            _rates = rates;
        }

        public string? RequestedBaseCurrency { get; private set; }

        public string[] RequestedApiNames { get; private set; } = [];

        public Task<OneOf<IReadOnlyDictionary<string, double>, Error<string>>> GetLatestRatesAsync(
            string baseCurrency,
            IEnumerable<string> currencyApiNames,
            CancellationToken cancellationToken)
        {
            RequestedBaseCurrency = baseCurrency;
            RequestedApiNames = [.. currencyApiNames];
            return Task.FromResult<OneOf<IReadOnlyDictionary<string, double>, Error<string>>>(OneOf<IReadOnlyDictionary<string, double>, Error<string>>.FromT0(_rates));
        }
    }

    private sealed class StaticCurrencyQueries : ICurrencyQueries
    {
        private readonly IReadOnlyList<CurrencyInfo> _currencies;

        public StaticCurrencyQueries(IReadOnlyList<CurrencyInfo> currencies)
        {
            _currencies = currencies;
        }

        public Task<IReadOnlyList<CurrencyInfo>> GetAllCurrenciesAsync(CancellationToken cancellationToken) =>
            Task.FromResult(_currencies);

        public Task<IReadOnlyDictionary<string, double>> GetCurrencyRatesAsync(CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class InMemoryCurrencyRepository : ICurrencyRepository
    {
        private readonly Dictionary<string, Currency> _currencies;

        public InMemoryCurrencyRepository(params Currency[] currencies)
        {
            _currencies = currencies.ToDictionary(static x => x.Id);
        }

        public Task<Currency?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, string id, CancellationToken cancellationToken) =>
            Task.FromResult(_currencies.GetValueOrDefault(id));

        public Task AddAsync(IWriteModelUnitOfWork unitOfWork, Currency aggregate, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, string id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<string> id, CancellationToken cancellationToken) => throw new NotSupportedException();
    }

    private sealed class RecordingUnitOfWork : IWriteModelUnitOfWork
    {
        public ValueTask DisposeAsync() => ValueTask.CompletedTask;

        public int SaveChangesCallCount { get; private set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            SaveChangesCallCount++;
            return Task.FromResult(1);
        }

        public Task<IUnitOfWorkTransaction> BeginTransactionAsync(
            CancellationToken cancellationToken,
            IsolationLevel isolationLevel = IsolationLevel.ReadCommitted) =>
            throw new NotSupportedException();
    }
}
