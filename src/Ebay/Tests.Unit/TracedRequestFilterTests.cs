using AwesomeAssertions;
using Microsoft.AspNetCore.Http;
using Server.Platform.Tracing;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(TracedRequestFilter))]
public sealed class TracedRequestFilterTests
{
    [TestCase("/api/health")]
    [TestCase("/api/health/")]
    [TestCase("/API/Health")]
    [TestCase("/_framework/blazor.webassembly.js")]
    [TestCase("/_content/Microsoft.AspNetCore.Identity.UI/css/site.css")]
    [TestCase("/.well-known/openid-configuration")]
    [TestCase("/favicon.ico")]
    [TestCase("/api/telemetry/v1/traces")]
    [TestCase("/api/telemetry/v1/logs")]
    [TestCase("/css/open-iconic/font/fonts/open-iconic.ttf")]
    [TestCase("/css/open-iconic/font/fonts/open-iconic.woff")]
    public void IsTraced_InfrastructureOrStaticPath_ReturnsFalse(string path)
    {
        TracedRequestFilter.IsTraced(new PathString(path)).Should().BeFalse();
    }

    [TestCase("/")]
    [TestCase("/api/ebay/v1/products")]
    [TestCase("/api/healthy")]
    [TestCase("/connect/token")]
    public void IsTraced_ApplicationPath_ReturnsTrue(string path)
    {
        TracedRequestFilter.IsTraced(new PathString(path)).Should().BeTrue();
    }
}
