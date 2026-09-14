using AwesomeAssertions;
using Server.Application.New.Caching;
using Server.Application.New.MeasurementCaching;
using Server.Domain.Measurements;
using Tests.Shared;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementStateChangedHandler))]
public sealed class MeasurementStateChangedHandlerTests
{
    [Test]
    [OpenSpecScenario("measurement-matching", "Cache invalidation follows lifecycle and pairing changes", "A status change invalidates that measurement's cache")]
    public async Task HandleAsync_InvalidatesTheMessagesMeasurementCacheToken()
    {
        const string measurementId = "measurement-1";
        var registry = new MeasurementCacheInvalidationRegistry();
        using var tokenBeforeHandling = registry.AcquireToken(measurementId);
        var handler = new MeasurementStateChangedHandler(registry);

        await handler.HandleAsync(new MeasurementStateChanged(measurementId), CancellationToken.None);

        tokenBeforeHandling.ChangeToken.HasChanged.Should().BeTrue();
    }
}
