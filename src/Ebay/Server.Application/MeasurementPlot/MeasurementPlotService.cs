using System.Diagnostics;
using System.Text;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;
using Server.Domain.Measurements.MeasurementTypes.Base;
using Server.Application.TubeWorkingPoints;
using Server.Domain.Measurements.Approximation;

namespace Server.Application.MeasurementPlot;

public class MeasurementPlotService
{
    private readonly ICacheStore _cache;
    private readonly IMeasurementContentCacheAdapter _contentCache;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IMeasurementFileParser _measurementFileParser;
    private readonly IMeasurementWatchedOnEbayPublisher _watchedOnEbayPublisher;
    private readonly ITubeWorkingPointQueries _workingPointQueries;
    private readonly IPlottingAdapter _plottingAdapter;

    public MeasurementPlotService(
        ICacheStore cache,
        IMeasurementContentCacheAdapter contentCache,
        IMeasurementQueries measurementQueries,
        IMeasurementFileParser measurementFileParser,
        IMeasurementWatchedOnEbayPublisher watchedOnEbayPublisher,
        ITubeWorkingPointQueries workingPointQueries,
        IPlottingAdapter plottingAdapter)
    {
        _cache = cache;
        _contentCache = contentCache;
        _measurementQueries = measurementQueries;
        _measurementFileParser = measurementFileParser;
        _watchedOnEbayPublisher = watchedOnEbayPublisher;
        _workingPointQueries = workingPointQueries;
        _plottingAdapter = plottingAdapter;
    }

    public string PlotSold() => _plottingAdapter.RenderStatus(nameof(MeasurementState.Sold));

    public async Task<string?> PlotForEbayWithViewSource(
        string measurementId,
        bool sellingOnly,
        string? referer,
        string currentHost,
        CancellationToken cancellationToken)
    {
        var plotTask = await PlotForEbay(
            measurementId: measurementId,
            sellingOnly: sellingOnly,
            cancellationToken: cancellationToken);

        if (ShouldTrackEbayView(referer: referer, currentHost: currentHost))
        {
            await PublishWatchedOnEbayMessage(measurementId: measurementId, cancellationToken: cancellationToken);
        }

        return plotTask;
    }

    private static bool ShouldTrackEbayView(string? referer, string currentHost)
    {
        if (string.IsNullOrWhiteSpace(referer))
        {
            return true;
        }

        if (!Uri.TryCreate(referer, UriKind.Absolute, out var refererUri))
        {
            return true;
        }

        return !string.Equals(refererUri.Host, currentHost, StringComparison.OrdinalIgnoreCase);
    }

    private async Task PublishWatchedOnEbayMessage(string measurementId, CancellationToken cancellationToken)
    {
        await _watchedOnEbayPublisher.PublishAsync(measurementId, DateTimeOffset.UtcNow, cancellationToken);
    }

    /// <summary>
    /// Отдельный метод для Ebay требуется для возможности предварительного прогрева на старте
    /// иначе прогрев происходит при первом заходе покупателя после передеплоя.
    /// Прогрев (см. <see cref="MeasurementPlotWarmupService"/>) всегда вызывает этот метод с
    /// <paramref name="sellingOnly"/> = false, поэтому идет напрямую в <see cref="PlotForMeasurementId"/> и
    /// греет DbCache/её собственный in-memory кеш, а не кеш ниже, специфичный для sellingOnly = true.
    /// </summary>
    public async Task<string?> PlotForEbay(
        string measurementId,
        bool sellingOnly,
        CancellationToken cancellationToken)
    {
        if (!sellingOnly)
        {
            return await PlotForMeasurementId(
                measurementId: measurementId,
                cancellationToken: cancellationToken,
                mergeVertical: false,
                legendVertical: true,
                addQuickTest: true,
                width: 525,
                height: 400);
        }

        return await _contentCache.GetOrCreateAsync(
            measurementId: measurementId,
            key: SellingOnlyPlotCacheKey(measurementId),
            factory: () => ResolveSellingOnlyPlotUncached(measurementId, cancellationToken),
            sizeSelector: static s => Encoding.UTF8.GetByteCount(s));
    }

