using AwesomeAssertions;
using Server.Application.New.Caching;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementCacheInvalidationRegistry))]
public sealed class MeasurementCacheInvalidationRegistryTests
{
    private const string MeasurementId = "measurement-1";

    [Test]
    public void GetToken_ReturnsTokenFromSameSource_WhenCalledTwiceWithoutInvalidation()
    {
        var registry = new MeasurementCacheInvalidationRegistry();

        var first = registry.GetToken(MeasurementId);
        var second = registry.GetToken(MeasurementId);

        first.HasChanged.Should().BeFalse();
        second.HasChanged.Should().BeFalse();

        registry.Invalidate(MeasurementId);

        first.HasChanged.Should().BeTrue();
        second.HasChanged.Should().BeTrue();
    }

    [Test]
    public void Invalidate_ReplacesTokenWithAFreshNonCancelledOne()
    {
        var registry = new MeasurementCacheInvalidationRegistry();
        var beforeInvalidation = registry.GetToken(MeasurementId);

        registry.Invalidate(MeasurementId);
        var afterInvalidation = registry.GetToken(MeasurementId);

        beforeInvalidation.HasChanged.Should().BeTrue();
        afterInvalidation.HasChanged.Should().BeFalse();
    }

    [Test]
    public void Invalidate_ForUnknownMeasurement_DoesNotThrow()
    {
        var registry = new MeasurementCacheInvalidationRegistry();

        var act = () => registry.Invalidate("never-requested-measurement");

        act.Should().NotThrow();
    }
}
