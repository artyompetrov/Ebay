using MassTransit;
using ScottPlot;
using ScottPlot.PlotStyles;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.Abstractions.Driving.Abstractions.Messages;
using Server.Application.Infrastructure;
using Server.Application.New.Services;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;
using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Application.Services.MeasurementPlot;

// todo генерация графиков по идее должна быть вынесена в адаптер
public class MeasurementPlotService : IMeasurementPlotService
{
    private readonly DbCache _cache;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IMeasurementFileParser _measurementFileParser;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ITubeWorkingPointQueries _workingPointQueries;
    private readonly MeasurementApproximationService _measurementApproximationService;
    private readonly IUnitOfWork _unitOfWork;

    public MeasurementPlotService(
        DbCache cache,
        IMeasurementQueries measurementQueries,
        IMeasurementFileParser measurementFileParser,
        IPublishEndpoint publishEndpoint,
        ITubeWorkingPointQueries workingPointQueries,
        MeasurementApproximationService measurementApproximationService,
        IUnitOfWork unitOfWork)
    {
        _cache = cache;
        _measurementQueries = measurementQueries;
        _measurementFileParser = measurementFileParser;
        _publishEndpoint = publishEndpoint;
        _workingPointQueries = workingPointQueries;
        _measurementApproximationService = measurementApproximationService;
        _unitOfWork = unitOfWork;
    }

    public string PlotSold() => StatusSvg(nameof(MeasurementState.Sold));

    public async Task<string?> PlotForEbayWithViewSource(
        string measurementId,
        string? lotId,
        bool sellingOnly,
        string? referer,
        string currentHost,
        CancellationToken cancellationToken)
    {
        var plotTask = await PlotForEbay(
            measurementId: measurementId,
            lotId: lotId,
            sellingOnly: sellingOnly,
            cancellationToken: cancellationToken);

        if (ShouldTrackEbayView(referer: referer, currentHost: currentHost))
        {
            await PublishWatchedOnEbayMessage(measurementId: measurementId, cancellationToken: cancellationToken);
        }

        return plotTask;
    }

    internal static bool ShouldTrackEbayView(string? referer, string currentHost)
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
        await _publishEndpoint.Publish(
            new MeasurementWatchedOnEbay(
                MeasurementId: measurementId,
                WatchedAtUtc: DateTimeOffset.UtcNow),
            cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Отдельный метод для Ebay требуется для возможности предварительного прогрева на старте
    /// иначе прогрев происходит при первом заходе покупателя после передеплоя
    /// </summary>
    public async Task<string?> PlotForEbay(
        string measurementId,
        string? lotId,
        bool sellingOnly,
        CancellationToken cancellationToken)
    {
        if (sellingOnly)
        {
            var info = await _measurementQueries.GetMeasurementInfo(measurementId, cancellationToken);
            if (info == null)
            {
                return null;
            }

            if (info.MeasurementState is not MeasurementState.Selling and not MeasurementState.Created)
            {
                return StatusSvg(info.MeasurementState.ToString());
            }
            /* todo после изменения lot id эта проверка стала работать неправильно
            if (lotId != info.LotId)
            {
                return StatusSvg("Listed in other lot");
            }
            */
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
        var matchedPairMeasurementsIds =
            await _measurementQueries.GetMeasurementPairMeasurements(measurementId, cancellationToken);

        var cacheKey =
            $"measurementPlot_{mergeVertical}_{legendVertical}_{width}_{height}_{addQuickTest}_{measurementId}_{string.Join(",", matchedPairMeasurementsIds)}";

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

                var result = _measurementFileParser.Parse(measurementInfo.Data);
                var anodeCurves = result.MeasurementConfigTableParseResult.AnodeCurves;
                var gridCurves = anodeCurves.ConvertToGridCurves();

                var quickTestData = addQuickTest ? await GetQuickTestData(cancellationToken: cancellationToken, measurementInfo: measurementInfo, anodeCurves: anodeCurves) : null;

                var minMaxCoordinates = await GetMinMaxCoordinates(
                    cancellationToken: cancellationToken,
                    anodeCurves: anodeCurves,
                    gridCurves: gridCurves,
                    matchedPairMeasurementsIds: matchedPairMeasurementsIds);

                return CreateMergedPlot(
                    mergeVertical: mergeVertical,
                    legendVertical: legendVertical,
                    width: width,
                    height: height,
                    quickTestData,
                    minMaxCoordinates: minMaxCoordinates,
                    anodeCurves: result.MeasurementConfigTableParseResult.AnodeCurves,
                    gridCurves: gridCurves);
            },
            ttl: TimeSpan.FromDays(30 * 12),
            cancellationToken: cancellationToken
        );
    }

