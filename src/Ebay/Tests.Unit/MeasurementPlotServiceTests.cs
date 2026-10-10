using System.Text.Json;
using AwesomeAssertions;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.MeasurementPlot;
using Server.Domain;
using Server.Domain.Measurements;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementPlotService))]
public sealed class MeasurementPlotServiceTests
{
    private const string MeasurementId = "measurement-1";
    private const string PairMeasurementId = "measurement-2";
    private const string PersistedPlot = "<svg>persisted plot</svg>";

    [Test]
    public async Task PlotForEbay_SellingOnly_ForSoldMeasurement_RendersStatusWithoutTouchingPersistentCache()
    {
        var context = new Context(MeasurementState.Sold);

        var result = await context.Service.PlotForEbay(MeasurementId, sellingOnly: true, CancellationToken.None);

        result.Should().Be(FakePlottingAdapter.StatusSvg(nameof(MeasurementState.Sold)));
        context.ContentCache.RequestedKeys.Should().Equal($"ebayPlotSellingOnly_{MeasurementId}");
        context.CacheStore.RequestedKeys.Should().BeEmpty();
    }

    [Test]
    public async Task PlotForEbay_SellingOnly_ForUnknownMeasurement_ReturnsNull()
    {
        var context = new Context(measurementState: null);

        var result = await context.Service.PlotForEbay(MeasurementId, sellingOnly: true, CancellationToken.None);

        result.Should().BeNull();
        context.CacheStore.RequestedKeys.Should().BeEmpty();
    }

    [Test]
    public async Task PlotForEbay_SellingOnly_ForSellingMeasurement_ServesPlotKeyedByLayoutAndMatchedPair()
    {
        var context = new Context(MeasurementState.Selling);

        var result = await context.Service.PlotForEbay(MeasurementId, sellingOnly: true, CancellationToken.None);

        const string expectedPlotKey = $"measurementPlot_False_True_525_400_True_{MeasurementId}_{PairMeasurementId}";
        result.Should().Be(PersistedPlot);
        context.CacheStore.RequestedKeys.Should().Equal(expectedPlotKey);
        context.ContentCache.RequestedKeys.Should().Equal(
            $"ebayPlotSellingOnly_{MeasurementId}",
            $"matchedPairMeasurementIds_{MeasurementId}",
            expectedPlotKey);
    }

    [Test]
    public async Task PlotForEbay_NotSellingOnly_SkipsStatusCheck_AndUsesSameKeyAsWarmup()
    {
        var context = new Context(MeasurementState.Sold);

        var result = await context.Service.PlotForEbay(MeasurementId, sellingOnly: false, CancellationToken.None);

        result.Should().Be(PersistedPlot);
        context.MeasurementQueries.GetMeasurementInfoCallCount.Should().Be(0);
        context.CacheStore.RequestedKeys.Should().Equal($"measurementPlot_False_True_525_400_True_{MeasurementId}_{PairMeasurementId}");
    }

    [Test]
    public async Task GetEbayTubeDescription_SellingOnly_ForSoldMeasurement_RendersStatus()
    {
        var context = new Context(MeasurementState.Sold);

        var result = await context.Service.GetEbayTubeDescription(MeasurementId, sellingOnly: true, CancellationToken.None);

        result.Should().Be(FakePlottingAdapter.StatusSvg(nameof(MeasurementState.Sold)));
        context.ContentCache.RequestedKeys.Should().Equal($"ebayTubeDescriptionSellingOnly_{MeasurementId}");
        context.CacheStore.RequestedKeys.Should().BeEmpty();
    }

    [Test]
    public async Task GetEbayTubeDescription_NotSellingOnly_IsKeyedByMeasurementAndMatchedPair()
    {
        var context = new Context(MeasurementState.Selling);

        await context.Service.GetEbayTubeDescription(MeasurementId, sellingOnly: false, CancellationToken.None);

        context.CacheStore.RequestedKeys.Should().Equal($"ebayTubeDescription_{MeasurementId}_{PairMeasurementId}");
    }

    [Test]
    public void PlotSold_RendersSoldStatus()
    {
        var context = new Context(MeasurementState.Sold);

        context.Service.PlotSold().Should().Be(FakePlottingAdapter.StatusSvg(nameof(MeasurementState.Sold)));
    }

