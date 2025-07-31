using ScottPlot;
using ScottPlot.PlotStyles;
using Server.Application.Infrastructure;
using Server.Application.Services.Measurement;
using Server.Application.Data.Models;

namespace Server.Application.Services.MeasurementPlot;

public class MeasurementPlotService
{
    private readonly DbCache _cache;
    private readonly MeasurementService _measurementService;

    // Максимальное dI - чтобы отсечь некорректные изменения из-за compliance, в долях от максимального тока
    private const double IgnoreDI = -0.1;

    public MeasurementPlotService(
        DbCache cache,
        MeasurementService measurementService)
    {
        _cache = cache;
        _measurementService = measurementService;
    }

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
                var measurement = await _measurementService.GetMeasurements(
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
            config: measurement.AnodeCurvesConfig,
            legendVertical: legendVertical,
            width: width,
            height: height);

        var plot2 = CreatePlot(
            curves: measurement.GridCurves,
            config: measurement.GridCurvesConfig,
            legendVertical: legendVertical,
            width: width,
            height: height);

        var quickTestSvg = addQuickTest ? QuickTestSvg(measurement) : null;

        var result = SvgMerger.MergeSvgs(
            mergeVertical: mergeVertical,
            new SvgMerger.Svg(quickTestSvg, false),
            new SvgMerger.Svg(plot1, true),
            new SvgMerger.Svg(plot2, true));

