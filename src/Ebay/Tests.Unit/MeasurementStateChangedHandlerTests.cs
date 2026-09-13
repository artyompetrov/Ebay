using AwesomeAssertions;
using Server.Application.New.Caching;
using Server.Application.New.MeasurementCaching;
using Server.Domain.Measurements;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementStateChangedHandler))]
public sealed class MeasurementStateChangedHandlerTests
{
    [Test]
    public async Task HandleAsync_InvalidatesTheMessagesMeasurementCacheToken()
    {
        const string measurementId = "measurement-1";
        var registry = new MeasurementCacheInvalidationRegistry();
        var tokenBeforeHandling = registry.GetToken(measurementId);
        var handler = new MeasurementStateChangedHandler(registry);

        await handler.HandleAsync(new MeasurementStateChanged(measurementId), CancellationToken.None);

        tokenBeforeHandling.HasChanged.Should().BeTrue();
    }
}