    private async Task<string?> ResolveSellingOnlyPlotUncached(string measurementId, CancellationToken cancellationToken)
    {
        var info = await _measurementQueries.GetMeasurementInfo(measurementId, cancellationToken);
        if (info == null)
        {
            return null;
        }

        if (info.MeasurementState.IsHiddenFromPublicListing())
        {
            return _plottingAdapter.RenderStatus(info.MeasurementState.ToString());
        }

        return await PlotForMeasurementId(
            measurementId: measurementId,
            cancellationToken: cancellationToken,
            mergeVertical: false,
            legendVertical: true,
            addQuickTest: true,
            width: 525,
            height: 400);
    }

    private static string SellingOnlyPlotCacheKey(string measurementId) => $"ebayPlotSellingOnly_{measurementId}";

    public async Task<string?> PlotForMeasurementId(
        string measurementId,
        bool mergeVertical,
        bool legendVertical,
        bool addQuickTest,
        int width,
        int height,
        CancellationToken cancellationToken
    )
    {
        var matchedPairMeasurementsIds = await GetMatchedPairMeasurementIds(
            measurementId: measurementId,
            cancellationToken: cancellationToken);

        var cacheKey =
            $"measurementPlot_{mergeVertical}_{legendVertical}_{width}_{height}_{addQuickTest}_{measurementId}_{string.Join(",", matchedPairMeasurementsIds)}";

        return await _contentCache.GetOrCreateAsync(
            measurementId: measurementId,
            key: cacheKey,
            factory: () => PlotForMeasurementIdUncached(
                measurementId: measurementId,
                mergeVertical: mergeVertical,
                legendVertical: legendVertical,
                addQuickTest: addQuickTest,
                width: width,
                height: height,
                matchedPairMeasurementsIds: matchedPairMeasurementsIds,
                cacheKey: cacheKey,
                cancellationToken: cancellationToken),
            sizeSelector: static s => Encoding.UTF8.GetByteCount(s));
    }

    private async Task<string?> PlotForMeasurementIdUncached(
        string measurementId,
        bool mergeVertical,
        bool legendVertical,
        bool addQuickTest,
        int width,
        int height,
        IReadOnlyList<string> matchedPairMeasurementsIds,
        string cacheKey,
        CancellationToken cancellationToken)
    {
        return await _cache.GetOrCreateAsync(
            key: cacheKey,
            async () =>
            {
                var measurementInfo =
                    await _measurementQueries.GetMeasurementInfoWithData(measurementId, cancellationToken);

                if (measurementInfo == null)
                {
                    return null;
                }

                var result = ParseStored(measurementInfo.Id, measurementInfo.Data);

                var anodeCurves = result.MeasurementConfigTableParseResult.AnodeCurves;
                var gridCurves = anodeCurves.ConvertToGridCurves();

                var quickTestData = addQuickTest ? await GetQuickTestData(cancellationToken: cancellationToken, measurementInfo: measurementInfo, anodeCurves: anodeCurves) : null;

                var minMaxCoordinates = await GetMinMaxCoordinates(
                    cancellationToken: cancellationToken,
                    anodeCurves: anodeCurves,
                    gridCurves: gridCurves,
                    matchedPairMeasurementsIds: matchedPairMeasurementsIds);

                return _plottingAdapter.RenderMeasurementPlot(new MeasurementPlotRenderRequest(
                    AnodeCurves: anodeCurves,
                    GridCurves: gridCurves,
                    AxisRanges: minMaxCoordinates,
                    QuickTest: quickTestData,
                    Layout: new PlotLayout(
                        MergeVertical: mergeVertical,
                        LegendVertical: legendVertical,
                        Width: width,
                        Height: height)));
            },
            ttl: TimeSpan.FromDays(30 * 12),
            cancellationToken: cancellationToken
        );
    }

