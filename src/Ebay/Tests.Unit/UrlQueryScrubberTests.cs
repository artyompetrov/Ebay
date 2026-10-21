using System.Diagnostics;
using AwesomeAssertions;
using Server.Platform.Tracing;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(UrlQueryScrubber))]
public sealed class UrlQueryScrubberTests
{
    [Test]
    public void OnEnd_RemovesUrlQueryAttribute()
    {
        using var scrubber = new UrlQueryScrubber();
        using var activity = new Activity("request");
        activity.SetTag(UrlQueryScrubber.UrlQueryAttribute, "token=Redacted");

        scrubber.OnEnd(activity);

        activity.GetTagItem(UrlQueryScrubber.UrlQueryAttribute).Should().BeNull();
    }

    [Test]
    public void OnEnd_StripsQueryFromFullUrl()
    {
        using var scrubber = new UrlQueryScrubber();
        using var activity = new Activity("request");
        activity.SetTag(UrlQueryScrubber.UrlFullAttribute, "https://example.com/path?code=Redacted&state=Redacted");

        scrubber.OnEnd(activity);

        activity.GetTagItem(UrlQueryScrubber.UrlFullAttribute).Should().Be("https://example.com/path");
    }

    [Test]
    public void OnEnd_FullUrlWithoutQuery_IsKept()
    {
        using var scrubber = new UrlQueryScrubber();
        using var activity = new Activity("request");
        activity.SetTag(UrlQueryScrubber.UrlFullAttribute, "https://example.com/path");

        scrubber.OnEnd(activity);

        activity.GetTagItem(UrlQueryScrubber.UrlFullAttribute).Should().Be("https://example.com/path");
    }
}
