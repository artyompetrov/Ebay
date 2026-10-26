using AwesomeAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Server.Application.Currencies;
using Server.Domain;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(DefaultCurrencyService))]
public sealed class DefaultCurrencyServiceTests
{
    private const string MissingCurrencyId = "CAD";
    private const string ExistingCurrencyId = "RUB";
    private const string ExistingRusName = "Рубль (вручную)";
    private const double ExistingRate = 95.5;

    private static readonly DateTimeOffset ExistingLastUpdate = new(2026, 10, 1, 0, 0, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset PlaceholderDate = new(1970, 1, 1, 0, 0, 0, TimeSpan.Zero);

    [Test]
    [OpenSpecScenario("default-currencies", "Default currencies exist after start", "Missing default currency is added with a placeholder rate")]
    public async Task AddMissingDefaultCurrencies_CurrencyMissing_AddsItWithPlaceholderRate()
    {
        var context = CreateContext();

        await context.Service.AddMissingDefaultCurrenciesAsync(CancellationToken.None);

        var added = context.Repository.Currencies[MissingCurrencyId];
        added.CurrencyApiName.Should().Be(MissingCurrencyId);
        added.CurrencyRate.Should().BePositive();
        added.LastUpdate.Should().Be(PlaceholderDate);
        context.Repository.Currencies.Keys.Should().BeEquivalentTo(DefaultCurrencyService.Defaults.Select(static x => x.Id));
        context.UnitOfWork.SaveChangesCallCount.Should().Be(1);
    }

    [Test]
    [OpenSpecScenario("default-currencies", "Default currencies exist after start", "Existing currency is kept")]
    public async Task AddMissingDefaultCurrencies_CurrencyExists_KeepsIt()
    {
        var existing = Currency.Create(ExistingCurrencyId, ExistingRusName, ExistingCurrencyId, ExistingRate, ExistingLastUpdate);
        var context = CreateContext(existing);

        await context.Service.AddMissingDefaultCurrenciesAsync(CancellationToken.None);

        context.Repository.Currencies[ExistingCurrencyId].Should().BeSameAs(existing);
        existing.CurrencyRusName.Should().Be(ExistingRusName);
        existing.CurrencyRate.Should().Be(ExistingRate);
        existing.LastUpdate.Should().Be(ExistingLastUpdate);
    }

    private static TestContext CreateContext(params Currency[] existing)
    {
        var repository = new InMemoryCurrencyRepository(existing);
        var unitOfWork = new StubUnitOfWork();
        var service = new DefaultCurrencyService(
            NullLogger<DefaultCurrencyService>.Instance,
            repository,
            new SingleUnitOfWorkFactory(unitOfWork));
        return new TestContext(service, repository, unitOfWork);
    }

    private sealed record TestContext(DefaultCurrencyService Service, InMemoryCurrencyRepository Repository, StubUnitOfWork UnitOfWork);
}
