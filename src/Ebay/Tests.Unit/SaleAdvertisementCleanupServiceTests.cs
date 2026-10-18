using AwesomeAssertions;
using Server.Application;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.LotForSale;
using Server.Application.SaleAdvertisements;
using Server.Domain;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(SaleAdvertisementCleanupService))]
public sealed class SaleAdvertisementCleanupServiceTests
{
    [Test]
    public async Task RemoveStaleAdvertisementsAsync_RemovesRecordsOlderThanRetentionPeriod()
    {
        var now = new DateTimeOffset(2026, 10, 10, 12, 0, 0, TimeSpan.Zero);
        var repository = new RecordingHistoryRepository();
        var unitOfWork = new StubUnitOfWork();
        var service = new SaleAdvertisementCleanupService(
            new SingleUnitOfWorkFactory(unitOfWork),
            repository,
            new FixedTimeProvider(now));

        await service.RemoveStaleAdvertisementsAsync(CancellationToken.None);

        repository.RemovedOlderThan.Should().Equal(now - WellKnown.SaleAdvertisements.RemoveAdvertisementAfter);
        repository.UnitsOfWork.Should().AllSatisfy(x => x.Should().BeSameAs(unitOfWork));
        unitOfWork.DisposeCallCount.Should().Be(1);
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Records expire two years after their latest advertisement date", "Record older than two years is removed")]
    public async Task RemoveStaleAdvertisementsAsync_RecordOlderThanTwoYears_FallsBelowThreshold()
    {
        var threshold = await RunCleanupAt(new DateTimeOffset(2026, 10, 18, 12, 0, 0, TimeSpan.Zero));

        new DateTimeOffset(2024, 10, 17, 12, 0, 0, TimeSpan.Zero).Should().BeBefore(threshold);
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Records expire two years after their latest advertisement date", "Record within two years is kept")]
    public async Task RemoveStaleAdvertisementsAsync_RecordWithinTwoYears_StaysAboveThreshold()
    {
        var threshold = await RunCleanupAt(new DateTimeOffset(2026, 10, 18, 12, 0, 0, TimeSpan.Zero));

        new DateTimeOffset(2026, 6, 20, 12, 0, 0, TimeSpan.Zero).Should().BeOnOrAfter(threshold);
        new DateTimeOffset(2024, 10, 19, 12, 0, 0, TimeSpan.Zero).Should().BeOnOrAfter(threshold, "the retention period is two years");
    }

    // The repository deletes records strictly older than the threshold (covered by the repository integration test).
    private static async Task<DateTimeOffset> RunCleanupAt(DateTimeOffset now)
    {
        var repository = new RecordingHistoryRepository();
        var service = new SaleAdvertisementCleanupService(
            new SingleUnitOfWorkFactory(new StubUnitOfWork()),
            repository,
            new FixedTimeProvider(now));

        await service.RemoveStaleAdvertisementsAsync(CancellationToken.None);

        return repository.RemovedOlderThan.Should().ContainSingle().Subject;
    }

    private sealed class FixedTimeProvider : ICurrentTimeProvider
    {
        public FixedTimeProvider(DateTimeOffset utcNow)
        {
            UtcNow = utcNow;
        }

        public DateTimeOffset UtcNow { get; }
    }

    private sealed class RecordingHistoryRepository : IProductEmailSendHistoryRepository
    {
        public List<DateTimeOffset> RemovedOlderThan { get; } = [];

        public List<IWriteModelUnitOfWork> UnitsOfWork { get; } = [];

        public Task RemoveOlderThanAsync(IWriteModelUnitOfWork unitOfWork, DateTimeOffset threshold, CancellationToken cancellationToken)
        {
            RemovedOlderThan.Add(threshold);
            UnitsOfWork.Add(unitOfWork);
            return Task.CompletedTask;
        }

        public Task<ProductEmailSendHistory?> FindAsync(
            IWriteModelUnitOfWork unitOfWork,
            Guid productId,
            string sellerKey,
            string marketplace,
            CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<ProductEmailSendHistory?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task AddAsync(IWriteModelUnitOfWork unitOfWork, ProductEmailSendHistory aggregate, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<Guid> id, CancellationToken cancellationToken) => throw new NotSupportedException();
    }
}