        return result;
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
                            <svg width="200" height="{lineHight + lines.Length * lineHight}" xmlns="http://www.w3.org/2000/svg">
                                <text font-size="14" fill="black" xml:space="preserve" font-family="monospace">
                                    {tspans}
                                </text>
                            </svg>
                            """;
        return quickTestSvg;
    }

    private static string CreatePlot(
    MeasurementConfig config,
    IReadOnlyDictionary<int, MeasurementPoint[]> curves,
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


        switch (config.MeasurementType)
        {
            case MeasurementType.TriodeAnodeCurves:
                PlotTriodeAnodeCurves(
                    curves: curves,
                    config: config,
                    plotSecondCurve: false,
                    plot: plt,
                    legendItems: legendItems);
                break;
            case MeasurementType.TriodeGridCurves:
                PlotTriodeGridCurves(
                    curves: curves,
                    config: config,
                    plotSecondCurve: false,
                    plot: plt,
                    legendItems: legendItems);
                break;
            case MeasurementType.DoubleTriodeAnodeCurves:
                PlotTriodeAnodeCurves(
                    curves: curves,
                    config: config,
                    plotSecondCurve: true,
                    plot: plt,
                    legendItems: legendItems);
                break;
            case MeasurementType.DoubleTriodeGridCurves:
                PlotTriodeGridCurves(
                    curves: curves,
                    config: config,
                    plotSecondCurve: true,
                    plot: plt,
                    legendItems: legendItems);
                break;
            case MeasurementType.PentodeAnodeCurves:
                PlotPentodeAnodeCurves(
                    curves: curves,
                    config: config,
                    plot: plt,
                    legendItems: legendItems);
                break;
            case MeasurementType.PentodeScreenCurves:
                PlotPentodeScreenCurves(
                    curves: curves,
                    config: config,
                    plot: plt,
                    legendItems: legendItems);
                break;

            default:
                throw new ArgumentOutOfRangeException();
        }

        plt.Legend.ManualItems = legendItems;
        plt.Legend.ShadowColor = new Color(red: 0, green: 0, blue: 0, alpha: 0);

        plt.ShowLegend(legendVertical ? Edge.Right : Edge.Bottom);

        return plt.GetSvgXml(width: width, height: height);
    }

    private static void PlotTriodeAnodeCurves(
        MeasurementConfig config,
        IReadOnlyDictionary<int, MeasurementPoint[]> curves,
    bool plotSecondCurve,
    Plot plot,
    List<LegendItem> legendItems)
    {
        double PowerLimit(double v) => config.Pmax / v;

        var maxX = 0.0;
        var maxY = 0.0;

        var section1LinePattern = LinePattern.Solid;
        var section1MarkerShape = MarkerShape.FilledCircle;
        var section2LinePattern = LinePattern.Dotted;
        var section2MarkerShape = MarkerShape.OpenCircle;
        var lineWidth = 1;
        var markerSize = 5;

        foreach (var (i, values) in curves)
        {
            var maxI = values.Select(x => x.Ia).Union(values.Select(x => x.Is)).Max();

            var iaValues = values.TakeWhile(x => x.dIa / maxI > IgnoreDI).Select(x => (x.Va, x.Ia)).ToList();
            var isValues = values.TakeWhile(x => x.dIs / maxI > IgnoreDI).Select(x => (x.Va, x.Is)).ToList();

            var lineMaxX = values.Select(x => x.Va).Max();

            var iValues = iaValues
                .Select(x => (V: x.Va, I: x.Ia));
            if (plotSecondCurve)
            {
                iValues = iValues.Union(isValues.Select(x => (V: x.Va, I: x.Is)));
            }

            var lineMaxY = GetLineMaxY(iValues: iValues.ToList(), powerLimit: PowerLimit);

            if (lineMaxX > maxX)
            {
                maxX = lineMaxX;
            }

            if (lineMaxY > maxY)
            {
                maxY = lineMaxY;
            }

            var vg = values.Select(x => x.Vg).Average();

            var section1ValuesScatter = plot.Add.Scatter(
                iaValues
                    .Select(x => new Coordinates(x: x.Va, y: x.Ia)).ToList());
            section1ValuesScatter.LinePattern = section1LinePattern;
            section1ValuesScatter.MarkerShape = section1MarkerShape;
            section1ValuesScatter.MarkerSize = markerSize;
            section1ValuesScatter.LineWidth = lineWidth;

            if (plotSecondCurve)
            {
                var section2ValuesScatter = plot.Add.Scatter(
                    isValues
                        .Select(x => new Coordinates(x: x.Va, y: x.Is)).ToList());
                section2ValuesScatter.LinePattern = section2LinePattern;
                section2ValuesScatter.MarkerShape = section2MarkerShape;
                section2ValuesScatter.Color = section1ValuesScatter.Color;
                section2ValuesScatter.MarkerSize = markerSize;
                section2ValuesScatter.LineWidth = lineWidth;
            }

            legendItems.Add(
                new LegendItem
                {
                    LabelText = $"Vgrid = {vg:N0}",
                    LineColor = section1ValuesScatter.Color,
                    LinePattern = LinePattern.Solid,
                    LineWidth = lineWidth
                });
        }

        var func = plot.Add.Function(PowerLimit);
        func.MinX = 0.1;
        func.LineColor = new Color(255, 0, 0);
        func.LineWidth = 3;
        legendItems.Add(
            new LegendItem
            {
                LabelText = $"MaxP = {config.Pmax / 1000.0:F1}W",
                LineColor = func.LineColor,
                LineWidth = func.LineWidth,
            });

        legendItems.Add(
            new LegendItem
            {
                LabelText = "Section 1",
                LinePattern = section1LinePattern,
                MarkerShape = section1MarkerShape,
                MarkerSize = markerSize,
                LineWidth = lineWidth,
                MarkerFillColor = new Color(0, 0, 0)
            });

        if (plotSecondCurve)
        {
            legendItems.Add(
                new LegendItem
                {
                    LabelText = "Section 2",
                    LinePattern = section2LinePattern,
                    MarkerShape = section2MarkerShape,
                    MarkerSize = markerSize,
                    LineWidth = lineWidth,
                    MarkerFillColor = new Color(0, 0, 0)
                });
        }

        plot.Axes.SetLimits(bottom: 0, left: 0, top: maxY, right: maxX);
        plot.XLabel("Vanode (V)");
        plot.YLabel("I (mA)");
        plot.Title("Anode curves");
    }

    private static double GetLineMaxY(List<(double V, double I)> iValues, Func<double, double> powerLimit)
    {
        var lowerPmax = iValues.Where(x => powerLimit(x.V) > x.I).Select(x => x.I).Append(0.0)
            .Max();
        var abovePmaxValues = iValues.Where(x => powerLimit(x.V) < x.I).Select(x => x.I).ToList();

        var lineMaxY = abovePmaxValues.Count == 0 ? lowerPmax : Math.Max(lowerPmax, abovePmaxValues.Min());
        return lineMaxY;
    }

    private static void PlotTriodeGridCurves(
        MeasurementConfig config,
        IReadOnlyDictionary<int, MeasurementPoint[]> curves,
        bool plotSecondCurve,
        Plot plot,
        List<LegendItem> legendItems)
    {
        var section1LinePattern = LinePattern.Solid;
        var section1MarkerShape = MarkerShape.FilledCircle;
        var section2LinePattern = LinePattern.Dotted;
        var section2MarkerShape = MarkerShape.OpenCircle;
        var lineWidth = 1;
        var markerSize = 5;

        double PowerLimit(double v) => config.Pmax / v;

        var minX = 0.0;
        var maxY = 0.0;
        foreach (var (i, values) in curves)
        {
            var maxI = values.Select(x => x.Ia).Union(values.Select(x => x.Is)).Max();

            var iaValues = values.TakeWhile(x => x.dIa / maxI > IgnoreDI).Select(x => (x.Va, x.Vg, x.Ia)).ToList();
            var isValues = values.TakeWhile(x => x.dIs / maxI > IgnoreDI).Select(x => (x.Va, x.Vg, x.Is)).ToList();

            var lineMinX = values.Select(x => x.Vg).Min();

            var iValues = iaValues.Select(x => (V: x.Va, I: x.Ia));
            if (plotSecondCurve)
            {
                iValues = iValues.Union(isValues.Select(x => (V: x.Va, I: x.Is)));
            }

            var lineMaxY = GetLineMaxY(iValues: iValues.ToList(), powerLimit: PowerLimit);

            if (lineMinX < minX)
            {
                minX = lineMinX;
            }

            if (lineMaxY > maxY)
            {
                maxY = lineMaxY;
            }

            var va = values.Select(x => x.Va).Average();

            var section1ValuesScatter = plot.Add.Scatter(
                iaValues
                    .Select(x => new Coordinates(x: x.Vg, y: x.Ia)).ToList());
            section1ValuesScatter.LinePattern = section1LinePattern;
            section1ValuesScatter.MarkerShape = section1MarkerShape;
            section1ValuesScatter.MarkerSize = markerSize;
            section1ValuesScatter.LineWidth = lineWidth;

            if (plotSecondCurve)
            {
                var section2ValuesScatter = plot.Add.Scatter(
                    isValues
                        .Select(x => new Coordinates(x: x.Vg, y: x.Is)).ToList());
                section2ValuesScatter.LinePattern = section2LinePattern;
                section2ValuesScatter.MarkerShape = section2MarkerShape;
                section2ValuesScatter.Color = section1ValuesScatter.Color;
                section2ValuesScatter.MarkerSize = markerSize;
                section2ValuesScatter.LineWidth = lineWidth;
            }

            legendItems.Add(
                new LegendItem
                {
                    LabelText = $"Vanode = {va:N1}",
                    LineColor = section1ValuesScatter.Color,
                    LinePattern = LinePattern.Solid,
                    LineWidth = lineWidth
                });
        }

        legendItems.Add(
            new LegendItem
            {
                LabelText = "Section 1",
                LinePattern = section1LinePattern,
                MarkerShape = section1MarkerShape,
                MarkerSize = markerSize,
                LineWidth = lineWidth,
                MarkerFillColor = new Color(0, 0, 0)
            });

        if (plotSecondCurve)
        {
            legendItems.Add(
                new LegendItem
                {
                    LabelText = "Section 2",
                    LinePattern = section2LinePattern,
                    MarkerShape = section2MarkerShape,
                    MarkerSize = markerSize,
                    LineWidth = lineWidth,
                    MarkerFillColor = new Color(0, 0, 0)
                });
        }

        plot.Axes.SetLimits(bottom: 0, left: minX, top: maxY, right: 0);
        plot.XLabel("Vgrid (V)");
        plot.YLabel("Ianode (mA)");
        plot.Title("Grid curves");
    }

    private static void PlotPentodeAnodeCurves(
        MeasurementConfig config,
        IReadOnlyDictionary<int, MeasurementPoint[]> curves,
        Plot plot,
        List<LegendItem> legendItems)
    {
        double PowerLimit(double v) => config.Pmax / v;

        var maxX = 0.0;
        var maxY = 0.0;

        var section1LinePattern = LinePattern.Solid;
        var section1MarkerShape = MarkerShape.FilledCircle;
        var section2LinePattern = LinePattern.Dotted;
        var section2MarkerShape = MarkerShape.OpenCircle;
        var lineWidth = 1;
        var markerSize = 5;

        foreach (var (i, values) in curves)
        {
            var maxI = values.Select(x => x.Ia).Union(values.Select(x => x.Is)).Max();

            var iaValues = values.TakeWhile(x => x.dIa / maxI > IgnoreDI).Select(x => (x.Va, x.Ia)).ToList();
            var isValues = values.TakeWhile(x => x.dIs / maxI > IgnoreDI).Select(x => (x.Va, x.Is)).ToList();

            var lineMaxX = values.Select(x => x.Va).Max();
            var lineMaxY = GetLineMaxY(iValues: iaValues
                .Select(x => (V: x.Va, I: x.Ia)).Union(isValues.Select(x => (V: x.Va, I: x.Is))).ToList(), powerLimit: PowerLimit);

            if (lineMaxX > maxX)
            {
                maxX = lineMaxX;
            }

            if (lineMaxY > maxY)
            {
                maxY = lineMaxY;
            }

            var vg = values.Select(x => x.Vg).Average();

            var section1ValuesScatter = plot.Add.Scatter(
                iaValues
                    .Select(x => new Coordinates(x: x.Va, y: x.Ia)).ToList());
            section1ValuesScatter.LinePattern = section1LinePattern;
            section1ValuesScatter.MarkerShape = section1MarkerShape;
            section1ValuesScatter.MarkerSize = markerSize;
            section1ValuesScatter.LineWidth = lineWidth;

            var section2ValuesScatter = plot.Add.Scatter(
                isValues
                    .Select(x => new Coordinates(x: x.Va, y: x.Is)).ToList());
            section2ValuesScatter.LinePattern = section2LinePattern;
            section2ValuesScatter.MarkerShape = section2MarkerShape;
            section2ValuesScatter.Color = section1ValuesScatter.Color;
            section2ValuesScatter.MarkerSize = markerSize;
            section2ValuesScatter.LineWidth = lineWidth;

            legendItems.Add(
                new LegendItem
                {
                    LabelText = $"Vg = {vg:N0}",
                    LineColor = section1ValuesScatter.Color,
                    LinePattern = LinePattern.Solid,
                    LineWidth = lineWidth
                });
        }

        var func = plot.Add.Function(PowerLimit);
        func.MinX = 0.1;
        func.LineColor = new Color(255, 0, 0);
        func.LineWidth = 3;
        legendItems.Add(
            new LegendItem
            {
                LabelText = $"MaxP = {config.Pmax / 1000.0:F1}W",
                LineColor = func.LineColor,
                LineWidth = func.LineWidth,
            });


        legendItems.Add(
            new LegendItem
            {
                LabelText = "Ianode",
                LinePattern = section1LinePattern,
                MarkerShape = section1MarkerShape,
                MarkerSize = markerSize,
                LineWidth = lineWidth,
                MarkerFillColor = new Color(0, 0, 0)
            });

        legendItems.Add(
            new LegendItem
            {
                LabelText = "Iscreen",
                LinePattern = section2LinePattern,
                MarkerShape = section2MarkerShape,
                MarkerSize = markerSize,
                LineWidth = lineWidth,
                MarkerFillColor = new Color(0, 0, 0)
            });

        plot.Axes.SetLimits(bottom: 0, left: 0, top: maxY, right: maxX);
        plot.XLabel("Vanode (V)");
        plot.YLabel("I (mA)");
        plot.Title("Anode curves");
    }

    private static void PlotPentodeScreenCurves(
        MeasurementConfig config,
        IReadOnlyDictionary<int, MeasurementPoint[]> curves,
        Plot plot,
        List<LegendItem> legendItems)
    {
        var section1LinePattern = LinePattern.Solid;
        var section1MarkerShape = MarkerShape.FilledCircle;
        var section2LinePattern = LinePattern.Dotted;
        var section2MarkerShape = MarkerShape.OpenCircle;
        var lineWidth = 1;
        var markerSize = 5;

        double PowerLimit(double v) => config.Pmax / v;
        var maxX = 0.0;
        var maxY = 0.0;
        foreach (var (i, values) in curves)
        {
            var maxI = values.Select(x => x.Ia).Union(values.Select(x => x.Is)).Max();
            var iaValues = values.TakeWhile(x => x.dIa / maxI > IgnoreDI).Select(x => (x.Va, x.Vs, x.Ia)).ToList();
            var isValues = values.TakeWhile(x => x.dIs / maxI > IgnoreDI).Select(x => (x.Va, x.Vs, x.Is)).ToList();

            var lineMaxX = values.Select(x => x.Vs).Max();
            var lineMaxY = GetLineMaxY(iValues: iaValues
                .Select(x => (V: x.Va, I: x.Ia)).Union(isValues.Select(x => (V: x.Va, I: x.Is))).ToList(), powerLimit: PowerLimit);

            if (lineMaxX > maxX)
            {
                maxX = lineMaxX;
            }

            if (lineMaxY > maxY)
            {
                maxY = lineMaxY;
            }

            var va = values.Select(x => x.Va).Average();

            var section1ValuesScatter = plot.Add.Scatter(
                iaValues
                    .Select(x => new Coordinates(x: x.Vs, y: x.Ia)).ToList());
            section1ValuesScatter.LinePattern = section1LinePattern;
            section1ValuesScatter.MarkerShape = section1MarkerShape;
            section1ValuesScatter.MarkerSize = markerSize;
            section1ValuesScatter.LineWidth = lineWidth;

            var section2ValuesScatter = plot.Add.Scatter(
                isValues
                    .Select(x => new Coordinates(x: x.Vs, y: x.Is)).ToList());
            section2ValuesScatter.LinePattern = section2LinePattern;
            section2ValuesScatter.MarkerShape = section2MarkerShape;
            section2ValuesScatter.Color = section1ValuesScatter.Color;
            section2ValuesScatter.MarkerSize = markerSize;
            section2ValuesScatter.LineWidth = lineWidth;

            legendItems.Add(
                new LegendItem
                {
                    LabelText = $"Vanode = {va:N1}",
                    LineColor = section1ValuesScatter.Color,
                    LinePattern = LinePattern.Solid,
                    LineWidth = lineWidth
                });
        }

        legendItems.Add(
            new LegendItem
            {
                LabelText = "Ianode",
                LinePattern = section1LinePattern,
                MarkerShape = section1MarkerShape,
                MarkerSize = markerSize,
                LineWidth = lineWidth,
                MarkerFillColor = new Color(0, 0, 0)
            });

        legendItems.Add(
            new LegendItem
            {
                LabelText = "Iscreen",
                LinePattern = section2LinePattern,
                MarkerShape = section2MarkerShape,
                MarkerSize = markerSize,
                LineWidth = lineWidth,
                MarkerFillColor = new Color(0, 0, 0)
            });

        plot.Axes.SetLimits(bottom: 0, left: 0, top: maxY, right: maxX);
        plot.XLabel("Vscreen (V)");
        plot.YLabel("I (mA)");
        plot.Title("Screen curves");
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