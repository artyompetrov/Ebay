using AwesomeAssertions;
using Microsoft.Extensions.Caching.Memory;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.New;
using Server.Domain.Measurements;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementPhotoService))]
public sealed class MeasurementPhotoServiceTests
{
    private const string MeasurementId = "measurement-1";
    private static readonly Guid PhotoId = Guid.NewGuid();
    private static readonly byte[] RealContent = [1, 2, 3];
    private static readonly byte[] RealThumbnail = [4, 5, 6];
    private const string RealContentType = "image/heic";

    [Test]
    public async Task GetContentAsync_ReturnsRealPhoto_WhenMeasurementIsNotSold()
    {
        var photoQueries = new FakeMeasurementPhotoQueries(
            new MeasurementPhotoInfo(PhotoId, MeasurementId, "file.heic", RealContentType, 0, RealContent),
            RealThumbnail);
        var service = CreateService(MeasurementState.Selling, photoQueries);

        var result = await service.GetContentAsync(MeasurementId, PhotoId, CancellationToken.None);

        result.Should().Be(new MeasurementPhotoContent(RealContent, RealContentType));
        photoQueries.GetCallCount.Should().Be(1);
    }

    [Test]
    public async Task GetContentAsync_SecondCall_IsServedFromCache_WithoutQueryingPhotoStoreAgain()
    {
        var photoQueries = new FakeMeasurementPhotoQueries(
            new MeasurementPhotoInfo(PhotoId, MeasurementId, "file.heic", RealContentType, 0, RealContent),
            RealThumbnail);
        var service = CreateService(MeasurementState.Selling, photoQueries);

        await service.GetContentAsync(MeasurementId, PhotoId, CancellationToken.None);
        var second = await service.GetContentAsync(MeasurementId, PhotoId, CancellationToken.None);

        second.Should().Be(new MeasurementPhotoContent(RealContent, RealContentType));
        photoQueries.GetCallCount.Should().Be(1);
    }

    [Test]
    public async Task GetThumbnailContentAsync_SecondCall_IsServedFromCache_WithoutQueryingPhotoStoreAgain()
    {
        var photoQueries = new FakeMeasurementPhotoQueries(
            new MeasurementPhotoInfo(PhotoId, MeasurementId, "file.heic", RealContentType, 0, RealContent),
            RealThumbnail);
        var service = CreateService(MeasurementState.Selling, photoQueries);

        await service.GetThumbnailContentAsync(MeasurementId, PhotoId, CancellationToken.None);
        var second = await service.GetThumbnailContentAsync(MeasurementId, PhotoId, CancellationToken.None);

        second.Should().Be(new MeasurementPhotoContent(RealThumbnail, "image/jpeg"));
        photoQueries.GetThumbnailCallCount.Should().Be(1);
    }

    [Test]
    public async Task GetContentAsync_ReturnsPlaceholder_NotPreviouslyCachedRealBytes_AfterMeasurementIsSold()
    {
        var photoQueries = new FakeMeasurementPhotoQueries(
            new MeasurementPhotoInfo(PhotoId, MeasurementId, "file.heic", RealContentType, 0, RealContent),
            RealThumbnail);
        var measurementQueries = new FakeMeasurementQueries(MeasurementState.Selling);
        var service = CreateService(measurementQueries, photoQueries, new MemoryCache(new MemoryCacheOptions()));

        var beforeSale = await service.GetContentAsync(MeasurementId, PhotoId, CancellationToken.None);
        beforeSale.Should().Be(new MeasurementPhotoContent(RealContent, RealContentType));

        measurementQueries.MeasurementState = MeasurementState.Sold;
        var afterSale = await service.GetContentAsync(MeasurementId, PhotoId, CancellationToken.None);

        afterSale.Should().NotBeNull();
        afterSale!.Content.Should().NotBeEquivalentTo(RealContent);
        afterSale.ContentType.Should().Be("image/png");
    }

    [Test]
    public async Task DeleteAsync_EvictsCachedContentAndThumbnail_SoASubsequentRequestQueriesAgain()
    {
        var photoQueries = new FakeMeasurementPhotoQueries(
            new MeasurementPhotoInfo(PhotoId, MeasurementId, "file.heic", RealContentType, 0, RealContent),
            RealThumbnail);
        var service = new MeasurementPhotoService(
            cache: new MemoryCache(new MemoryCacheOptions()),
            measurementPhotoQueries: photoQueries,
            measurementPhotoRepository: new CapturingMeasurementPhotoRepository(),
            measurementQueries: new FakeMeasurementQueries(MeasurementState.Selling),
            photoThumbnailGenerator: new NotSupportedPhotoThumbnailGenerator(),
            writeModelUnitOfWork: new NoOpWriteModelUnitOfWork());

        await service.GetContentAsync(MeasurementId, PhotoId, CancellationToken.None);
        photoQueries.GetCallCount.Should().Be(1);

        var deleted = await service.DeleteAsync(MeasurementId, PhotoId, CancellationToken.None);
        deleted.Should().BeTrue();
        var getCallCountAfterDelete = photoQueries.GetCallCount;

        await service.GetContentAsync(MeasurementId, PhotoId, CancellationToken.None);
        photoQueries.GetCallCount.Should().Be(getCallCountAfterDelete + 1);
    }

