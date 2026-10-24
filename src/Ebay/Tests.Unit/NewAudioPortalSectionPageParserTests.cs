using AwesomeAssertions;
using Server.Adapters.Driven.NewAudioPortal;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(NewAudioPortalSectionPageParser))]
public sealed class NewAudioPortalSectionPageParserTests
{
    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Section page parsing", "Topic row is parsed")]
    public void Parse_SavedSectionPage_ReadsTopicIdLinkAndLastPostTime()
    {
        var logger = new RecordingLogger<NewAudioPortalSectionPageParserTests>();

        var rows = NewAudioPortalSectionPageParser.Parse(NewAudioPortalHtml.ReadFixture("section-197.html"), logger).AsT0;

        rows.Should().HaveCount(25);
        rows.Should().ContainSingle(static x => x.Id == 18273).Which.Should().Be(new NewAudioPortalTopicRow(
            18273,
            new Uri("https://newaudioportal.com/topic/18273-%D1%80%D0%B0%D0%B4%D0%B8%D0%BE%D0%BB%D0%B0%D0%BC%D0%BF%D1%8B-siemens-e88cc/"),
            new DateTimeOffset(2026, 10, 24, 14, 35, 21, TimeSpan.Zero)));
        logger.HasWarning.Should().BeFalse();
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Section page parsing", "Malformed topic row is skipped")]
    public void Parse_RowWithoutLastPostTime_IsSkippedWithWarning()
    {
        var logger = new RecordingLogger<NewAudioPortalSectionPageParserTests>();
        var html = NewAudioPortalHtml.SectionPage(
            NewAudioPortalHtml.TopicRow(1, lastPost: null),
            NewAudioPortalHtml.TopicRow(2, lastPost: "2026-10-24T14:35:21Z"));

        var rows = NewAudioPortalSectionPageParser.Parse(html, logger).AsT0;

        rows.Should().ContainSingle().Which.Id.Should().Be(2);
        logger.HasWarning.Should().BeTrue();
    }

    [Test]
    public void Parse_RowWithoutTopicLink_IsSkippedWithWarning()
    {
        var logger = new RecordingLogger<NewAudioPortalSectionPageParserTests>();
        var html = NewAudioPortalHtml.SectionPage(
            NewAudioPortalHtml.TopicRow(1, "2026-10-24T14:35:21Z", href: "https://newaudioportal.com/profile/1-x/"),
            NewAudioPortalHtml.TopicRow(2, "2026-10-24T14:35:21Z"));

        var rows = NewAudioPortalSectionPageParser.Parse(html, logger).AsT0;

        rows.Should().ContainSingle().Which.Id.Should().Be(2);
        logger.HasWarning.Should().BeTrue();
    }

    [Test]
    public void Parse_RowWithUnparsableId_IsSkippedWithWarning()
    {
        var logger = new RecordingLogger<NewAudioPortalSectionPageParserTests>();
        var html = NewAudioPortalHtml.SectionPage(
            NewAudioPortalHtml.TopicRow(1, "2026-10-24T14:35:21Z").Replace("data-rowID='1'", "data-rowID='abc'", StringComparison.Ordinal),
            NewAudioPortalHtml.TopicRow(2, "2026-10-24T14:35:21Z"));

        var rows = NewAudioPortalSectionPageParser.Parse(html, logger).AsT0;

        rows.Should().ContainSingle().Which.Id.Should().Be(2);
        logger.HasWarningContaining("unparsable id").Should().BeTrue();
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "An unusable section page fails the collection", "Page without a topic list")]
    public void Parse_PageWithoutTopicList_ReturnsError()
    {
        var result = NewAudioPortalSectionPageParser.Parse(
            "<html><body><h1>Access denied</h1></body></html>",
            new RecordingLogger<NewAudioPortalSectionPageParserTests>());

        result.IsT1.Should().BeTrue();
    }

    [Test]
    public void Parse_EmptyTopicList_ReturnsNoRows()
    {
        var result = NewAudioPortalSectionPageParser.Parse(
            NewAudioPortalHtml.SectionPage(),
            new RecordingLogger<NewAudioPortalSectionPageParserTests>());

        result.AsT0.Should().BeEmpty();
    }
}
