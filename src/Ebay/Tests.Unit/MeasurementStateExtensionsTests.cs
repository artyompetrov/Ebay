using AwesomeAssertions;
using Server.Domain.Measurements;
using Tests.Shared;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementStateExtensions))]
public sealed class MeasurementStateExtensionsTests
{
    [TestCase(MeasurementState.Created, false)]
    [TestCase(MeasurementState.Selling, false)]
    [TestCase(MeasurementState.Sold, true)]
    [OpenSpecScenario("measurement-matching", "Sold measurements are excluded from public listing", "Sold measurements are hidden")]
    [OpenSpecScenario("measurement-matching", "Sold measurements are excluded from public listing", "Non-sold measurements are not hidden")]
    public void IsHiddenFromPublicListing_ReturnsExpectedValue(MeasurementState state, bool expected)
    {
        state.IsHiddenFromPublicListing().Should().Be(expected);
    }
}