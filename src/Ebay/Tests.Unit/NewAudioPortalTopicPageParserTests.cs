using AwesomeAssertions;
using Server.Adapters.Driven.NewAudioPortal;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(NewAudioPortalTopicPageParser))]
public sealed class NewAudioPortalTopicPageParserTests
{
    private const string Time = "2026-10-24T15:06:25Z";

    [Test]
    public void Parse_SavedTopicPage_ReadsTitlePostsAuthorsAndTimes()
    {
        var logger = new RecordingLogger<NewAudioPortalTopicPageParserTests>();

        var page = NewAudioPortalTopicPageParser.Parse(NewAudioPortalHtml.ReadFixture("topic-16745.html"), logger).AsT0;

        page.Title.Should().Be("ГМ-70 Медный Анод Новые Много");
        page.PageCount.Should().Be(1);
        page.Posts.Should().HaveCount(9);
        page.Posts[0].Author.Should().Be(new NewAudioPortalAuthor("3913", "brakoman"));
        page.Posts[0].Date.Should().Be(new DateTimeOffset(2026, 3, 18, 15, 11, 39, TimeSpan.Zero));
        page.Posts[0].Lines.Should().Contain(["Цена-8000р/шт", "В наличии 28шт"]);
        page.Posts[1].Author.Should().Be(new NewAudioPortalAuthor("3550", "Артём П"));
        logger.HasWarning.Should().BeFalse();
    }