    private sealed class Context
    {
        public Context(MeasurementState? measurementState)
        {
            MeasurementQueries = new FakeMeasurementQueries(measurementState);
            Service = new MeasurementPlotService(
                CacheStore,
                ContentCache,
                MeasurementQueries,
                new NotSupportedMeasurementFileParser(),
                new NotSupportedWatchedOnEbayPublisher(),
                new NotSupportedTubeWorkingPointQueries(),
                new FakePlottingAdapter());
        }

        public RecordingCacheStore CacheStore { get; } = new();

        public InMemoryMeasurementContentCache ContentCache { get; } = new();

        public FakeMeasurementQueries MeasurementQueries { get; }

        public MeasurementPlotService Service { get; }
    }

    /// <summary>
    /// Персистентный кеш, в котором уже лежит отрендеренное значение: фабрика не вызывается,
    /// поэтому тесты проверяют только выбор ключа, а не загрузку и разбор замера.
    /// </summary>
    private sealed class RecordingCacheStore : ICacheStore
    {
        public List<string> RequestedKeys { get; } = [];

        public Task<T?> GetOrCreateAsync<T>(
            string key,
            Func<Task<T?>> factory,
            TimeSpan ttl,
            CancellationToken cancellationToken,
            JsonSerializerOptions? jsonOptions = null)
        {
            RequestedKeys.Add(key);
            return Task.FromResult((T?)(object)PersistedPlot);
        }

        public Task RemoveOldVersionsAsync(CancellationToken cancellationToken) => throw new NotSupportedException();
    }

    private sealed class FakePlottingAdapter : IPlottingAdapter
    {
        public static string StatusSvg(string status) => $"<svg>{status}</svg>";

        public string RenderStatus(string status) => StatusSvg(status);

        public string RenderMeasurementPlot(MeasurementPlotRenderRequest request) => throw new NotSupportedException();

        public string RenderTubeInfo(TubeInfoRenderRequest request) => throw new NotSupportedException();
    }

    private sealed class FakeMeasurementQueries : IMeasurementQueries
    {
        private readonly MeasurementState? _measurementState;

        public FakeMeasurementQueries(MeasurementState? measurementState)
        {
            _measurementState = measurementState;
        }

        public int GetMeasurementInfoCallCount { get; private set; }

        public Task<MeasurementInfo?> GetMeasurementInfo(string measurementId, CancellationToken cancellationToken)
        {
            GetMeasurementInfoCallCount++;
            return Task.FromResult(_measurementState is { } state
                ? new MeasurementInfo(
                    measurementId,
                    Guid.NewGuid(),
                    MatchId: null,
                    LotId: null,
                    Location: null,
                    MeasurementState: state,
                    ProductState: ProductState.Used,
                    ManufactureCode: "code",
                    CreatedAt: DateTimeOffset.UnixEpoch,
                    LastTimeWatchedOnEbay: null)
                : null);
        }

        public Task<IReadOnlyList<string>> GetMeasurementPairMeasurements(string id, CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyList<string>>([PairMeasurementId]);

        public Task<IReadOnlyList<string>> GetAllMeasurementIds(CancellationToken cancellationToken) =>
            throw new NotSupportedException();

        public Task<IReadOnlyList<string>> GetMeasurementIdsByMatchIds(
            IReadOnlySet<string> matchIds,
            CancellationToken cancellationToken) =>
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

        public Task<IReadOnlySet<string?>> GetLotIds(Guid productId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class NotSupportedMeasurementFileParser : IMeasurementFileParser
    {
        public MeasurementFileParseResult Parse(byte[] measurements) => throw new NotSupportedException();

        public Task<byte[]> ToPrettifiedZip(byte[] zipBytes, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class NotSupportedWatchedOnEbayPublisher : IMeasurementWatchedOnEbayPublisher
    {
        public Task PublishAsync(string measurementId, DateTimeOffset watchedAtUtc, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }

    private sealed class NotSupportedTubeWorkingPointQueries : ITubeWorkingPointQueries
    {
        public Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken) =>
            throw new NotSupportedException();
    }
}