    private async Task<QuickTestData?> GetQuickTestData(MeasurementInfoWithData measurementInfo,
        AnodeCurvesBase anodeCurves, CancellationToken cancellationToken)
    {
        var workingPointInfo = await _workingPointQueries.GetWorkingPointInfo(measurementInfo.ProductId, cancellationToken);
        if (workingPointInfo == null)
        {
            return null;
        }

        var model = _measurementApproximationService.GetModel(anodeCurves, x => x.I1, workingPointInfo);
        var i = model.IatWorkingPoint();

        double? i2 = null;
        if (anodeCurves is DoubleTriodeAnodeCurves doubleTriodeAnodeCurves)
        {
            var model2 = _measurementApproximationService.GetModel(doubleTriodeAnodeCurves, x => x.I2!, workingPointInfo);
            i2 = model2.IatWorkingPoint();
        }

        return new QuickTestData(Ua: workingPointInfo.AnodeVoltage, Ug: workingPointInfo.GridVoltage, Ia: i, Ia2: i2);
    }

    private record QuickTestData(double Ua, double Ug, double Ia, double? Ia2);

    private async Task<MinMaxCoordinates> GetMinMaxCoordinates(
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

            var pairAnodeCurves = _measurementFileParser.Parse(pair.Data)
                .MeasurementConfigTableParseResult.AnodeCurves;
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

        return new MinMaxCoordinates(
            AnodeCurvesMinX: anodeCurvesMinX,
            AnodeCurvesMaxX: anodeCurvesMaxX,
            AnodeCurvesMaxY: anodeCurvesMaxY,
            GridCurvesMinX: gridCurvesMinX,
            GridCurvesMaxX: gridCurvesMaxX);
    }

    private record MinMaxCoordinates(
        double AnodeCurvesMinX,
        double AnodeCurvesMaxX,
        double AnodeCurvesMaxY,
        double GridCurvesMinX,
        double GridCurvesMaxX);

    private static string CreateMergedPlot(
        bool mergeVertical,
        bool legendVertical,
        int width,
        int height,
        QuickTestData? quickTestData,
        MinMaxCoordinates minMaxCoordinates,
        AnodeCurvesBase anodeCurves,
        GridCurvesBase gridCurves)
    {
        var plot1 = CreatePlot(
            curves: anodeCurves,
            legendVertical: legendVertical,
            width: width,
            height: height,
            curvesMinX: minMaxCoordinates.AnodeCurvesMinX,
            curvesMaxX: minMaxCoordinates.AnodeCurvesMaxX,
            curvesMaxY: minMaxCoordinates.AnodeCurvesMaxY);

        var plot2 = CreatePlot(
            curves: gridCurves,
            legendVertical: legendVertical,
            width: width,
            height: height,
            curvesMinX: minMaxCoordinates.GridCurvesMinX,
            curvesMaxX: minMaxCoordinates.GridCurvesMaxX,
            curvesMaxY: minMaxCoordinates.AnodeCurvesMaxY /*используем анодный максимум, чтобы было симметрично*/);

        var quickTestSvg = quickTestData != null ? QuickTestSvg(quickTestData) : null;

        var result = SvgMerger.MergeSvgs(
            mergeVertical: mergeVertical,
            new SvgMerger.Svg(quickTestSvg, false),
            new SvgMerger.Svg(plot1, true),
            new SvgMerger.Svg(plot2, true));

        if (!anodeCurves.HasValuesAbovePmax && !gridCurves.HasValuesAbovePmax)
        {
            result = SvgMerger.MergeSvgs(
                mergeVertical: true,
                new SvgMerger.Svg(result, true),
                new SvgMerger.Svg(NotEnoughTesterRangeSvg(anodeCurves.PmaxWatt, gridCurves.PmaxWatt), true));
        }

        return result;
    }