    [Test]
    public void Parse_SavedFirstPageOfTwoPageTopic_ReadsPageCount()
    {
        var page = NewAudioPortalTopicPageParser.Parse(
            NewAudioPortalHtml.ReadFixture("topic-3642-page-1.html"),
            new RecordingLogger<NewAudioPortalTopicPageParserTests>()).AsT0;

        page.PageCount.Should().Be(2);
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Quotes and edit notices are excluded from posts", "Starter's reply quoting a buyer")]
    public void Parse_SavedPostQuotingBuyer_DropsQuotedText()
    {
        var page = NewAudioPortalTopicPageParser.Parse(
            NewAudioPortalHtml.ReadFixture("topic-16745.html"),
            new RecordingLogger<NewAudioPortalTopicPageParserTests>()).AsT0;

        // Ответ продавца на сообщение DOK72 с цитатой (comment 192747).
        page.Posts[4].Lines.Should().Equal("Добрый день,не приходили уведомления-остаток 10 ламп,напишу вам в лс");
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Quotes and edit notices are excluded from posts", "Starter's reply quoting a buyer")]
    public void Parse_PostWithQuote_KeepsOnlyOwnText()
    {
        var html = NewAudioPortalHtml.TopicPage(
            "Лампы",
            1,
            NewAudioPortalHtml.Post(1, "3913", "brakoman", Time, NewAudioPortalHtml.Quote("DOK72", "Хочу приобрести остаток ламп.") + "<p>Остаток 10шт</p>"));

        var page = NewAudioPortalTopicPageParser.Parse(html, new RecordingLogger<NewAudioPortalTopicPageParserTests>()).AsT0;

        page.Posts.Should().ContainSingle().Which.Lines.Should().Equal("Остаток 10шт");
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Quotes and edit notices are excluded from posts", "Edit notice is not a line")]
    public void Parse_PostWithEditNotice_DropsNotice()
    {
        var html = NewAudioPortalHtml.TopicPage(
            "Лампы",
            1,
            NewAudioPortalHtml.Post(1, "3913", "brakoman", Time, "<p>6Н2П 10шт</p>" + NewAudioPortalHtml.EditNotice("Edited October 20 by brakoman")));

        var page = NewAudioPortalTopicPageParser.Parse(html, new RecordingLogger<NewAudioPortalTopicPageParserTests>()).AsT0;

        page.Posts.Should().ContainSingle().Which.Lines.Should().Equal("6Н2П 10шт");
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Advertisement lines come from the topic starter's posts", "Paragraphs and line breaks split lines")]
    public void Parse_CompactParagraphsAndLineBreaks_SplitIntoLines()
    {
        var html = NewAudioPortalHtml.TopicPage(
            "Лампы",
            1,
            NewAudioPortalHtml.Post(1, "3913", "brakoman", Time, "<p>6Н2П 10шт</p><p>6Н1П 5шт<br>6Н3П 2шт</p><p>&nbsp;</p>"));

        var page = NewAudioPortalTopicPageParser.Parse(html, new RecordingLogger<NewAudioPortalTopicPageParserTests>()).AsT0;

        page.Posts.Should().ContainSingle().Which.Lines.Should().Equal("6Н2П 10шт", "6Н1П 5шт", "6Н3П 2шт");
    }

    [Test]
    public void Parse_PostsOutsideCommentFeed_AreIgnored()
    {
        var html = NewAudioPortalHtml.TopicPage("Лампы", 1, NewAudioPortalHtml.Post(2, "3913", "brakoman", Time, "<p>own</p>"))
            .Replace(
                "<div data-role='recommendedComments'></div>",
                $"<div data-role='recommendedComments'>{NewAudioPortalHtml.Post(1, "3550", "buyer", Time, "<p>recommended</p>")}</div>",
                StringComparison.Ordinal);

        var page = NewAudioPortalTopicPageParser.Parse(html, new RecordingLogger<NewAudioPortalTopicPageParserTests>()).AsT0;

        page.Posts.Should().ContainSingle().Which.Lines.Should().Equal("own");
    }

    [Test]
    public void Parse_AuthorWithoutProfileLink_HasNoAuthor()
    {
        var html = NewAudioPortalHtml.TopicPage("Лампы", 1, NewAudioPortalHtml.Post(1, authorId: null, "Guest", Time, "<p>6Н2П</p>"));

        var page = NewAudioPortalTopicPageParser.Parse(html, new RecordingLogger<NewAudioPortalTopicPageParserTests>()).AsT0;

        page.Posts.Should().ContainSingle().Which.Author.Should().BeNull();
    }

    [Test]
    public void Parse_PostWithoutTime_IsSkippedWithWarning()
    {
        var logger = new RecordingLogger<NewAudioPortalTopicPageParserTests>();
        var html = NewAudioPortalHtml.TopicPage(
            "Лампы",
            1,
            NewAudioPortalHtml.Post(1, "3913", "brakoman", Time, "<p>first</p>"),
            NewAudioPortalHtml.Post(2, "3913", "brakoman", "not a time", "<p>second</p>"));

        var page = NewAudioPortalTopicPageParser.Parse(html, logger).AsT0;

        page.Posts.Should().ContainSingle().Which.Lines.Should().Equal("first");
        logger.HasWarning.Should().BeTrue();
    }

    [Test]
    public void Parse_OpeningPostWithoutTime_ReturnsErrorInsteadOfTakingReplyAsFirstPost()
    {
        var html = NewAudioPortalHtml.TopicPage(
            "Лампы",
            1,
            NewAudioPortalHtml.Post(1, "3913", "brakoman", "not a time", "<p>6Н2П</p>"),
            NewAudioPortalHtml.Post(2, "3550", "buyer", Time, "<p>беру</p>"));

        var result = NewAudioPortalTopicPageParser.Parse(html, new RecordingLogger<NewAudioPortalTopicPageParserTests>());

        result.IsT1.Should().BeTrue();
    }

    [Test]
    public void Parse_TableRowsAndCells_SplitIntoLines()
    {
        var html = NewAudioPortalHtml.TopicPage(
            "Лампы",
            1,
            NewAudioPortalHtml.Post(1, "3913", "brakoman", Time, "<table><tr><td>6Н2П</td><td>10шт</td></tr><tr><td>6Н1П</td><td>5шт</td></tr></table>"));

        var page = NewAudioPortalTopicPageParser.Parse(html, new RecordingLogger<NewAudioPortalTopicPageParserTests>()).AsT0;

        page.Posts.Should().ContainSingle().Which.Lines.Should().Equal("6Н2П", "10шт", "6Н1П", "5шт");
    }

    [Test]
    public void Parse_TitleWithWhitespaceRuns_IsCollapsed()
    {
        var html = NewAudioPortalHtml.TopicPage("Продам\n\t\t\tГМ-70   новые", 1, NewAudioPortalHtml.Post(1, "3913", "brakoman", Time, "<p>6Н2П</p>"));

        var page = NewAudioPortalTopicPageParser.Parse(html, new RecordingLogger<NewAudioPortalTopicPageParserTests>()).AsT0;

        page.Title.Should().Be("Продам ГМ-70 новые");
    }

    [Test]
    public void Parse_PageWithoutPosts_ReturnsError()
    {
        var result = NewAudioPortalTopicPageParser.Parse(
            "<html><body><h1 class='ipsType_pageTitle'>Лампы</h1></body></html>",
            new RecordingLogger<NewAudioPortalTopicPageParserTests>());

        result.IsT1.Should().BeTrue();
    }

    [Test]
    public void Parse_PageWithoutTitle_ReturnsError()
    {
        var html = NewAudioPortalHtml.TopicPage("Лампы", 1, NewAudioPortalHtml.Post(1, "3913", "brakoman", Time, "<p>6Н2П</p>"))
            .Replace("ipsType_pageTitle", "other", StringComparison.Ordinal);

        var result = NewAudioPortalTopicPageParser.Parse(html, new RecordingLogger<NewAudioPortalTopicPageParserTests>());

        result.IsT1.Should().BeTrue();
    }
}
