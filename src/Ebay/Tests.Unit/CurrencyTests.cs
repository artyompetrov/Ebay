using AwesomeAssertions;
using Server.Domain;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(Currency))]
public sealed class CurrencyTests
{
    [Test]
    public void Create_SetsFieldsFromArguments()
    {
        var lastUpdate = DateTimeOffset.UtcNow;

        var currency = Currency.Create("USD", "Доллар США", "USD", 1.0, lastUpdate);

        currency.Id.Should().Be("USD");
        currency.CurrencyRusName.Should().Be("Доллар США");
        currency.CurrencyApiName.Should().Be("USD");
        currency.CurrencyRate.Should().Be(1.0);
        currency.LastUpdate.Should().Be(lastUpdate);
    }

    [Test]
    public void UpdateRate_UpdatesRateAndLastUpdate()
    {
        var currency = Currency.Create("EUR", "Евро", "EUR", 0.9, DateTimeOffset.UtcNow.AddDays(-1));
        var newLastUpdate = DateTimeOffset.UtcNow;

        currency.UpdateRate(0.95, newLastUpdate);

        currency.CurrencyRate.Should().Be(0.95);
        currency.LastUpdate.Should().Be(newLastUpdate);
    }
}