    private async Task<QuickTestValues?> GetQuickTestData(MeasurementInfoWithData measurementInfo,
        AnodeCurvesBase anodeCurves, CancellationToken cancellationToken)
    {
        var workingPointInfo = await _workingPointQueries.GetWorkingPointInfo(measurementInfo.ProductId, cancellationToken);
        if (workingPointInfo == null)
        {
            return null;
        }

        var model = AnodeCurveModelBuilder.Build(anodeCurves, x => x.I1, workingPointInfo.ToApproximationWorkingPoint());
        var i = model.IatWorkingPoint();
        var transconductance = CalculateTransconductance(model, workingPointInfo.GridVoltageHalfWidth);

        double? i2 = null;
        double? transconductance2 = null;
        if (anodeCurves is DoubleTriodeAnodeCurves doubleTriodeAnodeCurves)
        {
            var model2 = AnodeCurveModelBuilder.Build(doubleTriodeAnodeCurves, x => x.I2!, workingPointInfo.ToApproximationWorkingPoint());
            i2 = model2.IatWorkingPoint();
            transconductance2 = CalculateTransconductance(model2, workingPointInfo.GridVoltageHalfWidth);
        }

        return new QuickTestValues(
            Ua: workingPointInfo.AnodeVoltage,
            Ug: workingPointInfo.GridVoltage,
            Ia: i,
            Ia2: i2,
            Transconductance: transconductance,
            Transconductance2: transconductance2);
    }

    private static double CalculateTransconductance(AnodeCurveModel model, double gridVoltageHalfWidth)
    {
        var iaAtHigherGridVoltage = model.ApproximateAbsolute(anodeVoltage: 0, gridVoltage: 1);
        var iaAtLowerGridVoltage = model.ApproximateAbsolute(anodeVoltage: 0, gridVoltage: -1);
        var gridVoltageRange = gridVoltageHalfWidth * 2;

        if (gridVoltageRange <= 1e-9)
        {
            return 0;
        }

        return (iaAtHigherGridVoltage - iaAtLowerGridVoltage) / gridVoltageRange;
    }

    private async Task<PlotAxisRanges> GetMinMaxCoordinates(
        AnodeCurvesBase anodeCurves,
        GridCurvesBase gridCurves,
        IReadOnlyList<string> matchedPairMeasurementsIds,
        CancellationToken cancellationToken)
    {
        var anodeCurvesMinX = anodeCurves.MinX;
        var anodeCurvesMaxX = anodeCurves.MaxX;
        var anodeCurvesMaxY = anodeCurves.MaxY;

        var gridCurvesMinX = gridCurves.MinX;
        var gridCurvesMaxX = gridCurves.MaxX;
        var gridCurvesMaxY = gridCurves.MaxY;

        foreach (var matchedPairMeasurementsId in matchedPairMeasurementsIds)
        {
            var pair = await _measurementQueries.GetMeasurementInfoWithData(
                matchedPairMeasurementsId,
                cancellationToken);
            if (pair == null)
            {
                continue;
            }

            var pairAnodeCurves = ParseStored(pair.Id, pair.Data).MeasurementConfigTableParseResult.AnodeCurves;
            var pairGridCurves = pairAnodeCurves.ConvertToGridCurves();

            // Anode
            if (pairAnodeCurves.MinX < anodeCurvesMinX)
            {
                anodeCurvesMinX = pairAnodeCurves.MinX;
            }

            if (pairAnodeCurves.MaxX > anodeCurvesMaxX)
            {
                anodeCurvesMaxX = pairAnodeCurves.MaxX;
            }

            if (pairAnodeCurves.MaxY > anodeCurvesMaxY)
            {
                anodeCurvesMaxY = pairAnodeCurves.MaxY;
            }

            // Grid
            if (pairGridCurves.MinX < gridCurvesMinX)
            {
                gridCurvesMinX = pairGridCurves.MinX;
            }

            if (pairGridCurves.MaxX > gridCurvesMaxX)
            {
                gridCurvesMaxX = pairGridCurves.MaxX;
            }

            if (pairGridCurves.MaxY > gridCurvesMaxY)
            {
                gridCurvesMaxY = pairGridCurves.MaxY;
            }
        }

        return new PlotAxisRanges(
            AnodeCurvesMinX: anodeCurvesMinX,
            AnodeCurvesMaxX: anodeCurvesMaxX,
            AnodeCurvesMaxY: anodeCurvesMaxY,
            GridCurvesMinX: gridCurvesMinX,
            GridCurvesMaxX: gridCurvesMaxX);
    }

    public async Task<string?> GetEbayTubeDescription(
        string measurementId,
        bool sellingOnly,
        CancellationToken cancellationToken)
    {
        if (!sellingOnly)
        {
            return await GetEbayTubeDescriptionForMeasurementId(measurementId, cancellationToken);
        }

        return await _contentCache.GetOrCreateAsync(
            measurementId: measurementId,
            key: SellingOnlyTubeDescriptionCacheKey(measurementId),
            factory: () => ResolveSellingOnlyTubeDescriptionUncached(measurementId, cancellationToken),
            sizeSelector: static s => Encoding.UTF8.GetByteCount(s));
    }

