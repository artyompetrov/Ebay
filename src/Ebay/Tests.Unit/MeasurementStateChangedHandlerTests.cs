using AwesomeAssertions;
using Server.Application.MeasurementCaching;
using Server.Domain.Measurements;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementStateChangedHandler))]
public sealed class MeasurementStateChangedHandlerTests
{
    [Test]
    [OpenSpecScenario("measurement-matching", "Cache invalidation follows lifecycle and pairing changes", "A status change invalidates that measurement's cache")]
    public async Task HandleAsync_InvalidatesTheMessagesMeasurementCache()
    {
        const string measurementId = "measurement-1";
        var cache = new InMemoryMeasurementContentCache();
        var handler = new MeasurementStateChangedHandler(cache);

        await handler.HandleAsync(new MeasurementStateChanged(measurementId), CancellationToken.None);

        cache.InvalidatedMeasurementIds.Should().Equal(measurementId);
    }
}
