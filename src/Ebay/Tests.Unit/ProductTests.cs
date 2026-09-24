using AwesomeAssertions;
using Server.Domain;
using Server.Domain.Product;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(Product))]
public sealed class ProductTests
{
    [Test]
    public void RecalculateMetrics_SumsRevenueQuantityAndListingPrice_AcrossLotCalculationResults()
    {
        var product = CreateProduct();
        var calculationDate = DateTimeOffset.UtcNow.AddDays(-1);
        var lotCalculationResults = new[]
        {
            new LotCalculationResult { Revenue = 10.0, QuantityTotal = 2, ListingPriceSumm = 30.0, CalculationDate = calculationDate },
            new LotCalculationResult { Revenue = 5.0, QuantityTotal = 1, ListingPriceSumm = 15.0, CalculationDate = calculationDate }
        };

        product.RecalculateMetrics(lotCalculationResults, unpublishedOnEbayCountCreated: 3, unpublishedOnEbayCountSelling: 4);

        product.ProductCalculationResult.Should().NotBeNull();
        product.ProductCalculationResult!.Revenue.Should().Be(15.0);
        product.ProductCalculationResult.QuantityTotal.Should().Be(3);
        product.ProductCalculationResult.ListingPriceSumm.Should().Be(45.0);
        product.ProductCalculationResult.UnpublishedOnEbayCountCreated.Should().Be(3);
        product.ProductCalculationResult.UnpublishedOnEbayCountSelling.Should().Be(4);
    }

    [Test]
    public void RecalculateMetrics_UsesEarliestCalculationDate_AmongLotCalculationResults()
    {
        var product = CreateProduct();
        var earliestDate = DateTimeOffset.UtcNow.AddDays(-10);
        var laterDate = DateTimeOffset.UtcNow.AddDays(-1);
        var lotCalculationResults = new[]
        {
            new LotCalculationResult { Revenue = 1.0, QuantityTotal = 1, ListingPriceSumm = 1.0, CalculationDate = laterDate },
            new LotCalculationResult { Revenue = 1.0, QuantityTotal = 1, ListingPriceSumm = 1.0, CalculationDate = earliestDate }
        };

        product.RecalculateMetrics(lotCalculationResults, unpublishedOnEbayCountCreated: 0, unpublishedOnEbayCountSelling: 0);

        product.ProductCalculationResult!.CalculationDate.Should().Be(earliestDate);
    }

    [Test]
    public void RecalculateMetrics_ProducesZeroTotalsAndCurrentCalculationDate_WhenNoLotCalculationResults()
    {
        var product = CreateProduct();
        var before = DateTimeOffset.UtcNow;

        product.RecalculateMetrics([], unpublishedOnEbayCountCreated: 0, unpublishedOnEbayCountSelling: 0);

        var after = DateTimeOffset.UtcNow;
        product.ProductCalculationResult!.Revenue.Should().Be(0.0);
        product.ProductCalculationResult.QuantityTotal.Should().Be(0);
        product.ProductCalculationResult.ListingPriceSumm.Should().Be(0.0);
        product.ProductCalculationResult.CalculationDate.Should().BeOnOrAfter(before).And.BeOnOrBefore(after);
    }

    private static Product CreateProduct() => Product.Create(
        name: "Test product",
        weight: 100,
        searchQueries: [],
        ruSearchQueries: []);
}