    private static string CreatePlot(
        MeasurementTypeBase curves,
        bool legendVertical,
        int width,
        int height,
        double curvesMinX,
        double curvesMaxX,
        double curvesMaxY)
    {
        var plt = new Plot();
        plt.SetStyle(
            new Light
            {
                FigureBackgroundColor = new Color(red: 0, green: 0, blue: 0, alpha: 0),
                DataBackgroundColor = new Color(red: 0, green: 0, blue: 0, alpha: 0),
                LegendBackgroundColor = new Color(red: 0, green: 0, blue: 0, alpha: 0),
                LegendOutlineColor = new Color(red: 0, green: 0, blue: 0)
            });
        var legendItems = new List<LegendItem>();

        var section1LinePattern = LinePattern.Solid;
        var section1MarkerShape = MarkerShape.FilledCircle;
        var section2LinePattern = LinePattern.Dotted;
        var section2MarkerShape = MarkerShape.OpenCircle;
        var lineWidth = 1;
        var markerSize = 5;

        foreach (var curveSet in curves.CurveSets)
        {
            var scatter1 = plt.Add.Scatter(
                curveSet.V.Zip(curveSet.I1)
                    .Select(x => new Coordinates(x: x.First, y: x.Second)).ToList());
            scatter1.Smooth = true;
            scatter1.LinePattern = section1LinePattern;
            scatter1.MarkerShape = section1MarkerShape;
            scatter1.MarkerSize = markerSize;
            scatter1.LineWidth = lineWidth;

            legendItems.Add(
                new LegendItem
                {
                    LabelText = $"{curves.SteppingVariableName} = {curveSet.VSteppingValue:N1}",
                    LineColor = scatter1.Color,
                    LinePattern = LinePattern.Solid,
                    LineWidth = lineWidth
                });

            if (curveSet.I2 != null)
            {
                var scatter2 = plt.Add.Scatter(
                    curveSet.V.Zip(curveSet.I2)
                        .Select(x => new Coordinates(x: x.First, y: x.Second)).ToList());
                scatter2.Smooth = true;
                scatter2.LinePattern = section2LinePattern;
                scatter2.MarkerShape = section2MarkerShape;
                scatter2.Color = scatter1.Color;
                scatter2.MarkerSize = markerSize;
                scatter2.LineWidth = lineWidth;
            }
        }

        legendItems.Add(
            new LegendItem
            {
                LabelText = curves.Curve1Name,
                LinePattern = section1LinePattern,
                MarkerShape = section1MarkerShape,
                MarkerSize = markerSize,
                LineWidth = lineWidth,
                MarkerFillColor = new Color(0, 0, 0)
            });

        if (curves.Curve2Name != null)
        {
            legendItems.Add(
                new LegendItem
                {
                    LabelText = curves.Curve2Name,
                    LinePattern = section2LinePattern,
                    MarkerShape = section2MarkerShape,
                    MarkerSize = markerSize,
                    LineWidth = lineWidth,
                    MarkerFillColor = new Color(0, 0, 0)
                });
        }

        if (curves.PlotPmax)
        {
            var func = plt.Add.Function(curves.MaxI);
            func.MinX = 0.1;
            func.LineColor = new Color(255, 0, 0);
            func.LineWidth = 3;
            legendItems.Add(
                new LegendItem
                {
                    LabelText = $"MaxP = {curves.PmaxWatt:F1}W",
                    LineColor = func.LineColor,
                    LineWidth = func.LineWidth,
                });
        }

        plt.Axes.SetLimits(bottom: 0, left: curvesMinX, top: curvesMaxY, right: curvesMaxX);
        plt.XLabel(curves.XLabel);
        plt.YLabel(curves.YLabel);
        plt.Title(curves.CurveTitle);

        plt.Legend.ManualItems = legendItems;
        plt.Legend.ShadowColor = new Color(red: 0, green: 0, blue: 0, alpha: 0);

        plt.ShowLegend(legendVertical ? Edge.Right : Edge.Bottom);

        return plt.GetSvgXml(width: width, height: height);
    }

