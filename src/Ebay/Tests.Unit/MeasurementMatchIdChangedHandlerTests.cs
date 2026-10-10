using AwesomeAssertions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.MeasurementCaching;
using Server.Domain.Measurements;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementMatchIdChangedHandler))]
public sealed class MeasurementMatchIdChangedHandlerTests
{
    [Test]
    public async Task HandleAsync_InvalidatesTheMessagesMeasurementCache()
    {
        const string measurementId = "measurement-1";
        var cache = new InMemoryMeasurementContentCache();
        var handler = new MeasurementMatchIdChangedHandler(cache, new FakeMeasurementQueries([]));

        await handler.HandleAsync(new MeasurementMatchIdChanged(measurementId, null, "pair-1"), CancellationToken.None);

        cache.InvalidatedMeasurementIds.Should().Contain(measurementId);
    }

    [Test]
    [OpenSpecScenario("measurement-matching", "Cache invalidation follows lifecycle and pairing changes", "A pairing change invalidates the cache of the measurement and both its former and new pair partners")]
    public async Task HandleAsync_InvalidatesMeasurementsFromOldAndNewMatchGroups()
    {
        const string changedMeasurementId = "measurement-1";
        const string oldPairMeasurementId = "measurement-2";
        const string newPairMeasurementId = "measurement-3";
        var cache = new InMemoryMeasurementContentCache();
        var handler = new MeasurementMatchIdChangedHandler(
            cache,
            new FakeMeasurementQueries([oldPairMeasurementId, newPairMeasurementId]));

        await handler.HandleAsync(
            new MeasurementMatchIdChanged(changedMeasurementId, "old-pair", "new-pair"),
            CancellationToken.None);

        cache.InvalidatedMeasurementIds.Should().BeEquivalentTo([changedMeasurementId, oldPairMeasurementId, newPairMeasurementId]);
    }

    private sealed class FakeMeasurementQueries : IMeasurementQueries
    {
        private readonly IReadOnlyList<string> _measurementIdsByMatchIds;

        public FakeMeasurementQueries(IReadOnlyList<string> measurementIdsByMatchIds)
        {
            _measurementIdsByMatchIds = measurementIdsByMatchIds;
        }

        public Task<IReadOnlyList<string>> GetMeasurementIdsByMatchIds(
            IReadOnlySet<string> matchIds,
            CancellationToken cancellationToken) =>
            Task.FromResult(_measurementIdsByMatchIds);

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
