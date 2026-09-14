using AwesomeAssertions;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;
using Tests.Shared;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ProductMeasurement))]
public sealed class ProductMeasurementTests
{
    [Test]
    [OpenSpecScenario("measurement-matching", "Cache invalidation follows lifecycle and pairing changes", "A status change invalidates that measurement's cache")]
    public void ChangeState_RaisesMeasurementStateChanged_WhenStateActuallyChanges()
    {
        var measurement = CreateMeasurement();

        measurement.ChangeState(MeasurementState.Sold);

        measurement.MeasurementState.Should().Be(MeasurementState.Sold);
        measurement.GetDomainEvents().Should().ContainSingle()
            .Which.Should().BeEquivalentTo(new MeasurementStateChanged(measurement.Id));
    }

    [Test]
    public void ChangeState_DoesNotRaiseEvent_WhenStateIsUnchanged()
    {
        var measurement = CreateMeasurement();
        measurement.ClearDomainEvents();

        measurement.ChangeState(measurement.MeasurementState);

        measurement.GetDomainEvents().Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("measurement-matching", "Assigning or changing a measurement's match pairing", "Assigning a match id updates the pairing and notifies of the change")]
    public void ChangeMatchId_RaisesMeasurementMatchIdChanged_WhenNormalizedMatchIdActuallyChanges()
    {
        var measurement = CreateMeasurement();
        measurement.ClearDomainEvents();

        measurement.ChangeMatchId(" pair-1 ");

        measurement.MatchId.Should().Be("pair-1");
        measurement.GetDomainEvents().Should().ContainSingle()
            .Which.Should().BeEquivalentTo(new MeasurementMatchIdChanged(measurement.Id, null, "pair-1"));
    }

    [Test]
    [OpenSpecScenario("measurement-matching", "Assigning or changing a measurement's match pairing", "Re-submitting the same normalized match id is a no-op")]
    public void ChangeMatchId_DoesNotRaiseEvent_WhenNormalizedMatchIdIsUnchanged()
    {
        var measurement = CreateMeasurement();
        measurement.ChangeMatchId("pair-1");
        measurement.ClearDomainEvents();

        measurement.ChangeMatchId(" pair-1 ");

        measurement.GetDomainEvents().Should().BeEmpty();
    }

    private static ProductMeasurement CreateMeasurement()
    {
        return ProductMeasurement.Create(
            id: "TESTMEASUREMENT1",
            productId: Guid.NewGuid(),
            measurements: [],
            manufactureCode: "Test",
            productState: ProductState.New,
            measurementFileParser: new FakeMeasurementFileParser());
    }

    private sealed class FakeMeasurementFileParser : IMeasurementFileParser
    {
        public MeasurementFileParseResult Parse(byte[] measurements)
        {
            return new MeasurementFileParseResult(
                FileCount: 2,
                MeasurementConfigTableParseResult: new MeasurementConfigTableParseResult(
                    AnodeCurves: new TriodeAnodeCurves(pmaxWatt: 1.0, measurementPoints: new Dictionary<int, MeasurementPoint[]>()),
                    SteppingVariableCount: 9,
                    NumberOfIntervals: 30),
                HashAnodeCurves: "hash-anode-curves",
                HashAnodeCurvesConfig: "hash-anode-curves-config");
        }

        public Task<byte[]> ToPrettifiedZip(byte[] zipBytes, CancellationToken cancellationToken) =>
            throw new NotSupportedException("Not needed for this test.");
    }
}