    private async Task<string?> ResolveSellingOnlyTubeDescriptionUncached(string measurementId, CancellationToken cancellationToken)
    {
        var info = await _measurementQueries.GetMeasurementInfo(measurementId, cancellationToken);
        if (info == null)
        {
            return null;
        }

        if (info.MeasurementState.IsHiddenFromPublicListing())
        {
            return _plottingAdapter.RenderStatus(info.MeasurementState.ToString());
        }
        /* todo после изменения lotid эта проверка стала работать неправильно
        if (lotId != info.LotId)
        {
            return StatusSvg("Listed in other lot");
        }
        */

        return await GetEbayTubeDescriptionForMeasurementId(measurementId, cancellationToken);
    }

    private static string SellingOnlyTubeDescriptionCacheKey(string measurementId) => $"ebayTubeDescriptionSellingOnly_{measurementId}";

    private async Task<string?> GetEbayTubeDescriptionForMeasurementId(string measurementId, CancellationToken cancellationToken)
    {
        var matchedPairMeasurementsIds = await GetMatchedPairMeasurementIds(
            measurementId: measurementId,
            cancellationToken: cancellationToken);

        var cacheKey =
            $"ebayTubeDescription_{measurementId}_{string.Join(",", matchedPairMeasurementsIds)}";

        return await _contentCache.GetOrCreateAsync(
            measurementId: measurementId,
            key: cacheKey,
            factory: () => GetEbayTubeDescriptionUncached(
                measurementId: measurementId,
                matchedPairMeasurementsIds: matchedPairMeasurementsIds,
                cacheKey: cacheKey,
                cancellationToken: cancellationToken),
            sizeSelector: static s => Encoding.UTF8.GetByteCount(s));
    }

    private async Task<IReadOnlyList<string>> GetMatchedPairMeasurementIds(
        string measurementId,
        CancellationToken cancellationToken)
    {
        return await _contentCache.GetOrCreateAsync(
            measurementId: measurementId,
            key: MatchedPairMeasurementIdsCacheKey(measurementId),
            factory: async () => await _measurementQueries.GetMeasurementPairMeasurements(measurementId, cancellationToken),
            sizeSelector: static ids => ids.Count + ids.Sum(static id => Encoding.UTF8.GetByteCount(id)))
            ?? [];
    }

    private static string MatchedPairMeasurementIdsCacheKey(string measurementId) => $"matchedPairMeasurementIds_{measurementId}";

    private async Task<string?> GetEbayTubeDescriptionUncached(
        string measurementId,
        IReadOnlyList<string> matchedPairMeasurementsIds,
        string cacheKey,
        CancellationToken cancellationToken)
    {
        return await _cache.GetOrCreateAsync(
            key: cacheKey,
            async () =>
            {
                var measurementInfo =
                    await _measurementQueries.GetMeasurementInfo(measurementId, cancellationToken);

                if (measurementInfo == null)
                {
                    return null;
                }

                var biggestError =
                    await _measurementQueries.GetDoubleTriodeSectionRmse(measurementId, cancellationToken);

                if (biggestError != null)
                {
                    foreach (var id in matchedPairMeasurementsIds)
                    {
                        var matchPairError =
                            await _measurementQueries.GetDoubleTriodeSectionRmse(id, cancellationToken);

                        if (matchPairError > biggestError)
                        {
                            biggestError = matchPairError;
                        }
                    }
                }

                return _plottingAdapter.RenderTubeInfo(new TubeInfoRenderRequest(
                    ManufactureCode: measurementInfo.ManufactureCode,
                    ProductState: measurementInfo.ProductState,
                    DoubleTriodeSectionRmse: biggestError));
            },
            ttl: TimeSpan.FromDays(30 * 12),
            cancellationToken: cancellationToken
        );
    }

    // Stored measurements were validated by the same parser on upload.
    private MeasurementFileParseResult ParseStored(string measurementId, byte[] data) =>
        _measurementFileParser.Parse(data).Match(
            static parsed => parsed,
            error => throw new UnreachableException($"Stored measurement {measurementId} no longer parses: {error.Message}"));
}
