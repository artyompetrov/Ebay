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

        using var first = registry.AcquireToken(MeasurementId);
        using var second = registry.AcquireToken(MeasurementId);

        first.ChangeToken.HasChanged.Should().BeFalse();
        second.ChangeToken.HasChanged.Should().BeFalse();

        registry.Invalidate(MeasurementId);

        first.ChangeToken.HasChanged.Should().BeTrue();
        second.ChangeToken.HasChanged.Should().BeTrue();
    }

    [Test]
    public void Invalidate_ReplacesTokenWithAFreshNonCancelledOne()
    {
        var registry = new MeasurementCacheInvalidationRegistry();
        using var beforeInvalidation = registry.AcquireToken(MeasurementId);

        registry.Invalidate(MeasurementId);
        using var afterInvalidation = registry.AcquireToken(MeasurementId);

        beforeInvalidation.ChangeToken.HasChanged.Should().BeTrue();
        afterInvalidation.ChangeToken.HasChanged.Should().BeFalse();
    }

    [Test]
    public void Invalidate_ForUnknownMeasurement_DoesNotThrow()
    {
        var registry = new MeasurementCacheInvalidationRegistry();

        var act = () => registry.Invalidate("never-requested-measurement");

        act.Should().NotThrow();
    }

    [Test]
    public void LeaseDispose_RemovesTokenSource_WhenNoCacheEntryUsesIt()
    {
        var registry = new MeasurementCacheInvalidationRegistry();

        var lease = registry.AcquireToken(MeasurementId);
        registry.ActiveTokenSourceCount.Should().Be(1);

        lease.Dispose();

        registry.ActiveTokenSourceCount.Should().Be(0);
    }
}
