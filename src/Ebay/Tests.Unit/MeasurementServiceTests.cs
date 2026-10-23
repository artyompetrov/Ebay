using AwesomeAssertions;
using OneOf;
using Server.Application;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.Abstractions.Driving.Models;
using Server.Domain.Errors;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementService))]
public sealed class MeasurementServiceTests
{
    [Test]
    [OpenSpecScenario("measurement-matching", "Assigning or changing a measurement's match pairing", "Assigning a match id updates the pairing and notifies of the change")]
    public async Task UpdateMeasurementMatchId_ChangesMatchIdAndRaisesDomainEvent_WhenMatchIdActuallyChanges()
    {
        const string measurementId = "MEASUREMENT1";
        var measurement = CreateMeasurement(measurementId);
        var unitOfWork = new RecordingUnitOfWork();
        var service = CreateService(measurement, unitOfWork);

        await service.UpdateMeasurementMatchId(" pair-1 ", measurementId, CancellationToken.None);

        measurement.MatchId.Should().Be("pair-1");
        unitOfWork.SaveChangesCallCount.Should().Be(1);
        measurement.GetDomainEvents().Should().ContainSingle()
            .Which.Should().BeEquivalentTo(new MeasurementMatchIdChanged(measurementId, null, "pair-1"));
    }

    [Test]
    [OpenSpecScenario("measurement-matching", "Assigning or changing a measurement's match pairing", "Re-submitting the same normalized match id is a no-op")]
    public async Task UpdateMeasurementMatchId_DoesNotSaveOrRaiseEvent_WhenNormalizedMatchIdIsUnchanged()
    {
        const string measurementId = "MEASUREMENT1";
        var measurement = CreateMeasurement(measurementId);
        measurement.ChangeMatchId("pair-1");
        measurement.ClearDomainEvents();
        var unitOfWork = new RecordingUnitOfWork();
        var service = CreateService(measurement, unitOfWork);

        await service.UpdateMeasurementMatchId(" pair-1 ", measurementId, CancellationToken.None);

        unitOfWork.SaveChangesCallCount.Should().Be(0);
        measurement.GetDomainEvents().Should().BeEmpty();
    }

    [Test]
    public async Task UpdateMeasurementLocation_ReturnsNotFound_WhenMeasurementDoesNotExist()
    {
        var unitOfWork = new RecordingUnitOfWork();
        var service = CreateService(CreateMeasurement("MEASUREMENT1"), unitOfWork);

        var result = await service.UpdateMeasurementLocation("shelf", "UNKNOWN", CancellationToken.None);

        result.Value.Should().BeOfType<OneOf.Types.NotFound>();
        unitOfWork.SaveChangesCallCount.Should().Be(0);
    }

    [Test]
    public async Task UpdateMeasurementManufactureCode_ReturnsDomainErrorWithoutSaving_WhenCodeIsBlank()
    {
        const string measurementId = "MEASUREMENT1";
        var unitOfWork = new RecordingUnitOfWork();
        var service = CreateService(CreateMeasurement(measurementId), unitOfWork);

        var result = await service.UpdateMeasurementManufactureCode(" ", measurementId, CancellationToken.None);

        result.Value.Should().BeOfType<DomainError>();
        unitOfWork.SaveChangesCallCount.Should().Be(0);
    }

    private static MeasurementService CreateService(
        ProductMeasurement measurement,
        IWriteModelUnitOfWork unitOfWork)
    {
        return new MeasurementService(
            productMeasurementRepository: new SingleMeasurementRepository(measurement),
            matchedPairDifferenceRepository: new NotSupportedMatchedPairDifferenceRepository(),
            measurementQueries: new NotSupportedMeasurementQueries(),
            measurementFileParser: new FakeMeasurementFileParser(),
            unitOfWorkFactory: new SingleUnitOfWorkFactory(unitOfWork));
    }

    private static ProductMeasurement CreateMeasurement(string measurementId)
    {
        return ProductMeasurement.Create(
            id: measurementId,
            productId: Guid.NewGuid(),
            measurements: [],
            manufactureCode: "Test",
            productState: ProductState.New,
            measurementFileParser: new FakeMeasurementFileParser()).AsT0;
    }

    private sealed class SingleMeasurementRepository : IMeasurementRepository
    {
        private readonly ProductMeasurement _measurement;

        public SingleMeasurementRepository(ProductMeasurement measurement)
        {
            _measurement = measurement;
        }

        public Task<ProductMeasurement?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, string id, CancellationToken cancellationToken) =>
            Task.FromResult<ProductMeasurement?>(_measurement.Id == id ? _measurement : null);

        public Task AddAsync(IWriteModelUnitOfWork unitOfWork, ProductMeasurement aggregate, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, string id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<string> id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class NotSupportedMatchedPairDifferenceRepository : IMatchedPairDifferenceRepository
    {
        public Task<MatchedPairDifference?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, MatchedPairDifferenceId id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task AddAsync(IWriteModelUnitOfWork unitOfWork, MatchedPairDifference aggregate, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, MatchedPairDifferenceId id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<MatchedPairDifferenceId> id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task RemoveByMeasurementIds(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<string> measurementIds, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class NotSupportedMeasurementQueries : IMeasurementQueries
    {
        public Task<MeasurementInfo?> GetMeasurementInfo(string id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<string>> GetAllMeasurementIds(CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyCollection<MeasurementInfo>> GetMeasurementsInfo(
            Guid productId,
            IReadOnlyCollection<MeasurementState> measurementStates,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
            Guid productId,
            string? lotId,
            IReadOnlyCollection<ProductState> productStates,
            IReadOnlyCollection<MeasurementState> measurementStates,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
            Guid productId,
            IReadOnlyCollection<ProductState> productStates,
            IReadOnlyCollection<MeasurementState> measurementStates,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<MeasurementInfoWithData?> GetMeasurementInfoWithData(string measurementId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<MeasurementInfoWithData>> GetMeasurementInfosWithData(
            IReadOnlyList<string> ids,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<double?> GetDoubleTriodeSectionRmse(string measurementId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<string>> GetMeasurementPairMeasurements(string id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<string>> GetMeasurementIdsByMatchIds(
            IReadOnlySet<string> matchIds,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlySet<string?>> GetLotIds(Guid productId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
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
            throw new NotSupportedException();
    }

    private sealed class RecordingUnitOfWork : IWriteModelUnitOfWork
    {
        public ValueTask DisposeAsync() => ValueTask.CompletedTask;

        public int SaveChangesCallCount { get; private set; }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            SaveChangesCallCount++;
            return Task.FromResult(1);
        }

        public Task<IUnitOfWorkTransaction> BeginTransactionAsync(
            CancellationToken cancellationToken,
            System.Data.IsolationLevel isolationLevel = System.Data.IsolationLevel.ReadCommitted) =>
            throw new NotSupportedException();
    }
}