    [Test]
    public async Task UploadAsync_StoresBoundedOriginal_AndUnaffectedThumbnail()
    {
        var boundedOriginal = new byte[] { 9, 9, 9 };
        var thumbnailGenerator = new RecordingPhotoThumbnailGenerator(boundedOriginal, RealThumbnail);
        var repository = new CapturingMeasurementPhotoRepository();
        var service = new MeasurementPhotoService(
            cache: new MemoryCache(new MemoryCacheOptions()),
            measurementPhotoQueries: new FakeMeasurementPhotoQueries(null, null),
            measurementPhotoRepository: repository,
            measurementQueries: new FakeMeasurementQueries(MeasurementState.Created),
            photoThumbnailGenerator: thumbnailGenerator,
            writeModelUnitOfWork: new NoOpWriteModelUnitOfWork());

        var uploadedContent = new byte[] { 1, 2, 3, 4, 5 };
        var uploaded = await service.UploadAsync(
            measurementId: MeasurementId,
            fileName: "file.heic",
            contentType: RealContentType,
            content: uploadedContent,
            order: 0,
            cancellationToken: CancellationToken.None);

        uploaded.Should().BeTrue();
        repository.Added.Should().NotBeNull();
        repository.Added!.Content.Should().BeEquivalentTo(boundedOriginal);
        repository.Added.ThumbnailContent.Should().BeEquivalentTo(RealThumbnail);
        thumbnailGenerator.BoundedOriginalCallCount.Should().Be(1);
    }

    [Test]
    public async Task GetContentAsync_ReturnsPlaceholder_WithoutQueryingPhotoStore_WhenMeasurementIsSold()
    {
        var photoQueries = new FakeMeasurementPhotoQueries(
            new MeasurementPhotoInfo(PhotoId, MeasurementId, "file.heic", RealContentType, 0, RealContent),
            RealThumbnail);
        var service = CreateService(MeasurementState.Sold, photoQueries);

        var result = await service.GetContentAsync(MeasurementId, PhotoId, CancellationToken.None);

        result.Should().NotBeNull();
        result!.Content.Should().NotBeEquivalentTo(RealContent);
        result.ContentType.Should().Be("image/png");
        photoQueries.GetCallCount.Should().Be(0);
    }

    [Test]
    public async Task GetContentAsync_ReturnsNull_WhenMeasurementDoesNotExist()
    {
        var photoQueries = new FakeMeasurementPhotoQueries(null, null);
        var service = CreateService(measurementState: null, photoQueries);

        var result = await service.GetContentAsync(MeasurementId, PhotoId, CancellationToken.None);

        result.Should().BeNull();
    }

    [Test]
    public async Task GetThumbnailContentAsync_ReturnsRealThumbnail_WhenMeasurementIsNotSold()
    {
        var photoQueries = new FakeMeasurementPhotoQueries(
            new MeasurementPhotoInfo(PhotoId, MeasurementId, "file.heic", RealContentType, 0, RealContent),
            RealThumbnail);
        var service = CreateService(MeasurementState.Created, photoQueries);

        var result = await service.GetThumbnailContentAsync(MeasurementId, PhotoId, CancellationToken.None);

        result.Should().Be(new MeasurementPhotoContent(RealThumbnail, "image/jpeg"));
        photoQueries.GetThumbnailCallCount.Should().Be(1);
    }

    [Test]
    public async Task GetThumbnailContentAsync_ReturnsPlaceholder_WithoutQueryingPhotoStore_WhenMeasurementIsSold()
    {
        var photoQueries = new FakeMeasurementPhotoQueries(
            new MeasurementPhotoInfo(PhotoId, MeasurementId, "file.heic", RealContentType, 0, RealContent),
            RealThumbnail);
        var service = CreateService(MeasurementState.Sold, photoQueries);

        var result = await service.GetThumbnailContentAsync(MeasurementId, PhotoId, CancellationToken.None);

        result.Should().NotBeNull();
        result!.Content.Should().NotBeEquivalentTo(RealThumbnail);
        result.ContentType.Should().Be("image/png");
        photoQueries.GetThumbnailCallCount.Should().Be(0);
    }

    [Test]
    public async Task GetThumbnailContentAsync_ReturnsNull_WhenPhotoDoesNotExist()
    {
        var photoQueries = new FakeMeasurementPhotoQueries(null, null);
        var service = CreateService(MeasurementState.Selling, photoQueries);

        var result = await service.GetThumbnailContentAsync(MeasurementId, PhotoId, CancellationToken.None);

        result.Should().BeNull();
    }

    private static MeasurementPhotoService CreateService(
        MeasurementState? measurementState,
        FakeMeasurementPhotoQueries photoQueries)
    {
        return CreateService(new FakeMeasurementQueries(measurementState), photoQueries, new MemoryCache(new MemoryCacheOptions()));
    }

