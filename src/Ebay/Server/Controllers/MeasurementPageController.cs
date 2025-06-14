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
        
        return File(
            zipBytes,
            "application/zip",
            $"{measurementId}.zip"
        );
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

        var anodeCurvesSvg = CreatePlot(
            measurementData: anodeCurves,
            action: PlotAnodeCurves,
            vertical: vertical,
            width: width,
            height: height);
        
        var gridCurvesSvg = CreatePlot(
            measurementData: gridCurves,
            action: PlotGridCurves,
            vertical: vertical,
            width: width,
            height: height);

        var result = SvgMerger.MergeSvgsHorizontally(
            vertical: vertical,
            defaultFontFamily: "Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif",
            anodeCurvesSvg,
            gridCurvesSvg);

        var response = Content(result, "image/svg+xml");
        return response;
    }

    private static void PlotAnodeCurves(Dictionary<int, MeasurementPoint[]> data, Plot plot, List<LegendItem> legendItems)
    {
        var maxX = 0.0;
        var maxY = 0.0;

        foreach (var (i, values) in data)
        {
            var lineMaxX = values.Select(x => x.Va).Max();
            var lineMaxY = values.Select(x => x.Ia).Union(values.Select(x=>x.Is)).Max();

            if (lineMaxX > maxX)
            {
                maxX = lineMaxX;
            }
            
            if (lineMaxY > maxY)
            {
                maxY = lineMaxY;
            }
            
            var vg = values.Select(x => x.Vg).Average();

            var s = plot.Add.Scatter(values.Select(x => new Coordinates(x: x.Va, y: x.Ia)).ToList());
            s.LinePattern = LinePattern.Solid;
            s.MarkerShape = MarkerShape.Cross;

            var s2 = plot.Add.Scatter(values.Select(x => new Coordinates(x: x.Va, y: x.Is)).ToList());
            s2.LinePattern = LinePattern.Solid;
            s2.MarkerShape = MarkerShape.OpenDiamond;
            s2.Color = s.Color;

            legendItems.Add(
                new LegendItem
                {
                    LabelText = $"Vg = {vg:N0}", LineColor = s.Color, LinePattern = LinePattern.Solid, LineWidth = 5
                });
        }
        
        var pMax = 1.1; //todo нужно получать из конфига
        
        double PowerLimit(double u) => pMax * 1000 / u;
        
        var func = plot.Add.Function(PowerLimit);
        func.MinX = 0.1;
        func.LineColor = new Color(255, 0, 0);
        func.LineWidth = 2;
        legendItems.Add(
            new LegendItem
            {
                LabelText = $"MaxP = {pMax}W", LineColor = func.LineColor, LineWidth = func.LineWidth
            });
        plot.Axes.SetLimits(bottom: 0, left: 0, top: maxY, right: maxX);
        plot.XLabel("Va (V)");
        plot.YLabel("Ia (mA)");
        plot.Title("Anode curves");
        
    }
    
    private static void PlotGridCurves(
        Dictionary<int, MeasurementPoint[]> data,
        Plot plot,
        List<LegendItem> legendItems)
    {
        
        var minX = 0.0;
        var maxY = 0.0;
        foreach (var (i, values) in data)
        {
            var lineMinX = values.Select(x => x.Vg).Min();
            var lineMaxY = values.Select(x => x.Ia).Union(values.Select(x=>x.Is)).Max();

            if (lineMinX < minX)
            {
                minX = lineMinX;
            }
            
            if (lineMaxY > maxY)
            {
                maxY = lineMaxY;
            }
            
            var va = values.Select(x => x.Va).Average();
            
            var s = plot.Add.Scatter(values.Select(x => new Coordinates(x: x.Vg, y: x.Ia)).ToList());
            s.LinePattern = LinePattern.Solid;
            s.MarkerShape = MarkerShape.Cross;
            
            var s2 = plot.Add.Scatter(values.Select(x => new Coordinates(x: x.Vg, y: x.Is)).ToList());
            s2.LinePattern = LinePattern.Solid;
            s2.MarkerShape = MarkerShape.OpenDiamond;
            s2.Color = s.Color;
    
            legendItems.Add(new LegendItem
            {
                LabelText = $"Va = {va:N0}",
                LineColor = s.Color,
                LinePattern = LinePattern.Solid,
                LineWidth = 5
            });
        }
        plot.Axes.SetLimits(bottom: 0, left: minX, top: maxY, right: 0);
        plot.XLabel("Vg (V)");
        plot.YLabel("Ia (mA)");
        plot.Title("Grid curves");
    }

    private static string CreatePlot(
        byte[] measurementData,
        Action<Dictionary<int, MeasurementPoint[]>, Plot, List<LegendItem>> action,
        bool vertical,
        int width,
        int height)
    {
        var plt = new Plot();
        var style = new Light();
        style.FigureBackgroundColor = new Color(0, 0, 0, 0);
        style.DataBackgroundColor = new Color(0, 0, 0, 0);
        style.LegendBackgroundColor = new Color(0, 0, 0, 0);
        style.LegendOutlineColor = new(0, 0, 0);
        plt.SetStyle(style);
        var anodeCurvesPoints = MeasurementHelper.ParseSpaceSeparatedTable(measurementData);
        var legendItems = new List<LegendItem>();

        action(arg1: anodeCurvesPoints, arg2: plt, arg3: legendItems);

        plt.Legend.ManualItems = legendItems;
        plt.Legend.ShadowColor = new Color(0, 0, 0, 0);;
        plt.ShowLegend(vertical ? Edge.Right : Edge.Bottom);

        return plt.GetSvgXml(width: width, height: height);
    }
}