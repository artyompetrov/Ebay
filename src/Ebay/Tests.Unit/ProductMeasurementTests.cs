using AwesomeAssertions;
using OneOf;
using Server.Domain.Errors;
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

    [Test]
    public void Create_ReturnsParserError_WhenFileCannotBeParsed()
    {
        var parserError = new DomainError("broken archive");

        var result = ProductMeasurement.Create(
            id: "TESTMEASUREMENT1",
            productId: Guid.NewGuid(),
            measurements: [],
            manufactureCode: "Test",
            productState: ProductState.New,
            measurementFileParser: new FailingMeasurementFileParser(parserError));

        result.Value.Should().Be(parserError);
    }

    [Test]
    public void Create_ReturnsDomainError_WhenIdHasInvalidFormat()
    {
        var result = ProductMeasurement.Create(
            id: "lower-case",
            productId: Guid.NewGuid(),
            measurements: [],
            manufactureCode: "Test",
            productState: ProductState.New,
            measurementFileParser: new FakeMeasurementFileParser());

        result.Value.Should().BeOfType<DomainError>();
    }

    [Test]
    public void ChangeLocation_TrimsAndClearsBlank()
    {
        var measurement = CreateMeasurement();

        measurement.ChangeLocation(" shelf 1 ");
        var trimmed = measurement.Location;
        measurement.ChangeLocation(" ");

        trimmed.Should().Be("shelf 1");
        measurement.Location.Should().BeNull();
    }

    [Test]
    public void ChangeLocation_ReturnsDomainErrorAndKeepsLocation_WhenTooLong()
    {
        const int locationMaxLength = 200;
        var measurement = CreateMeasurement();
        measurement.ChangeLocation("shelf");

        var result = measurement.ChangeLocation(new string('x', locationMaxLength + 1));

        result.Value.Should().BeOfType<DomainError>();
        measurement.Location.Should().Be("shelf");
    }

    [Test]
    public void ChangeLotId_ReturnsDomainErrorAndKeepsLotId_WhenTooLong()
    {
        const int lotIdMaxLength = 100;
        var measurement = CreateMeasurement();

        var result = measurement.ChangeLotId(new string('x', lotIdMaxLength + 1));

        result.Value.Should().BeOfType<DomainError>();
        measurement.LotId.Should().BeNull();
    }

    [Test]
    public void ChangeMatchId_ReturnsDomainErrorWithoutEvent_WhenTooLong()
    {
        const int matchIdMaxLength = 100;
        var measurement = CreateMeasurement();
        measurement.ClearDomainEvents();

        var result = measurement.ChangeMatchId(new string('x', matchIdMaxLength + 1));

        result.Value.Should().BeOfType<DomainError>();
        measurement.MatchId.Should().BeNull();
        measurement.GetDomainEvents().Should().BeEmpty();
    }

    [Test]
    public void UpdateManufactureCode_ReturnsDomainErrorAndKeepsCode_WhenBlank()
    {
        var measurement = CreateMeasurement();

        var result = measurement.UpdateManufactureCode("  ");

        result.Value.Should().BeOfType<DomainError>();
        measurement.ManufactureCode.Should().Be("Test");
    }

    private static ProductMeasurement CreateMeasurement()
    {
        return ProductMeasurement.Create(
            id: "TESTMEASUREMENT1",
            productId: Guid.NewGuid(),
            measurements: [],
            manufactureCode: "Test",
            productState: ProductState.New,
            measurementFileParser: new FakeMeasurementFileParser()).AsT0;
    }

    private sealed class FakeMeasurementFileParser : IMeasurementFileParser
    {
        public OneOf<MeasurementFileParseResult, DomainError> Parse(byte[] measurements)
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

        public Task<OneOf<byte[], DomainError>> ToPrettifiedZip(byte[] zipBytes, CancellationToken cancellationToken) =>
            throw new NotSupportedException("Not needed for this test.");
    }

    private sealed class FailingMeasurementFileParser : IMeasurementFileParser
    {
        private readonly DomainError _error;

        public FailingMeasurementFileParser(DomainError error)
        {
            _error = error;
        }

        public OneOf<MeasurementFileParseResult, DomainError> Parse(byte[] measurements) => _error;

        public Task<OneOf<byte[], DomainError>> ToPrettifiedZip(byte[] zipBytes, CancellationToken cancellationToken) =>
            throw new NotSupportedException("Not needed for this test.");
    }
}
