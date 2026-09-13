using AwesomeAssertions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.New.Caching;
using Server.Application.New.MeasurementCaching;
using Server.Domain.Measurements;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementMatchIdChangedHandler))]
public sealed class MeasurementMatchIdChangedHandlerTests
{
    [Test]
    public async Task HandleAsync_InvalidatesTheMessagesMeasurementCacheToken()
    {
        const string measurementId = "measurement-1";
        var registry = new MeasurementCacheInvalidationRegistry();
        using var tokenBeforeHandling = registry.AcquireToken(measurementId);
        var handler = new MeasurementMatchIdChangedHandler(registry, new FakeMeasurementQueries([]));

        await handler.HandleAsync(new MeasurementMatchIdChanged(measurementId, null, "pair-1"), CancellationToken.None);

        tokenBeforeHandling.ChangeToken.HasChanged.Should().BeTrue();
    }

    [Test]
    public async Task HandleAsync_InvalidatesMeasurementsFromOldAndNewMatchGroups()
    {
        const string changedMeasurementId = "measurement-1";
        const string oldPairMeasurementId = "measurement-2";
        const string newPairMeasurementId = "measurement-3";
        var registry = new MeasurementCacheInvalidationRegistry();
        using var changedToken = registry.AcquireToken(changedMeasurementId);
        using var oldPairToken = registry.AcquireToken(oldPairMeasurementId);
        using var newPairToken = registry.AcquireToken(newPairMeasurementId);
        using var unrelatedToken = registry.AcquireToken("measurement-4");
        var handler = new MeasurementMatchIdChangedHandler(
            registry,
            new FakeMeasurementQueries([oldPairMeasurementId, newPairMeasurementId]));

        await handler.HandleAsync(
            new MeasurementMatchIdChanged(changedMeasurementId, "old-pair", "new-pair"),
            CancellationToken.None);

        using (Assert.EnterMultipleScope())
        {
            changedToken.ChangeToken.HasChanged.Should().BeTrue();
            oldPairToken.ChangeToken.HasChanged.Should().BeTrue();
            newPairToken.ChangeToken.HasChanged.Should().BeTrue();
            unrelatedToken.ChangeToken.HasChanged.Should().BeFalse();
        }
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
