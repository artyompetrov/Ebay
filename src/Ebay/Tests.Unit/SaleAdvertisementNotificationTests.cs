using AwesomeAssertions;
using Server.Domain.SaleAdvertisements;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(SaleAdvertisementNotification))]
public sealed class SaleAdvertisementNotificationTests
{
    private static readonly Uri Link = new("https://market.example/ad/");
    private static readonly ExchangeRate RubRate = new("RUB", 80);

    private static readonly Guid TriggeringId = Guid.NewGuid();
    private static readonly Guid OtherId = Guid.NewGuid();

    [Test]
    public void Compose_NoNewlyRecordedInterestingProduct_ReturnsNull()
    {
        var notification = Compose(
            Line("Лампа 6Н2П", Match(TriggeringId, "6н2п", isInteresting: true, isNewlyRecorded: false)),
            Line("Лампа 6Н1П", Match(OtherId, "6н1п", isInteresting: false, isNewlyRecorded: true)));

        notification.Should().BeNull();
    }

    [Test]
    public void Compose_LineWithTriggeringProduct_ListsAllItsProductsInMatchOrder()
    {
        var notification = Compose(
            Line(
                "Лампа 6Н2П-ЕВ",
                Match(TriggeringId, "6н2п", isInteresting: true, isNewlyRecorded: true),
                Match(OtherId, "6н2п-ев", isInteresting: true, isNewlyRecorded: false)));

        var line = notification!.Lines.Should().ContainSingle().Subject;
        line.Text.Should().Be("Лампа 6Н2П-ЕВ");
        line.Products.Select(static x => (x.Name, x.IsTriggering)).Should().Equal(("6н2п", true), ("6н2п-ев", false));
    }

    [Test]
    public void Compose_LineWithoutTriggeringProduct_IsNotShown()
    {
        var notification = Compose(
            Line("Лампа 6Н2П", Match(TriggeringId, "6н2п", isInteresting: true, isNewlyRecorded: true)),
            Line("Лампа 6Н3П", Match(OtherId, "6н3п", isInteresting: true, isNewlyRecorded: false)));

        notification!.Lines.Select(static x => x.Text).Should().Equal("Лампа 6Н2П");
    }

    [Test]
    public void Compose_ProductTriggeredOnEarlierLine_IsTriggeringOnLaterLineToo()
    {
        var notification = Compose(
            Line("6Н2П 10 шт", Match(TriggeringId, "6н2п", isInteresting: true, isNewlyRecorded: true)),
            Line("6Н2П-ЕВ 5 шт", Match(TriggeringId, "6н2п", isInteresting: true, isNewlyRecorded: false)));

        notification!.Lines.Should().HaveCount(2)
            .And.AllSatisfy(static x => x.Products.Should().ContainSingle().Which.IsTriggering.Should().BeTrue());
    }

    [Test]
    public void Compose_RepeatedLineText_IsShownOnce()
    {
        var notification = Compose(
            Line("Лампа 6Н2П", Match(TriggeringId, "6н2п", isInteresting: true, isNewlyRecorded: true)),
            Line("Лампа 6Н2П", Match(TriggeringId, "6н2п", isInteresting: true, isNewlyRecorded: false)));

        notification!.Lines.Should().ContainSingle();
    }

    [Test]
    public void Compose_Product_GetsEstimatedPriceAndQuantity()
    {
        var notification = Compose(Line("Лампа 6Н2П", Match(TriggeringId, "6н2п", isInteresting: true, isNewlyRecorded: true)));

        var product = notification!.Lines.Single().Products.Single();
        product.EstimatedPrice.Should().Be(EstimatedPrice.FromUsd(15.4, RubRate));
        product.QuantityTotal.Should().Be(7);
    }

    [Test]
    public void Compose_BlankContact_IsDropped()
    {
        var notification = SaleAdvertisementNotification.Compose(
            title: "Радиолампы",
            sellerName: "Евгений Смирнов",
            link: Link,
            contact: "  ",
            lineMatches: [Line("Лампа 6Н2П", Match(TriggeringId, "6н2п", isInteresting: true, isNewlyRecorded: true))],
            targetRate: RubRate);

        notification!.Contact.Should().BeNull();
        notification.Title.Should().Be("Радиолампы");
        notification.SellerName.Should().Be("Евгений Смирнов");
        notification.Link.Should().Be(Link);
    }

    private static SaleAdvertisementNotification? Compose(params SaleAdvertisementLineMatch[] lines) =>
        SaleAdvertisementNotification.Compose("Продам лампы", "Seller Name", Link, contact: null, lines, RubRate);

    private static SaleAdvertisementLineMatch Line(string text, params SaleAdvertisementProductMatch[] products) =>
        new(text, products);

    private static SaleAdvertisementProductMatch Match(Guid productId, string name, bool isInteresting, bool isNewlyRecorded) =>
        new(productId, name, RevenueAvgUsd: 15.4, QuantityTotal: 7, isInteresting, isNewlyRecorded);
}
