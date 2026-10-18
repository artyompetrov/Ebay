using AwesomeAssertions;
using Server.Adapters.Driven.Qrz;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(QrzListPageParser))]
public sealed class QrzListPageParserTests
{
    private static readonly TimeSpan Moscow = TimeSpan.FromHours(3);

    // 2026-10-18 15:00 по Москве.
    private static readonly DateTimeOffset Now = new(2026, 10, 18, 12, 0, 0, TimeSpan.Zero);

    [Test]
    [OpenSpecScenario("qrz-monitoring", "List page parsing", "Absolute date is parsed as Moscow time")]
    public void Parse_AbsoluteDate_ReturnsIdLinkAndMoscowDate()
    {
        var html = QrzHtml.ListPage(QrzHtml.ListEntry("/classifieds/detail/radiolampy-6s19p-w_439891", "17.10.2026 06:36"));

        var listing = QrzListPageParser.Parse(html, Now, new RecordingLogger<QrzListPageParserTests>()).Should().ContainSingle().Subject;

        listing.Id.Should().Be(439891);
        listing.Link.Should().Be(new Uri("https://www.qrz.ru/classifieds/detail/radiolampy-6s19p-w_439891"));
        listing.Date.Should().Be(new DateTimeOffset(2026, 10, 17, 6, 36, 0, Moscow));
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "List page parsing", "Relative date is resolved against the current Moscow date")]
    public void Parse_TodayDate_ResolvesAgainstCurrentMoscowDate()
    {
        var html = QrzHtml.ListPage(QrzHtml.ListEntry("/classifieds/detail/a_1", "Сегодня 11:19"));

        var listing = QrzListPageParser.Parse(html, Now, new RecordingLogger<QrzListPageParserTests>()).Should().ContainSingle().Subject;

        listing.Date.Should().Be(new DateTimeOffset(2026, 10, 18, 11, 19, 0, Moscow));
    }

    [Test]
    public void Parse_YesterdayDateAfterMoscowMidnight_ResolvesToPreviousMoscowDay()
    {
        // 2026-10-18 22:30 UTC - уже 19 октября по Москве.
        var lateNow = new DateTimeOffset(2026, 10, 18, 22, 30, 0, TimeSpan.Zero);
        var html = QrzHtml.ListPage(QrzHtml.ListEntry("/classifieds/detail/a_1", "Вчера 23:50"));

        var listing = QrzListPageParser.Parse(html, lateNow, new RecordingLogger<QrzListPageParserTests>()).Should().ContainSingle().Subject;

        listing.Date.Should().Be(new DateTimeOffset(2026, 10, 18, 23, 50, 0, Moscow));
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "List page parsing", "Entry with an empty slug is still parsed")]
    public void Parse_EmptySlug_ReturnsId()
    {
        var html = QrzHtml.ListPage(QrzHtml.ListEntry("/classifieds/detail/_469874", "17.10.2026 06:36"));

        QrzListPageParser.Parse(html, Now, new RecordingLogger<QrzListPageParserTests>())
            .Should().ContainSingle().Which.Id.Should().Be(469874);
    }

    [Test]
    [OpenSpecScenario("qrz-monitoring", "List page parsing", "Malformed entry is skipped")]
    public void Parse_EntryWithUnparsableDate_IsSkippedWithWarning()
    {
        var logger = new RecordingLogger<QrzListPageParserTests>();
        var html = QrzHtml.ListPage(
            QrzHtml.ListEntry("/classifieds/detail/broken_1", "недавно"),
            QrzHtml.ListEntry("/classifieds/detail/good_2", "17.10.2026 06:36"));

        var listings = QrzListPageParser.Parse(html, Now, logger);

        listings.Should().ContainSingle().Which.Id.Should().Be(2);
        logger.HasWarning.Should().BeTrue();
    }

    [Test]
    public void Parse_RealCategoryPage_ReturnsAllEntriesWithoutWarnings()
    {
        var logger = new RecordingLogger<QrzListPageParserTests>();

        var listings = QrzListPageParser.Parse(QrzHtml.ReadFixture("list-tubes-sell.html"), Now, logger);

        listings.Should().HaveCount(50);
        listings.Select(static x => x.Id).Should().OnlyHaveUniqueItems().And.Contain(470446);
        logger.HasWarning.Should().BeFalse();
    }
}
