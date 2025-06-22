using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Data.Models;
using Server.Infrastructure;

namespace Server.Pages;

public class MeasurementPage : PageModel
{
    private readonly ApplicationDbContext _applicationContext;

    //конструктор обязательно должен быть public
    public MeasurementPage(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    internal ProductMeasurement Measurement { get; private set; } = null!;
    public string QuickTest { get; private set; } = null!;
    public MeasurementHelper.MeasurementConfig AnodeCurvesConfig { get; private set; } = null!;
    
    public MeasurementHelper.MeasurementConfig GridCurvesConfig { get; private set; } = null!;

    public async Task<IActionResult> OnGet(string measurementId)
    {
        var measurement = await _applicationContext.ProductMeasurements
            .AsNoTracking()
            .Include(x => x.Product)
            .ThenInclude(x => x.SearchQueries)
            .SingleOrDefaultAsync(x => x.Id == measurementId);

        if (measurement == null)
        {
            return NotFound("Measurement not found");
        }

        Measurement = measurement;

        if (!MeasurementHelper.ReadMeasurementFile(
                measurementData: Measurement.Measurements,
                errors: out var fileErrors,
                anodeCurvesConfig: out var anodeCurvesConfig,
                gridCurvesConfig: out var gridCurvesConfig,
                anodeCurves: out var anodeCurves,
                gridCurves: out var gridCurves,
                quickTest: out var quickTest))
        {
            return NotFound("Measurement not found");
        }

        AnodeCurvesConfig = MeasurementHelper.ParseMeasurementConfigTable(anodeCurvesConfig);
        GridCurvesConfig = MeasurementHelper.ParseMeasurementConfigTable(gridCurvesConfig);

        var removeSection2 = AnodeCurvesConfig.MeasurementType == MeasurementHelper.MeasurementType.TriodeAnodeCurves ||
                             GridCurvesConfig.MeasurementType == MeasurementHelper.MeasurementType.TriodeGridCurves;

        QuickTest = MeasurementHelper.ParseAndPrettifyQuickTest(quickTest, removeSection2);

        return Page();
    }
}