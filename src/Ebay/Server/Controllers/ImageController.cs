using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScottPlot;
using ScottPlot.PlotStyles;
using Server.Data;
using Server.Infrastructure;

namespace Server.Controllers;

[ApiController]
[Route("/m/")]
public class ImageController : ControllerBase
{
    private readonly ApplicationDbContext _applicationContext;

    public ImageController(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

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
                plateCurvesConfig: out var plateCurvesConfig,
                anodeCurves: out var anodeCurves,
                plateCurves: out var plateCurves,
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
        
        var plateCurvesSvg = CreatePlot(
            measurementData: plateCurves,
            action: PlotPlateCurves,
            vertical: vertical,
            width: width,
            height: height);

        var result = SvgMerger.MergeSvgsHorizontally(
            vertical: vertical,
            defaultFontFamily: "Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif",
            anodeCurvesSvg,
            plateCurvesSvg);

        var response = Content(result, "image/svg+xml");
#if !DEBUG
        // Только в релизе используем кеширование
        Response.Headers.CacheControl = "public, max-age=86400";
        Response.Headers.Expires = DateTime.UtcNow.AddDays(1).ToString("R");
#endif
        return response;
    }

    private static void PlotAnodeCurves(Dictionary<int, MeasurementPoint[]> data, Plot plot, List<LegendItem> legendItems)
    {
        foreach (var (i, values) in data)
        {
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

        plot.XLabel("Va (V)");
        plot.YLabel("Ia (mA)");
        plot.Title("Anode Curves");
    }
    
    private static void PlotPlateCurves(Dictionary<int, MeasurementPoint[]> data, Plot plot, List<LegendItem> legendItems)
    {
        foreach (var (i, values) in data)
        {
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
        
        plot.XLabel("Vg (V)");
        plot.YLabel("Ia (mA)");
        plot.Title("Plate Curves");
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
        style.FigureBackgroundColor = new(0, 0, 0, 0);
        style.DataBackgroundColor = new(0, 0, 0, 0);
        style.LegendBackgroundColor = new(0, 0, 0, 0);
        plt.SetStyle(style);
        var anodeCurvesPoints = MeasurementHelper.ParseSpaceSeparatedTable(measurementData);
        var legendItems = new List<LegendItem>();

        action(arg1: anodeCurvesPoints, arg2: plt, arg3: legendItems);

        plt.Legend.ManualItems = legendItems;
        
        plt.ShowLegend(vertical ? Edge.Right : Edge.Bottom);

        return plt.GetSvgXml(width: width, height: height);
    }
}