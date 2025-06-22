using System.IO.Compression;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScottPlot;
using ScottPlot.PlotStyles;
using Server.Data;
using Server.Infrastructure;

namespace Server.Controllers;

[ApiController]
[Route("/m/")]
public class MeasurementPageController : ControllerBase
{
    // Максимальное dI - чтобы отсечь некорректные изменения из-за compliance
    private const int IgnoreDI = -10;
    private readonly ApplicationDbContext _applicationContext;

    public MeasurementPageController(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    [HttpGet("{measurementId}/download")]
    public async Task<IActionResult> DownloadZip(string measurementId)
    {
        var zipBytes = await _applicationContext.ProductMeasurements
            .AsNoTracking()
            .Where(x => x.Id == measurementId)
            .Select(x => x.Measurements)
            .SingleOrDefaultAsync();

        if (zipBytes == null)
            return NotFound();

        if (!MeasurementHelper.ReadMeasurementFile(
                measurementData: zipBytes,
                errors: out var fileErrors,
                anodeCurvesConfig: out var anodeCurvesConfig,
                gridCurvesConfig: out var gridCurvesConfig,
                anodeCurves: out var anodeCurves,
                gridCurves: out var gridCurves,
                quickTest: out var quickTest))
        {
            return NotFound();
        }

        var config = MeasurementHelper.ParseMeasurementConfigTable(gridCurvesConfig);

        var gridFileName = config.MeasurementType switch
        {
            MeasurementHelper.MeasurementType.TriodeGridCurves => "grid_curves",
            MeasurementHelper.MeasurementType.DoubleTriodeGridCurves => "grid_curves",
            MeasurementHelper.MeasurementType.PentodeScreenCurves => "screen_curves",
            _ => throw new ArgumentOutOfRangeException()
        };

        using var zipStream = new MemoryStream();
        using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, leaveOpen: true))
        {

            await SaveFileToZipArchive(archive: archive, fileName: "anode_curves_measurement_config.uts", content: anodeCurvesConfig);
            await SaveFileToZipArchive(archive: archive, fileName: $"{gridFileName}_measurement_config.uts", content: gridCurvesConfig);
            await SaveFileToZipArchive(archive: archive, fileName: "anode_curves.utd", content: anodeCurves);
            await SaveFileToZipArchive(archive: archive, fileName: $"{gridFileName}.utd", content: gridCurves);
            await SaveFileToZipArchive(archive: archive, fileName: "quick_test.txt", content: quickTest);
        }

        zipStream.Position = 0;

        return File(zipStream.ToArray(), "application/zip", $"{measurementId}.zip");
    }

    private async static Task SaveFileToZipArchive(ZipArchive archive, string fileName, byte[] content)
    {
        var entry = archive.CreateEntry(fileName);
        await using var entryStream = entry.Open();
        entryStream.Write(content, 0, content.Length);
    }

#if !DEBUG
    // Только в релизе используем кеширование
    [ResponseCache(Duration = 60 /*с*/ * 60 /*м*/ * 24 /*ч*/)]
