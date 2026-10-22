using AwesomeAssertions;
using Server.Adapters.Driving.WebApi.Controllers;
using ApiMeasurementState = Server.Adapters.Driving.WebApi.Generated.MeasurementState;
using ApiProductState = Server.Adapters.Driving.WebApi.Generated.ProductState;
using DomainMeasurementState = Server.Domain.Measurements.MeasurementState;
using DomainProductState = Server.Domain.Measurements.ProductState;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ModelsExtensions))]
public sealed class ModelsExtensionsTests
{
    // C# enums accept any number, e.g. one deserialized from a client's integer or read from a database column.
    private const int UndefinedEnumValue = 42;

    [Test]
    public void MeasurementStateMappings_RoundTripEveryMember()
    {
        foreach (var state in Enum.GetValues<DomainMeasurementState>())
        {
            var apiState = state.ToApiMeasurementState();

            apiState.Should().NotBeNull();
            apiState.GetValueOrDefault().ToDbMeasurementState().Should().Be(state);
        }
    }

    [Test]
    public void ProductStateMappings_RoundTripEveryMember()
    {
        foreach (var state in Enum.GetValues<DomainProductState>())
        {
            var apiState = state.ToApiProductState();

            apiState.Should().NotBeNull();
            apiState.GetValueOrDefault().ToDbProductState().Should().Be(state);
        }
    }

    [Test]
    public void MeasurementStateMappings_ReturnNull_ForUndefinedValue()
    {
        ((DomainMeasurementState)UndefinedEnumValue).ToApiMeasurementState().Should().BeNull();
        ((ApiMeasurementState)UndefinedEnumValue).ToDbMeasurementState().Should().BeNull();
    }

    [Test]
    public void ProductStateMappings_ReturnNull_ForUndefinedValue()
    {
        ((DomainProductState)UndefinedEnumValue).ToApiProductState().Should().BeNull();
        ((ApiProductState)UndefinedEnumValue).ToDbProductState().Should().BeNull();
    }
}
