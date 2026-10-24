using System.Text.RegularExpressions;
using AwesomeAssertions;
using Server.Adapters.Driven.Smtp;
using Server.Domain.SaleAdvertisements;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(SaleAdvertisementNotificationHtml))]
public sealed class SaleAdvertisementNotificationHtmlTests
{
    private static readonly Uri Link = new("https://market.example/ad/?a=1&b=2");
    private static readonly ExchangeRate RubRate = new("RUB", 80);

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification table has one group of rows per notified line", "A line matching two products spans two rows")]
    public void Body_LineWithTwoProducts_SpansLineCellOverBothRows()
    {
        var notification = Notification(Line("Лампа 6Н2П новая", Triggering("6Н2П"), Other("6Н2П-ЕВ")));

        var body = SaleAdvertisementNotificationHtml.Body(notification);

        var group = NotificationTable.Groups(body).Should().ContainSingle().Subject;
        group.LineHtml.Should().Be("Лампа 6Н2П новая");
        group.RowSpan.Should().Be(2);
        group.Products.Should().HaveCount(2);
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification consists of a link, one table and the contact", "A line matching several products has no text marker")]
    public void Body_LineWithTwoProducts_HasNoAmbiguityMarker()
    {
        var notification = Notification(Line("Лампа 6Н2П новая", Triggering("6Н2П"), Triggering("6Н2П-ЕВ")));

        SaleAdvertisementNotificationHtml.Body(notification).Should().NotContain("Нашлось несколько товаров");
    }

    [Test]
    public void Body_TriggeringAndOtherProduct_OnlyTriggeringIsBold()
    {
        var notification = Notification(Line("Лампа 6Н2П новая", Triggering("6Н2П"), Other("6Н2П-ЕВ")));

        NotificationTable.Groups(SaleAdvertisementNotificationHtml.Body(notification)).Single().Products.Select(static x => x.NameHtml)
            .Should().Equal("<b>6Н2П</b>", "6Н2П-ЕВ");
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification text is HTML-encoded", "Product name is HTML-encoded")]
    public void Body_ProductNameWithMarkup_IsHtmlEncoded()
    {
        var notification = Notification(Line("Лампа 6Н2П новая", Triggering("<i>6Н2П</i>")));

        SaleAdvertisementNotificationHtml.Body(notification).Should().Contain("&lt;i&gt;6Н2П&lt;/i&gt;").And.NotContain("<i>6Н2П</i>");
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification text is HTML-encoded", "Advertisement line is HTML-encoded")]
    public void Body_LineWithMarkup_IsHtmlEncoded()
    {
        var notification = Notification(Line("6Н2П <10 шт> & 6Н1П", Triggering("6Н2П")));

        SaleAdvertisementNotificationHtml.Body(notification)
            .Should().Contain("6Н2П &lt;10 шт&gt; &amp; 6Н1П").And.NotContain("6Н2П <10 шт> & 6Н1П");
    }

    [Test]
    public void Body_LinkAndContactWithMarkup_AreHtmlEncoded()
    {
        var notification = Notification("<Иван> & сын", Line("Лампа 6Н2П новая", Triggering("6Н2П")));

        SaleAdvertisementNotificationHtml.Body(notification)
            .Should().Contain("href=\"https://market.example/ad/?a=1&amp;b=2\"")
            .And.EndWith("</table><br><div>&lt;Иван&gt; &amp; сын</div>");
    }

    [Test]
    public void Body_NoContact_EndsWithTable()
    {
        var notification = Notification(Line("Лампа 6Н2П новая", Triggering("6Н2П")));

        SaleAdvertisementNotificationHtml.Body(notification).Should().EndWith("</table>");
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Notification table has bounded column widths", "Long unbroken line does not widen the table")]
    public void Body_LongUnbrokenLine_TableHasFixedLayoutAndLineCellWraps()
    {
        var longLine = new string('Ж', 300);
        var notification = Notification(Line(longLine, Triggering("6Н2П")));

        var body = SaleAdvertisementNotificationHtml.Body(notification);

        body.Should().Contain("table-layout:fixed");
        Regex.Matches(body, "<th[^>]*>").Select(static x => x.Value)
            .Should().HaveCount(4).And.AllSatisfy(static x => x.Should().MatchRegex("width=\"\\d+\""));
        body.Should().MatchRegex($"<td rowspan=\"1\" style=\"[^\"]*overflow-wrap:anywhere[^\"]*\">{longLine}</td>");
        Regex.Matches(body, "<td style=\"[^\"]*\">1232 RUB</td>").Should().ContainSingle()
            .Which.Value.Should().Contain("white-space:nowrap");
    }

    [Test]
    public void Body_Price_IsShownInWholeUnitsWithCurrency()
    {
        var withRate = Notification(Line("Лампа 6Н2П новая", Triggering("6Н2П")));
        var withoutRate = SaleAdvertisementNotification.Compose("Продам лампы", "Seller Name", Link, contact: null, [Line("Лампа 6Н2П новая", Triggering("6Н2П"))], targetRate: null)!;

        NotificationTable.Groups(SaleAdvertisementNotificationHtml.Body(withRate)).Single().Products.Single()
            .Should().Be(new NotificationTable.Product(NameHtml: "<b>6Н2П</b>", Price: "1232 RUB", Quantity: "7"));
        NotificationTable.Groups(SaleAdvertisementNotificationHtml.Body(withoutRate)).Single().Products.Single().Price
            .Should().Be("15 USD");
    }

    [Test]
    public void Subject_UsesTitleAndSellerName()
    {
        var notification = Notification(Line("Лампа 6Н2П новая", Triggering("6Н2П")));

        SaleAdvertisementNotificationHtml.Subject(notification).Should().Be("Продам лампы [Seller Name]");
    }

    private static SaleAdvertisementNotification Notification(params SaleAdvertisementLineMatch[] lines) =>
        Notification(contact: null, lines);

    private static SaleAdvertisementNotification Notification(string? contact, params SaleAdvertisementLineMatch[] lines) =>
        SaleAdvertisementNotification.Compose("Продам лампы", "Seller Name", Link, contact, lines, RubRate)!;

    private static SaleAdvertisementLineMatch Line(string text, params SaleAdvertisementProductMatch[] products) =>
        new(text, products);

    private static SaleAdvertisementProductMatch Triggering(string name) => Match(name, isNewlyRecorded: true);

    private static SaleAdvertisementProductMatch Other(string name) => Match(name, isNewlyRecorded: false);

    private static SaleAdvertisementProductMatch Match(string name, bool isNewlyRecorded) =>
        new(Guid.NewGuid(), name, RevenueAvgUsd: 15.4, QuantityTotal: 7, IsInteresting: true, isNewlyRecorded);
}
