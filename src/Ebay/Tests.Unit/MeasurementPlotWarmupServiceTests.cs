using System.Data;
using AwesomeAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.MeasurementPlot;
using Server.Domain;
using Server.Domain.Measurements;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementPlotWarmupService))]
public sealed class MeasurementPlotWarmupServiceTests
{
    private const string CommitEvent = "commit";

    [Test]
    public async Task PublishWarmupForAllMeasurementsAsync_PublishesOneCommandPerMeasurement_AndCommitsPerBatch()
    {
        const int measurementCount = MeasurementPlotWarmupService.CommitBatchSize * 2 + 1;
        var measurementIds = Enumerable.Range(0, measurementCount).Select(static i => $"measurement-{i}").ToArray();
        var events = new List<string>();
        var service = new MeasurementPlotWarmupService(
            NullLogger<MeasurementPlotWarmupService>.Instance,
            new StaticMeasurementQueries(measurementIds),
            new RecordingPublisher(events),
            new RecordingUnitOfWork(events));

        await service.PublishWarmupForAllMeasurementsAsync(CancellationToken.None);

        string[] expected =
        [
            .. measurementIds.Take(MeasurementPlotWarmupService.CommitBatchSize),
            CommitEvent,
            .. measurementIds.Skip(MeasurementPlotWarmupService.CommitBatchSize).Take(MeasurementPlotWarmupService.CommitBatchSize),
            CommitEvent,
            .. measurementIds.Skip(MeasurementPlotWarmupService.CommitBatchSize * 2),
            CommitEvent
        ];
        events.Should().Equal(expected);
    }

    private sealed class RecordingPublisher : IMeasurementPlotWarmupPublisher
    {
        private readonly List<string> _events;

        public RecordingPublisher(List<string> events)
        {
            _events = events;
        }

        public Task PublishAsync(string measurementId, CancellationToken cancellationToken)
        {
            _events.Add(measurementId);
            return Task.CompletedTask;
        }
    }

    private sealed class RecordingUnitOfWork : IWriteModelUnitOfWork
    {
        private readonly List<string> _events;

        public RecordingUnitOfWork(List<string> events)
        {
            _events = events;
        }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken)
        {
            _events.Add(CommitEvent);
            return Task.FromResult(1);
        }

        public Task<IUnitOfWorkTransaction> BeginTransactionAsync(
            CancellationToken cancellationToken,
            IsolationLevel isolationLevel = IsolationLevel.ReadCommitted) =>
            throw new NotSupportedException();
    }

    private sealed class StaticMeasurementQueries : IMeasurementQueries
    {
        private readonly IReadOnlyList<string> _measurementIds;

        public StaticMeasurementQueries(IReadOnlyList<string> measurementIds)
        {
            _measurementIds = measurementIds;
        }

        public Task<IReadOnlyList<string>> GetAllMeasurementIds(CancellationToken cancellationToken) =>
            Task.FromResult(_measurementIds);

        public Task<IReadOnlyList<string>> GetMeasurementIdsByMatchIds(
            IReadOnlySet<string> matchIds,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<MeasurementInfo?> GetMeasurementInfo(string measurementId, CancellationToken cancellationToken) =>
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

        public Task<MeasurementInfoWithData?> GetMeasurementInfoWithData(
            string measurementId,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<MeasurementInfoWithData>> GetMeasurementInfosWithData(
            IReadOnlyList<string> ids,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<double?> GetDoubleTriodeSectionRmse(string measurementId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<string>> GetMeasurementPairMeasurements(string id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlySet<string?>> GetLotIds(Guid productId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }
}
