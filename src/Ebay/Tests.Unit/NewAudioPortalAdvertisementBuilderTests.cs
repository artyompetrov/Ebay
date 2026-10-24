using System.Globalization;
using AwesomeAssertions;
using Server.Adapters.Driven.NewAudioPortal;
using Server.Application.Abstractions.Driven.Models;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(NewAudioPortalAdvertisementBuilder))]
public sealed class NewAudioPortalAdvertisementBuilderTests
{
    private static readonly NewAudioPortalAuthor Starter = new("3913", "brakoman");
    private static readonly NewAudioPortalAuthor Buyer = new("3550", "Артём П");

    private static readonly NewAudioPortalTopicRow Topic = new(
        16745,
        new Uri(NewAudioPortalHtml.TopicHref(16745)),
        new DateTimeOffset(2026, 10, 24, 15, 6, 25, TimeSpan.Zero));

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Advertisement lines come from the topic starter's posts", "Title, opening post and starter's reply become lines")]
    public void TryBuild_StarterAndBuyerPosts_TakesTitleAndStarterLinesOnly()
    {
        var page = Page(
            "ГМ-70 Медный Анод Новые Много",
            Post(Starter, "2026-03-18T15:11:39Z", "Цена-8000р/шт", "В наличии 28шт"),
            Post(Buyer, "2026-03-22T15:59:25Z", "возьму все оптом"),
            Post(Starter, "2026-03-23T16:14:59Z", "1 коробка-14шт продана"));

        var advertisement = Build(page);

        advertisement!.Items.Should().Equal("ГМ-70 Медный Анод Новые Много", "Цена-8000р/шт", "В наличии 28шт", "1 коробка-14шт продана");
        advertisement.Title.Should().Be("ГМ-70 Медный Анод Новые Много");
        advertisement.Link.Should().Be(Topic.Link);
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Advertisement lines come from the topic starter's posts", "Starter's posts on both read pages of a multi-page topic")]
    public void TryBuild_FirstAndLastPages_TakesStarterPostsFromBoth()
    {
        var first = Page(
            "Лампы",
            Post(Starter, "2026-01-01T00:00:00Z", "6С33С 4шт"),
            Post(Starter, "2026-01-02T00:00:00Z", "6Н2П 10шт"),
            Post(Buyer, "2026-01-03T00:00:00Z", "беру"));
        var last = Page("Лампы", Post(Buyer, "2026-05-01T00:00:00Z", "ещё есть?"), Post(Starter, "2026-05-02T00:00:00Z", "ГУ-50 2шт"));

        var advertisement = NewAudioPortalAdvertisementBuilder.TryBuild(Topic, [first, last], new RecordingLogger<NewAudioPortalAdvertisementBuilderTests>());

        advertisement!.Items.Should().Equal("Лампы", "6С33С 4шт", "6Н2П 10шт", "ГУ-50 2шт");
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Topic seller parsing", "Seller key and display name")]
    public void TryBuild_OpeningPostAuthor_IsSeller()
    {
        var advertisement = Build(Page("Лампы", Post(Starter, "2026-03-18T15:11:39Z", "6Н2П")));

        advertisement!.SellerKey.Should().Be("3913");
        advertisement.SellerName.Should().Be("brakoman");
    }

    [Test]
    public void TryBuild_StarterRenamed_IsMatchedByProfileId()
    {
        var advertisement = Build(Page(
            "Лампы",
            Post(Starter, "2026-03-18T15:11:39Z", "6Н2П"),
            Post(Starter with { Name = "brakoman2" }, "2026-03-19T15:11:39Z", "6Н1П")));

        advertisement!.Items.Should().Equal("Лампы", "6Н2П", "6Н1П");
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Topic seller parsing", "Topic without an author profile link is skipped")]
    public void TryBuild_OpeningPostWithoutAuthor_ReturnsNullWithWarning()
    {
        var logger = new RecordingLogger<NewAudioPortalAdvertisementBuilderTests>();

        var advertisement = NewAudioPortalAdvertisementBuilder.TryBuild(
            Topic,
            [Page("Лампы", Post(null, "2026-03-18T15:11:39Z", "6Н2П"))],
            logger);

        advertisement.Should().BeNull();
        logger.HasWarning.Should().BeTrue();
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Advertisement date is the topic starter's latest post", "Buyer's reply does not move the date")]
    public void TryBuild_BuyerRepliedLater_DateIsStartersLatestPost()
    {
        var advertisement = Build(Page(
            "Лампы",
            Post(Starter, "2026-03-18T15:11:39Z", "6Н2П"),
            Post(Starter, "2026-09-13T21:17:27Z", "Подниму"),
            Post(Buyer, "2026-10-24T15:06:25Z", "куплю что осталось")));

        advertisement!.Date.Should().Be(new DateTimeOffset(2026, 9, 13, 21, 17, 27, TimeSpan.Zero));
    }

    [Test]
    [OpenSpecScenario("newaudioportal-monitoring", "Advertisement date is the topic starter's latest post", "Starter has no post on the last page")]
    public void TryBuild_StarterHasNoPostOnLastPage_DateIsOpeningPost()
    {
        var first = Page("Лампы", Post(Starter, "2026-03-18T15:11:39Z", "6Н2П"), Post(Buyer, "2026-03-19T00:00:00Z", "беру"));
        var last = Page("Лампы", Post(Buyer, "2026-10-24T15:06:25Z", "ещё есть?"));

        var advertisement = NewAudioPortalAdvertisementBuilder.TryBuild(Topic, [first, last], new RecordingLogger<NewAudioPortalAdvertisementBuilderTests>());

        advertisement!.Date.Should().Be(new DateTimeOffset(2026, 3, 18, 15, 11, 39, TimeSpan.Zero));
    }

    private static SaleAdvertisement? Build(NewAudioPortalTopicPage page) =>
        NewAudioPortalAdvertisementBuilder.TryBuild(Topic, [page], new RecordingLogger<NewAudioPortalAdvertisementBuilderTests>());

    private static NewAudioPortalTopicPage Page(string title, params NewAudioPortalPost[] posts) => new(title, 1, posts);

    private static NewAudioPortalPost Post(NewAudioPortalAuthor? author, string time, params string[] lines) =>
        new(author, DateTimeOffset.Parse(time, CultureInfo.InvariantCulture), lines);
}
