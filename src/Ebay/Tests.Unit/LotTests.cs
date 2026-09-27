using AwesomeAssertions;
using Server.Domain;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(Lot))]
public sealed class LotTests
{
    [Test]
    public void UpdateInfo_ReplacesFieldsAndCategories()
    {
        var lot = CreateLot();

        lot.UpdateInfo(
            name: "updated-name",
            pcs: 2,
            lotSize: 5,
            currencyId: "EUR",
            shippingCountry: "DE",
            price: 20.0,
            shipping: 4.0,
            shippingAdditional: 1.0,
            description: "updated-description",
            shortDescription: "short",
            condition: "used",
            conditionDescription: "used-description",
            seller: "updated-seller",
            locatedIn: "DE",
            titleChangeDate: lot.TitleChangeDate,
            updateDate: DateTimeOffset.UtcNow,
            categories: new Dictionary<string, string> { ["condition"] = "used" });

        lot.Name.Should().Be("updated-name");
        lot.Pcs.Should().Be(2);
        lot.CurrencyId.Should().Be("EUR");
        lot.Categories.Should().BeEquivalentTo(new Dictionary<string, string> { ["condition"] = "used" });
    }

    [Test]
    public void UpsertPurchase_AddsNewPurchase_WhenNoneExistsForThatDate()
    {
        var lot = CreateLot();
        var date = DateTimeOffset.UtcNow;

        lot.UpsertPurchase(date, price: 10.0, quantity: 2);

        lot.Purchases.Should().ContainSingle();
        lot.Purchases.Single().Date.Should().Be(date);
        lot.Purchases.Single().Price.Should().Be(10.0);
        lot.Purchases.Single().Quantity.Should().Be(2);
    }

    [Test]
    public void UpsertPurchase_UpdatesExistingPurchase_WhenOneAlreadyExistsForThatDate()
    {
        var lot = CreateLot();
        var date = DateTimeOffset.UtcNow;
        lot.UpsertPurchase(date, price: 10.0, quantity: 2);

        lot.UpsertPurchase(date, price: 15.0, quantity: 3);

        lot.Purchases.Should().ContainSingle();
        lot.Purchases.Single().Price.Should().Be(15.0);
        lot.Purchases.Single().Quantity.Should().Be(3);
    }

    [Test]
    public void RemovePurchasesBefore_RemovesOnlyPurchasesOlderThanThreshold()
    {
        var lot = CreateLot();
        var threshold = DateTimeOffset.UtcNow;
        lot.UpsertPurchase(threshold.AddDays(-1), price: 10.0, quantity: 1);
        lot.UpsertPurchase(threshold.AddDays(1), price: 20.0, quantity: 1);

        lot.RemovePurchasesBefore(threshold);

        lot.Purchases.Should().ContainSingle();
        lot.Purchases.Single().Date.Should().Be(threshold.AddDays(1));
    }

    [Test]
    public void SetCalculationResult_SetsLotCalculationResult()
    {
        var lot = CreateLot();
        var result = new LotCalculationResult
        {
            Revenue = 100.0,
            QuantityTotal = 5,
            ListingPriceSumm = 200.0,
            CalculationDate = DateTimeOffset.UtcNow
        };

        lot.SetCalculationResult(result);

        lot.LotCalculationResult.Should().BeSameAs(result);
    }

    private static Lot CreateLot() => Lot.Create(
        id: 12345,
        productId: Guid.NewGuid(),
        name: "test-lot",
        pcs: 1,
        lotSize: null,
        currencyId: "USD",
        shippingCountry: "US",
        price: 10.0,
        shipping: 2.0,
        shippingAdditional: 0.5,
        description: "description",
        shortDescription: null,
        condition: "new",
        conditionDescription: null,
        seller: "seller",
        locatedIn: "US",
        titleChangeDate: DateTimeOffset.UtcNow.AddDays(-10),
        updateDate: DateTimeOffset.UtcNow,
        categories: new Dictionary<string, string> { ["condition"] = "new" });
}