#endif
    [HttpGet("{measurementId}/curves")]
    public async Task<IActionResult> Get(
        string measurementId,
        [FromQuery] bool vertical = true,
        [FromQuery] int width = 800,
        [FromQuery] int height = 500)
    {
        var measurements = await _applicationContext.ProductMeasurements
            .AsNoTracking()
            .Where(x => x.Id == measurementId)
            .Select(x => x.Measurements)
            .SingleOrDefaultAsync();

        if (measurements == null) return NotFound();

        if (!MeasurementHelper.ReadMeasurementFile(
                measurementData: measurements,
                errors: out var fileErrors,
                anodeCurvesConfig: out var anodeCurvesConfig,
                gridCurvesConfig: out var gridCurvesConfig,
                anodeCurves: out var anodeCurves,
                gridCurves: out var gridCurves,
                quickTest: out var quickTest))
        {
            return Problem();
        }

        var plot1 = CreatePlot(
            measurementData: anodeCurves,
            measurementConfig: anodeCurvesConfig,
            vertical: vertical,
            width: width,
            height: height);

        var plot2 = CreatePlot(
            measurementData: gridCurves,
            measurementConfig: gridCurvesConfig,
            vertical: vertical,
            width: width,
            height: height);

        var result = SvgMerger.MergeSvgsHorizontally(
            vertical: vertical,
            defaultFontFamily: "Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif",
            plot1,
            plot2);

        var response = Content(result, "image/svg+xml");
        return response;
    }

    private static string CreatePlot(
        byte[] measurementData,
        byte[] measurementConfig,
        bool vertical,
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
        var anodeCurvesPoints = MeasurementHelper.ParseSpaceSeparatedTable(measurementData);
        var legendItems = new List<LegendItem>();

        var config = MeasurementHelper.ParseMeasurementConfigTable(measurementConfig);

        switch (config.MeasurementType)
        {
            case MeasurementHelper.MeasurementType.TriodeAnodeCurves:
                PlotTriodeAnodeCurves(
                    data: anodeCurvesPoints,
                    measurementConfig: config,
                    plotSecondCurve: false,
                    plot: plt,
                    legendItems: legendItems);
                break;
            case MeasurementHelper.MeasurementType.TriodeGridCurves:
                PlotTriodeGridCurves(
                    data: anodeCurvesPoints,
                    measurementConfig: config,
                    plotSecondCurve: false,
                    plot: plt,
                    legendItems: legendItems);
                break;
            case MeasurementHelper.MeasurementType.DoubleTriodeAnodeCurves:
                PlotTriodeAnodeCurves(
                    data: anodeCurvesPoints,
                    measurementConfig: config,
                    plotSecondCurve: true,
                    plot: plt,
                    legendItems: legendItems);
                break;
            case MeasurementHelper.MeasurementType.DoubleTriodeGridCurves:
                PlotTriodeGridCurves(
                    data: anodeCurvesPoints,
                    measurementConfig: config,
                    plotSecondCurve: true,
                    plot: plt,
                    legendItems: legendItems);
                break;
            case MeasurementHelper.MeasurementType.PentodeAnodeCurves:
                PlotPentodeAnodeCurves(
                    data: anodeCurvesPoints,
                    measurementConfig: config,
                    plot: plt,
                    legendItems: legendItems);
                break;
            case MeasurementHelper.MeasurementType.PentodeScreenCurves:
                PlotPentodeScreenCurves(data: anodeCurvesPoints, config: config, plot: plt, legendItems: legendItems);
                break;

            default:
                throw new ArgumentOutOfRangeException();
        }

        plt.Legend.ManualItems = legendItems;
        plt.Legend.ShadowColor = new Color(red: 0, green: 0, blue: 0, alpha: 0);

        plt.ShowLegend(vertical ? Edge.Right : Edge.Bottom);

        return plt.GetSvgXml(width: width, height: height);
    }

    private static void PlotTriodeAnodeCurves(
    Dictionary<int, MeasurementPoint[]> data,
    MeasurementHelper.MeasurementConfig measurementConfig,
    bool plotSecondCurve,
    Plot plot,
    List<LegendItem> legendItems)
    {
        double PowerLimit(double v) => measurementConfig.Pmax / v;

        var maxX = 0.0;
        var maxY = 0.0;

        var section1LinePattern = LinePattern.Solid;
        var section1MarkerShape = MarkerShape.FilledCircle;
        var section2LinePattern = LinePattern.Dotted;
        var section2MarkerShape = MarkerShape.OpenCircle;
        var lineWidth = 1;
        var markerSize = 5;

        foreach (var (i, values) in data)
        {
            var iaValues = values.TakeWhile(x => x.dIa > IgnoreDI).Select(x => (x.Va, x.Ia)).ToList();
            var isValues = values.TakeWhile(x => x.dIs > IgnoreDI).Select(x => (x.Va, x.Is)).ToList();

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
                LabelText = $"MaxP = {measurementConfig.Pmax / 1000.0:F1}W",
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
        Dictionary<int, MeasurementPoint[]> data,
        MeasurementHelper.MeasurementConfig measurementConfig,
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

        double PowerLimit(double v) => measurementConfig.Pmax / v;

        var minX = 0.0;
        var maxY = 0.0;
        foreach (var (i, values) in data)
        {
            var iaValues = values.TakeWhile(x => x.dIa > IgnoreDI).Select(x => (x.Va, x.Vg, x.Ia)).ToList();
            var isValues = values.TakeWhile(x => x.dIs > IgnoreDI).Select(x => (x.Va, x.Vg, x.Is)).ToList();

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
        Dictionary<int, MeasurementPoint[]> data,
        MeasurementHelper.MeasurementConfig measurementConfig,
        Plot plot,
        List<LegendItem> legendItems)
    {
        double PowerLimit(double v) => measurementConfig.Pmax / v;

        var maxX = 0.0;
        var maxY = 0.0;

        var section1LinePattern = LinePattern.Solid;
        var section1MarkerShape = MarkerShape.FilledCircle;
        var section2LinePattern = LinePattern.Dotted;
        var section2MarkerShape = MarkerShape.OpenCircle;
        var lineWidth = 1;
        var markerSize = 5;

        foreach (var (i, values) in data)
        {
            var iaValues = values.TakeWhile(x => x.dIa > IgnoreDI).Select(x => (x.Va, x.Ia)).ToList();
            var isValues = values.TakeWhile(x => x.dIs > IgnoreDI).Select(x => (x.Va, x.Is)).ToList();

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
                LabelText = $"MaxP = {measurementConfig.Pmax / 1000.0:F1}W",
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
        Dictionary<int, MeasurementPoint[]> data,
        MeasurementHelper.MeasurementConfig config,
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
        foreach (var (i, values) in data)
        {
            var iaValues = values.TakeWhile(x => x.dIa > IgnoreDI).Select(x => (x.Va, x.Vs, x.Ia)).ToList();
            var isValues = values.TakeWhile(x => x.dIs > IgnoreDI).Select(x => (x.Va, x.Vs, x.Is)).ToList();

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
}