using ScottPlot;
using ScottPlot.PlotStyles;
using Server.Application.Data.Models;
using Server.Application.Infrastructure;
using Server.Application.Services.Measurement;
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.MeasurementPlot;

public class MeasurementPlotService
{
    private readonly DbCache _cache;
    private readonly MeasurementService _measurementService;

    public MeasurementPlotService(
        DbCache cache,
        MeasurementService measurementService)
    {
        _cache = cache;
        _measurementService = measurementService;
    }

    /// <summary>
    /// Отдельный метод для Ebay требуется для возможности предварительного прогрева на старте
    /// иначе прогрев происходит при первом заходе покупателя после передеплоя
    /// </summary>
    public Task<string?> PlotForEbay(string measurementId, CancellationToken cancellationToken) =>
        PlotForMeasurementId(
            measurementId: measurementId,
            cancellationToken: cancellationToken,
            mergeVertical: false,
            legendVertical: true,
            addQuickTest: true,
            width: 550,
            height: 400,
            sellingOnly: true);

    public async Task<string?> PlotForMeasurementId(
        string measurementId,
        CancellationToken cancellationToken,
        bool mergeVertical,
        bool legendVertical,
        bool addQuickTest,
        int width,
        int height,
        bool sellingOnly
    )
    {
        if (sellingOnly)
        {
            var state = await _measurementService.GetMeasurementState(measurementId, cancellationToken);
            if (state == null)
                return null;

            if (state != MeasurementState.Selling)
                return StatusSvg(state.Value);
        }

        var cacheKey =
            $"measurementPlot_{mergeVertical}_{legendVertical}_{width}_{height}_{addQuickTest}_{measurementId}";

        return await _cache.GetOrCreateAsync(
            key: cacheKey,
            async () =>
            {
                var measurement = await _measurementService.GetMeasurement(
                    cancellationToken: cancellationToken,
                    measurementId);

                if (measurement == null)
                    return null;

                return CreateMergedPlot(
                    mergeVertical: mergeVertical,
                    legendVertical: legendVertical,
                    width: width,
                    height: height,
                    addQuickTest: addQuickTest,
                    measurement: measurement);
            },
            ttl: TimeSpan.FromDays(30 * 12),
            cancellationToken: cancellationToken
        );
    }

    private static string CreateMergedPlot(
        bool mergeVertical,
        bool legendVertical,
        int width,
        int height,
        bool addQuickTest,
        MeasurementData measurement)
    {
        var plot1 = CreatePlot(
            curves: measurement.AnodeCurves,
            legendVertical: legendVertical,
            width: width,
            height: height);

        var plot2 = CreatePlot(
            curves: measurement.GridCurves,
            legendVertical: legendVertical,
            width: width,
            height: height);

        var quickTestSvg = addQuickTest ? QuickTestSvg(measurement) : null;

        var result = SvgMerger.MergeSvgs(
            mergeVertical: mergeVertical,
            new SvgMerger.Svg(quickTestSvg, false),
            new SvgMerger.Svg(plot1, true),
            new SvgMerger.Svg(plot2, true));

        if (!measurement.AnodeCurves.HasValuesAbovePmax && !measurement.GridCurves.HasValuesAbovePmax)
        {
            result = SvgMerger.MergeSvgs(
                mergeVertical: true,
                new SvgMerger.Svg(result, true),
                new SvgMerger.Svg(NotEnoughTesterRangeSvg(measurement.AnodeCurves.PmaxWatt, measurement.GridCurves.PmaxWatt), true));
        }
        

        return result;
    }

    private static string CreatePlot(
        MeasurementTypeBase curves,
        bool legendVertical,
        int width,
        int height)
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
            scatter1.LinePattern = section1LinePattern;
            scatter1.MarkerShape = section1MarkerShape;
            scatter1.MarkerSize = markerSize;
            scatter1.LineWidth = lineWidth;

            legendItems.Add(
                new LegendItem
                {
                    LabelText = $"{curves.SteppingVariableName} = {curveSet.VSteppingValue:N0}",
                    LineColor = scatter1.Color,
                    LinePattern = LinePattern.Solid,
                    LineWidth = lineWidth
                });

            if (curveSet.I2 != null)
            {
                var scatter2 = plt.Add.Scatter(
                    curveSet.V.Zip(curveSet.I2)
                        .Select(x => new Coordinates(x: x.First, y: x.Second)).ToList());
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

        plt.Axes.SetLimits(bottom: 0, left: curves.MinX, top: curves.MaxY, right: curves.MaxX);
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



    
    private static string QuickTestSvg(MeasurementData measurement)
    {
        var lines = System.Security.SecurityElement
            .Escape(measurement.QuickTest)
            .Split('\n');
        var lineHight = 16;
        var tspans = string.Join("\n", values: lines.Skip(1).Select((line, i) =>
            $"""<tspan x="20" y="{lineHight + i * lineHight}">{line.Split('\t')[0]}</tspan>"""));

        var quickTestSvg = $"""
                            <svg width="180" height="{lineHight + lines.Length * lineHight}" xmlns="http://www.w3.org/2000/svg">
                                <text font-size="14" fill="black" xml:space="preserve" font-family="monospace">
                                    {tspans}
                                </text>
                            </svg>
                            """;
        return quickTestSvg;
    }

    private static string StatusSvg(MeasurementState state)
    {
        return $"""
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40">
    <text x="10" y="25" font-size="24" fill="black">{state}</text>
</svg>
""";
    }
}