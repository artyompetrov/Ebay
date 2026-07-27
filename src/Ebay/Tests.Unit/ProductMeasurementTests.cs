using AwesomeAssertions;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ProductMeasurement))]
public sealed class ProductMeasurementTests
{
    [Test]
    public void MarkInventoryChecked_SetsLastInventoryCheckAt_ForUtcTime()
    {
        var measurement = CreateValidMeasurement();
        var checkedAt = new DateTimeOffset(2026, 7, 27, 12, 0, 0, TimeSpan.Zero);

        measurement.MarkInventoryChecked(checkedAt);

        measurement.LastInventoryCheckAt.Should().Be(checkedAt);
    }

    [Test]
    public void MarkInventoryChecked_ConvertsToUtc_ForNonUtcOffset()
    {
        var measurement = CreateValidMeasurement();
        var checkedAt = new DateTimeOffset(2026, 7, 27, 15, 0, 0, TimeSpan.FromHours(3));

        measurement.MarkInventoryChecked(checkedAt);

        measurement.LastInventoryCheckAt.Should().Be(checkedAt.ToUniversalTime());
        measurement.LastInventoryCheckAt!.Value.Offset.Should().Be(TimeSpan.Zero);
    }

    private static ProductMeasurement CreateValidMeasurement()
    {
        return ProductMeasurement.Create(
            id: "MEA1234",
            productId: Guid.NewGuid(),
            measurements: [1, 2, 3],
            manufactureCode: "2026-02",
            productState: ProductState.New,
            measurementFileParser: new StubMeasurementFileParser());
    }

    private sealed class StubMeasurementFileParser : IMeasurementFileParser
    {
        private const int MinIntervalsForValidMeasurement = 30;
        private const int MinSteppingVariablesForValidMeasurement = 9;

        public MeasurementFileParseResult Parse(byte[] measurements)
        {
            var anodeCurves = new TriodeAnodeCurves(pmaxWatt: 1, measurementPoints: []);

            return new MeasurementFileParseResult(
                FileCount: 2,
                MeasurementConfigTableParseResult: new MeasurementConfigTableParseResult(
                    AnodeCurves: anodeCurves,
                    SteppingVariableCount: MinSteppingVariablesForValidMeasurement,
                    NumberOfIntervals: MinIntervalsForValidMeasurement),
                HashAnodeCurves: "hash-anode-curves",
                HashAnodeCurvesConfig: "hash-anode-curves-config");
        }

        public Task<byte[]> ToPrettifiedZip(byte[] zipBytes, CancellationToken cancellationToken) => Task.FromResult(zipBytes);
    }
}
