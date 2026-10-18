using AwesomeAssertions;
using Server.Adapters.Driven.Qrz;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(QrzListingPageParser))]
public sealed class QrzListingPageParserTests
{
    private static readonly QrzListing Listing = new(
        Id: 470446,
        Link: new Uri("https://www.qrz.ru/classifieds/detail/gstrgigugm-tgi_470446"),
        Date: new DateTimeOffset(2026, 9, 22, 14, 3, 0, TimeSpan.FromHours(3)));

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Listing page content parsing", "Listing page yields title and lines")]
    public void TryParse_TitleAndDescription_ReturnsTitleFollowedByDescriptionLines()
    {
        var html = QrzHtml.ListingPage(
            "Продам гс,тр,ги,гу,гм.тги",
            "Иван Петров.",
            "/user/af7abbd4175636376db6b7c22d1809c8",
            "ТГИ2-400/16-32шт, по 8000р",
            "ГУ-108Б-10шт по 5000р");

        var advertisement = QrzListingPageParser.TryParse(html, Listing, new RecordingLogger<QrzListingPageParserTests>());

        advertisement.Should().NotBeNull();
        advertisement!.Title.Should().Be("Продам гс,тр,ги,гу,гм.тги");
        advertisement.Items.Should().Equal("Продам гс,тр,ги,гу,гм.тги", "ТГИ2-400/16-32шт, по 8000р", "ГУ-108Б-10шт по 5000р");
        advertisement.Link.Should().Be(Listing.Link);
        advertisement.Date.Should().Be(Listing.Date);
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Listing page seller parsing", "Listing page yields seller key and display name")]
    public void TryParse_AuthorWithMarker_ReturnsHashKeyAndCleanDisplayName()
    {
        var html = QrzHtml.ListingPage(
            "Лампы",
            "Евгений Смирнов (организация).",
            "/user/968d583acd6460911adbe0e9f5e97edb",
            "ГУ-50");

        var advertisement = QrzListingPageParser.TryParse(html, Listing, new RecordingLogger<QrzListingPageParserTests>());

        advertisement.Should().NotBeNull();
        advertisement!.SellerKey.Should().Be("968d583acd6460911adbe0e9f5e97edb");
        advertisement.SellerName.Should().Be("Евгений Смирнов");
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "Listing page seller parsing", "Listing page without an author link is skipped")]
    public void TryParse_NoAuthorLink_ReturnsNullWithWarning()
    {
        var logger = new RecordingLogger<QrzListingPageParserTests>();
        var html = QrzHtml.ListingPage("Лампы", author: null, profileHref: null, "ГУ-50");

        var advertisement = QrzListingPageParser.TryParse(html, Listing, logger);

        advertisement.Should().BeNull();
        logger.HasWarning.Should().BeTrue();
    }

    [Test]
    public void TryParse_RealListingPage_ReturnsSellerAndAllDescriptionLines()
    {
        var logger = new RecordingLogger<QrzListingPageParserTests>();

        var advertisement = QrzListingPageParser.TryParse(QrzHtml.ReadFixture("listing-470446.html"), Listing, logger);

        advertisement.Should().NotBeNull();
        advertisement!.Title.Should().Be("Продам гс,тр,ги,гу,гм.тги");
        advertisement.SellerKey.Should().Be("968d583acd6460911adbe0e9f5e97edb");
        advertisement.SellerName.Should().Be("Евгений Смирнов");
        advertisement.Items[0].Should().Be(advertisement.Title);
        advertisement.Items[1].Should().Be("ТГИ2-400/16-32шт, по 8000р");
        advertisement.Items[^1].Should().Be("СМ28/0, 05-1(медный цоколь)-10000шт по 15р");
        advertisement.Items.Should().NotContain(static x => x.Contains("Телефон", StringComparison.Ordinal));
        logger.HasWarning.Should().BeFalse();
    }

    [Test]
    public void GetProfileUri_ReturnsAbsoluteProfileUrl() =>
        QrzListingPageParser.GetProfileUri("af7abbd4175636376db6b7c22d1809c8")
            .Should().Be(new Uri("https://www.qrz.ru/user/af7abbd4175636376db6b7c22d1809c8"));
}
