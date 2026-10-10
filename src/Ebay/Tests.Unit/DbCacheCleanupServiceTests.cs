using System.Text.Json;
using AwesomeAssertions;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.DbCache;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(DbCacheCleanupService))]
public sealed class DbCacheCleanupServiceTests
{
    [Test]
    public async Task RemoveOldVersionsAsync_RemovesOldVersionsFromCacheStore()
    {
        var cacheStore = new RecordingCacheStore();
        var service = new DbCacheCleanupService(cacheStore);

        await service.RemoveOldVersionsAsync(CancellationToken.None);

        cacheStore.RemoveOldVersionsCallCount.Should().Be(1);
    }

    private sealed class RecordingCacheStore : ICacheStore
    {
        public int RemoveOldVersionsCallCount { get; private set; }

        public Task RemoveOldVersionsAsync(CancellationToken cancellationToken)
        {
            RemoveOldVersionsCallCount++;
            return Task.CompletedTask;
        }

        public Task<T?> GetOrCreateAsync<T>(
            string key,
            Func<Task<T?>> factory,
            TimeSpan ttl,
            CancellationToken cancellationToken,
            JsonSerializerOptions? jsonOptions = null) =>
            throw new NotSupportedException();
    }
}
