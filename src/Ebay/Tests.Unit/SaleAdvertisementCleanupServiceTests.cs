using AwesomeAssertions;
using Server.Application;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.LotForSale;
using Server.Application.SaleAdvertisements;
using Server.Domain;
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

        public Task<ProductEmailSendHistory?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task AddAsync(IWriteModelUnitOfWork unitOfWork, ProductEmailSendHistory aggregate, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, Guid id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<Guid> id, CancellationToken cancellationToken) => throw new NotSupportedException();
    }
}
