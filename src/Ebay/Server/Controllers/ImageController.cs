using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScottPlot;
using ScottPlot.Stylers;
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
    public async Task<IActionResult> Get(string measurementId)
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

        var anodeCurvesSvg = CreateAnodeCurvesPlot(anodeCurves: anodeCurves);
        var plateCurvesSvg = CreatePlateCurvesPlot(plateCurves: plateCurves);

        var result = SvgMerger.MergeSvgsHorizontally(vertical: true, anodeCurvesSvg, plateCurvesSvg);

        var response = Content(result, "image/svg+xml");
#if !DEBUG
        // Только в релизе используем кеширование
        Response.Headers.CacheControl = "public, max-age=86400";
        Response.Headers.Expires = DateTime.UtcNow.AddDays(1).ToString("R");
#endif
        return response;
    }

    private static string CreateAnodeCurvesPlot(byte[] anodeCurves)
    {
        var plt = new Plot();
        plt.Font.Set("Segoe UI, Arial, Helvetica, sans-serif");
        var anodeCurvesPoints = MeasurementHelper.ParseSpaceSeparatedTable(anodeCurves);
        var legendItems = new List<LegendItem>();
        
        foreach (var (i, values) in anodeCurvesPoints)
        {
            var vg = values.Select(x => x.Vg).Average();
            
            var s = plt.Add.Scatter(values.Select(x => new Coordinates(x: x.Va, y: x.Ia)).ToList());
            s.LinePattern = LinePattern.Solid;
            s.MarkerShape = MarkerShape.Cross;
            
            var s2 = plt.Add.Scatter(values.Select(x => new Coordinates(x: x.Va, y: x.Is)).ToList());
            s2.LinePattern = LinePattern.Solid;
            s2.MarkerShape = MarkerShape.OpenDiamond;
            s2.Color = s.Color;
    
            legendItems.Add(new LegendItem
            {
                LabelText = $"Vg = {vg:N0}",
                LineColor = s.Color,
                LinePattern = LinePattern.Solid,
                LineWidth = 5
            });
        }
        
        plt.XLabel("Va (V)");
        plt.YLabel("Ia (mA)");
        plt.Title("Anode Curves");
        plt.Legend.ManualItems = legendItems;
        plt.ShowLegend(Edge.Bottom);

        return plt.GetSvgXml(600, 500);
    }
    
    private static string CreatePlateCurvesPlot(byte[] plateCurves)
    {
        var plt = new Plot();
        var plateCurvesPoints = MeasurementHelper.ParseSpaceSeparatedTable(plateCurves);
        var legendItems = new List<LegendItem>();
        
        foreach (var (i, values) in plateCurvesPoints)
        {
            var va = values.Select(x => x.Va).Average();
            
            var s = plt.Add.Scatter(values.Select(x => new Coordinates(x: x.Vg, y: x.Ia)).ToList());
            s.LinePattern = LinePattern.Solid;
            s.MarkerShape = MarkerShape.Cross;
            
            var s2 = plt.Add.Scatter(values.Select(x => new Coordinates(x: x.Vg, y: x.Is)).ToList());
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
        
        plt.XLabel("Vg (V)");
        plt.YLabel("Ia (mA)");
        plt.Title("Plate Curves");
        plt.Legend.ManualItems = legendItems;
        plt.ShowLegend(Edge.Bottom);

        return plt.GetSvgXml(600, 500);
    }
}