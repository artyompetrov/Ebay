using AwesomeAssertions;
using Server.Domain.SaleAdvertisements;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(EstimatedPrice))]
public sealed class EstimatedPriceTests
{
    [Test]
    public void FromUsd_WithTargetRate_ConvertsAndRoundsToWholeUnits()
    {
        var price = EstimatedPrice.FromUsd(15.4, new ExchangeRate("RUB", 80));

        price.Amount.Should().Be(1232);
        price.CurrencyId.Should().Be("RUB");
    }

    [Test]
    public void FromUsd_WithoutTargetRate_StaysInDollars()
    {
        var price = EstimatedPrice.FromUsd(15.4, targetRate: null);

        price.Amount.Should().Be(15);
        price.CurrencyId.Should().Be("USD");
    }

    [Test]
    public void FromUsd_HalfUnit_RoundsAwayFromZero()
    {
        EstimatedPrice.FromUsd(2.5, targetRate: null).Amount.Should().Be(3);
    }
}
