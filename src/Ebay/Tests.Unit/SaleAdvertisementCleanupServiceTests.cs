using AwesomeAssertions;
using Server.Application;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.LotForSale;
using Server.Application.SaleAdvertisements;
using Server.Domain;

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
        var service = new SaleAdvertisementCleanupService(repository, new FixedTimeProvider(now));

        await service.RemoveStaleAdvertisementsAsync(CancellationToken.None);

        repository.RemovedOlderThan.Should().Equal(now - WellKnown.SaleAdvertisements.RemoveAdvertisementAfter);
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

        public Task RemoveOlderThanAsync(DateTimeOffset threshold, CancellationToken cancellationToken)
        {
            RemovedOlderThan.Add(threshold);
            return Task.CompletedTask;
        }

        public Task<ProductEmailSendHistory?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task AddAsync(ProductEmailSendHistory aggregate, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task RemoveAsync(Guid id, CancellationToken cancellationToken) => throw new NotSupportedException();

        public Task RemoveAsync(IReadOnlySet<Guid> id, CancellationToken cancellationToken) => throw new NotSupportedException();
    }
}