    private static string NotEnoughTesterRangeSvg(double pmaxWatt1, double pmaxWatt2)
    {
        var pmaxWatt = Math.Max(pmaxWatt1, pmaxWatt2);
        var quickTestSvg = $"""
                            <svg xmlns="http://www.w3.org/2000/svg" width="950" height="24">
                              <!-- маленький жёлтый треугольник -->
                              <polygon points="5,20 12,6 19,20" fill="yellow" stroke="black" stroke-width="1"/>
                              <!-- восклицательный знак -->
                              <text x="12" y="18" text-anchor="middle" font-size="12" font-family="monospace" fill="black">!</text>

                              <!-- весь текст в одну строку -->
                              <text x="28" y="17" font-size="12" font-family="monospace" fill="black">
                                uTracer 3+ range (Anode/Screen: 0..400V@600mA, Grid: 0..–50V) is not sufficient to cover full operating range of this high-power tube ({pmaxWatt:F1}W). That's why the maximum load line is not visible. But you can still evaluate tube health.
                              </text>
                            </svg>
                            """;
        return quickTestSvg;
    }

    private static string QuickTestSvg(QuickTestData quickTest)
    {
        var lineHight = 16;

        var lines = new List<string>
        {
            $"""<tspan x="10" y="{lineHight + 1 * lineHight}">Measurement point:</tspan>""",
            $"""<tspan x="10" font-weight="bold" y="{lineHight + 2 * lineHight}">Vanode: {quickTest.Ua:F0} V</tspan>""",
            $"""<tspan x="10" font-weight="bold" y="{lineHight + 3 * lineHight}">Vgrid: {quickTest.Ug:F1} V</tspan>""",
            "",
            $"""<tspan x="10" y="{lineHight + 5 * lineHight}">Anode current:</tspan>""",
            $"""<tspan x="10" fill="#8B2E2E" font-weight="bold" y="{lineHight + 6 * lineHight}">Ianode{(quickTest.Ia2.HasValue?"1":"")}: {quickTest.Ia:F1} mA</tspan>""",
        };

        if (quickTest.Ia2 != null)
        {
            lines.Add(
                $"""<tspan x="10" fill="#8B2E2E" font-weight="bold" y="{lineHight + 7 * lineHight}">Ianode2: {quickTest.Ia2.Value:F1} mA</tspan>""");
        }

        var tspans = string.Join("\n", values: lines);

        var quickTestSvg = $"""
                            <svg width="160" height="{lineHight + lines.Count * lineHight}" xmlns="http://www.w3.org/2000/svg">
                                <text font-size="14" fill="black" xml:space="preserve" font-family="monospace">
                                    {tspans}
                                </text>
                            </svg>
                            """;
        return quickTestSvg;
    }

    private static string StatusSvg(string text)
    {
        return $"""
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="30">
                    <text x="10" y="20" font-size="20" fill="black">{text}</text>
                </svg>
                """;
    }

