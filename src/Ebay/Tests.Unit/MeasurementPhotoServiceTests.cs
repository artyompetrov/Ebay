using AwesomeAssertions;
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
        return new MeasurementPhotoService(
            measurementPhotoQueries: photoQueries,
            measurementPhotoRepository: new NotSupportedMeasurementPhotoRepository(),
            measurementQueries: new FakeMeasurementQueries(measurementState),
            photoThumbnailGenerator: new NotSupportedPhotoThumbnailGenerator(),
            writeModelUnitOfWork: new NotSupportedWriteModelUnitOfWork());
    }

    private sealed class FakeMeasurementQueries : IMeasurementQueries
    {
        private readonly MeasurementState? _measurementState;

        public FakeMeasurementQueries(MeasurementState? measurementState)
        {
            _measurementState = measurementState;
        }

        public Task<MeasurementInfo?> GetMeasurementInfo(string measurementId, CancellationToken cancellationToken)
        {
            if (_measurementState is not { } state)
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

        public Task<IReadOnlyCollection<MeasurementInfo>> GetMeasurementsInfo(
            Guid productId, IReadOnlyCollection<MeasurementState> measurementStates, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
            Guid productId, string? lotId, IReadOnlyCollection<ProductState> productStates,
            IReadOnlyCollection<MeasurementState> measurementStates, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
            Guid productId, IReadOnlyCollection<ProductState> productStates,
            IReadOnlyCollection<MeasurementState> measurementStates, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<MeasurementInfoWithData?> GetMeasurementInfoWithData(string measurementId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<MeasurementInfoWithData>> GetMeasurementInfosWithData(
            IReadOnlyList<string> ids, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<double?> GetDoubleTriodeSectionRmse(string measurementId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<string>> GetMeasurementPairMeasurements(string id, CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlySet<string?>> GetLotIds(Guid productId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
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
            throw new NotSupportedException();

        public Task<IReadOnlyList<MeasurementPhotoMetadata>> GetMetadataByMeasurementIds(
            IReadOnlyCollection<string> measurementIds, CancellationToken cancellationToken) =>
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
    }

    private sealed class NotSupportedWriteModelUnitOfWork : IWriteModelUnitOfWork
    {
        public Task<int> SaveChangesAsync(CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }
}