    private static MeasurementPhotoService CreateService(
        FakeMeasurementQueries measurementQueries,
        FakeMeasurementPhotoQueries photoQueries,
        IMemoryCache cache)
    {
        return new MeasurementPhotoService(
            cache: cache,
            measurementPhotoQueries: photoQueries,
            measurementPhotoRepository: new NotSupportedMeasurementPhotoRepository(),
            measurementQueries: measurementQueries,
            photoThumbnailGenerator: new NotSupportedPhotoThumbnailGenerator(),
            writeModelUnitOfWork: new NotSupportedWriteModelUnitOfWork());
    }

    private sealed class FakeMeasurementQueries : IMeasurementInfoQueries
    {
        public FakeMeasurementQueries(MeasurementState? measurementState)
        {
            MeasurementState = measurementState;
        }

        public MeasurementState? MeasurementState { get; set; }

        public Task<MeasurementInfo?> GetMeasurementInfo(string measurementId, CancellationToken cancellationToken)
        {
            if (MeasurementState is not { } state)
            {
                return Task.FromResult<MeasurementInfo?>(null);
            }

            return Task.FromResult<MeasurementInfo?>(new MeasurementInfo(
                measurementId,
                Guid.NewGuid(),
                MatchId: null,
                LotId: null,
                Location: null,
                MeasurementState: state,
                ProductState: ProductState.Used,
                ManufactureCode: "code",
                CreatedAt: DateTimeOffset.UtcNow,
                LastTimeWatchedOnEbay: null));
        }
    }

    private sealed class FakeMeasurementPhotoQueries : IMeasurementPhotoQueries
    {
        private readonly MeasurementPhotoInfo? _photo;
        private readonly byte[]? _thumbnail;

        public FakeMeasurementPhotoQueries(MeasurementPhotoInfo? photo, byte[]? thumbnail)
        {
            _photo = photo;
            _thumbnail = thumbnail;
        }

        public int GetCallCount { get; private set; }

        public int GetThumbnailCallCount { get; private set; }

        public Task<MeasurementPhotoInfo?> Get(string measurementId, Guid photoId, CancellationToken cancellationToken)
        {
            GetCallCount++;
            return Task.FromResult(_photo);
        }

        public Task<byte[]?> GetThumbnail(string measurementId, Guid photoId, CancellationToken cancellationToken)
        {
            GetThumbnailCallCount++;
            return Task.FromResult(_thumbnail);
        }

        public Task<int> GetNextOrder(string measurementId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<MeasurementPhotoInfo>> GetByMeasurementId(string measurementId, CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyList<MeasurementPhotoInfo>>(_photo == null ? [] : [_photo]);

        public Task<IReadOnlyList<MeasurementPhotoMetadata>> GetMetadataByMeasurementIds(
            IReadOnlyCollection<string> measurementIds, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<MeasurementPhotoInfo>> GetContentBatch(int skip, int take, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class NotSupportedMeasurementPhotoRepository : IMeasurementPhotoRepository
    {
        public Task<MeasurementPhoto?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task AddAsync(MeasurementPhoto aggregate, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task RemoveAsync(Guid id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task RemoveAsync(IReadOnlySet<Guid> id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class NotSupportedPhotoThumbnailGenerator : IPhotoThumbnailGenerator
    {
        public Task<byte[]> CreateThumbnailAsync(byte[] originalContent, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<byte[]> CreateBoundedOriginalAsync(byte[] originalContent, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class NotSupportedWriteModelUnitOfWork : IWriteModelUnitOfWork
    {
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class RecordingPhotoThumbnailGenerator : IPhotoThumbnailGenerator
    {
        private readonly byte[] _boundedOriginal;
        private readonly byte[] _thumbnail;

        public RecordingPhotoThumbnailGenerator(byte[] boundedOriginal, byte[] thumbnail)
        {
            _boundedOriginal = boundedOriginal;
            _thumbnail = thumbnail;
        }

        public int BoundedOriginalCallCount { get; private set; }

        public Task<byte[]> CreateThumbnailAsync(byte[] originalContent, CancellationToken cancellationToken) =>
            Task.FromResult(_thumbnail);

        public Task<byte[]> CreateBoundedOriginalAsync(byte[] originalContent, CancellationToken cancellationToken)
        {
            BoundedOriginalCallCount++;
            return Task.FromResult(_boundedOriginal);
        }
    }

    private sealed class CapturingMeasurementPhotoRepository : IMeasurementPhotoRepository
    {
        public MeasurementPhoto? Added { get; private set; }

        public Task<MeasurementPhoto?> GetByIdAsync(Guid id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task AddAsync(MeasurementPhoto aggregate, CancellationToken cancellationToken)
        {
            Added = aggregate;
            return Task.CompletedTask;
        }

        public Task RemoveAsync(Guid id, CancellationToken cancellationToken) => Task.CompletedTask;

        public Task RemoveAsync(IReadOnlySet<Guid> id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class NoOpWriteModelUnitOfWork : IWriteModelUnitOfWork
    {
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken) => Task.FromResult(0);
    }
}