    public async Task<string?> GetEbayTubeDescription(
        string measurementId,
        string? lotId,
        bool sellingOnly,
        CancellationToken cancellationToken)
    {
        if (sellingOnly)
        {
            var info = await _measurementQueries.GetMeasurementInfo(measurementId, cancellationToken);
            if (info == null)
            {
                return null;
            }

            if (info.MeasurementState is not MeasurementState.Selling and not MeasurementState.Created)
            {
                return StatusSvg(info.MeasurementState.ToString());
            }
            /* todo после изменения lotid эта проверка стала работать неправильно
            if (lotId != info.LotId)
            {
                return StatusSvg("Listed in other lot");
            }
            */
        }

        var matchedPairMeasurementsIds =
            await _measurementQueries.GetMeasurementPairMeasurements(measurementId, cancellationToken);

        var cacheKey =
            $"ebayTubeDescription_{measurementId}_{string.Join(",", matchedPairMeasurementsIds)}";

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

                return BuildTubeInfoSvg(
                    manufactureCode: measurementInfo.ManufactureCode,
                    productState: measurementInfo.ProductState,
                    doubleTriodeSectionRmse: biggestError
                );
            },
            ttl: TimeSpan.FromDays(30 * 12),
            cancellationToken: cancellationToken
        );
    }

    private static string BuildTubeInfoSvg(
        string manufactureCode,
        ProductState productState,
        double? doubleTriodeSectionRmse)
    {
        var manufactureCodeSplited = manufactureCode.Split(['_', ' '], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        string? badgeText = null;
        string? badgeSub = null;
        var badgeFill = "none";

        if (doubleTriodeSectionRmse is { } rmse)
        {
            switch (rmse)
            {
                case < 5:
                    badgeText = "EXCELLENT";
                    badgeSub = "(&lt; 5%)";
                    badgeFill = "#16a34a";
                    break;
                case < 10:
                    badgeText = "EXCELLENT";
                    badgeSub = "(&lt; 10%)";
                    badgeFill = "#16a34a";
                    break;
                case < 15:
                    badgeText = "GOOD";
                    badgeSub = "(&lt; 15%)";
                    badgeFill = "#16a34a";
                    break;
                case < 20:
                    badgeText = "GOOD";
                    badgeSub = "(&lt; 20%)";
                    badgeFill = "#16a34a";
                    break;
                case < 25:
                    badgeText = "GOOD";
                    badgeSub = "(&lt; 25%)";
                    badgeFill = "#16a34a";
                    break;
                case < 30:
                    badgeText = "DECENT";
                    badgeSub = "(&lt; 30%)";
                    badgeFill = "#16a34a";
                    break;
                default:
                    break;
            }
        }

        var svgHeight = badgeText is null ? 75 + manufactureCodeSplited.Length * 15 : 155 + manufactureCodeSplited.Length * 15;

        var yPosition = 65;
        var manufactureCodePart = string.Join("\n", manufactureCodeSplited.Select(x => $"<text x=\"5\" y=\"{yPosition += 15}\" class=\"important\">{x}</text>"));

        var badge = badgeText is null
            ? ""
            : $"""
                <rect x="0" y="{yPosition += 15}" width="80" height="70" rx="8" fill="{badgeFill}"/>
                <text x="5" y="{yPosition += 15}" class="badgeText">{badgeText}</text>
                <text x="5" y="{yPosition += 15}" class="badgeText">SECTION</text>
                <text x="5" y="{yPosition += 15}" class="badgeText">BALANCE!</text>
                <text x="5" y="{yPosition += 15}" class="badgeText">{badgeSub}</text>
               """;

        return $$"""
                  <svg xmlns="http://www.w3.org/2000/svg"
                       width="80" height="{{svgHeight}}" viewBox="0 0 80 {{svgHeight}}">
                    <defs>
                      <style>
                        .important     { font: 700 13px 'Segoe UI', sans-serif; fill: #0f172a; }
                        .label     { font: 600 13px 'Segoe UI', sans-serif; fill: #475569; }
                        .value     { font: 400 13px 'Consolas', monospace; fill:  #0f172a; }
                        .notImportant { font: 400 13px 'Segoe UI', sans-serif; fill: #0f172a; }
                        .badgeText { font: 700 13px 'Segoe UI', sans-serif; fill: #ffffff; }
                      </style>
                    </defs>
                    
                    <text x="5" y="20" class="label">State:</text>
                    <text x="5" y="35" class="important">{{productState}}</text>
                    
                    <text x="5" y="65" class="label">Date/code:</text>
                    {{manufactureCodePart}}
                    {{badge}}
                    </svg>
                  """;
    }
}