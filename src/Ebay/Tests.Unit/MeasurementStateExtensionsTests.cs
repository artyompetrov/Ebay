using AwesomeAssertions;
using Server.Domain.Measurements;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementStateExtensions))]
public sealed class MeasurementStateExtensionsTests
{
    [TestCase(MeasurementState.Created, false)]
    [TestCase(MeasurementState.Selling, false)]
    [TestCase(MeasurementState.Sold, true)]
    public void IsHiddenFromPublicListing_ReturnsExpectedValue(MeasurementState state, bool expected)
    {
        state.IsHiddenFromPublicListing().Should().Be(expected);
    }
}
