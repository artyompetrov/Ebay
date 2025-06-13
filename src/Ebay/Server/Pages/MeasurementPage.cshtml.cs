using System.Text.RegularExpressions;
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
                plateCurvesConfig: out var plateCurvesConfig,
                anodeCurves: out var anodeCurves,
                plateCurves: out var plateCurves,
                quickTest: out var quickTest))
        {
            return NotFound("Measurement not found");
        }

        QuickTest = ParseAndPrettifyQuickTest(quickTest);
        
        return Page();
    }

    private static string ParseAndPrettifyQuickTest(byte[] quickTest)
    {
        var quickTestStr = System.Text.Encoding.UTF8.GetString(quickTest);

        quickTestStr = Regex.Replace(
            quickTestStr,
            @"\s+\d+\s*% of nominal [\d\.,]+ ?\([^)]+\)",
            m => new string(' ', m.Value.Length));

        quickTestStr = Regex.Replace(quickTestStr, @"[ ]{3,}", "|");
        
        quickTestStr = Regex.Replace(quickTestStr, @"[ ]{3,}", "");
        
        var matches = Regex.Matches(quickTestStr, @"^(.*?)\|", RegexOptions.Multiline);
        var maxWidth = matches.Cast<Match>().Select(m => m.Groups[1].Value.Length).DefaultIfEmpty(0).Max();
        var tabSize = 8; // браузер чаще всего 8

        // Шаг 2: Заменить каждое "до |" на выровненное + табы
        var aligned = Regex.Replace(
            quickTestStr,
            @"^(.*?)\|",
            m =>
            {
                var left = m.Groups[1].Value.TrimEnd();
                // Сколько надо символов до maxWidth
                var padLen = maxWidth - left.Length;
                // Сколько табов (с учётом табуляции 8)
                var tabsNeeded = ((left.Length + padLen) / tabSize) + 1 - (left.Length / tabSize);
                if (tabsNeeded < 1) tabsNeeded = 1;
                return left + new string('\t', tabsNeeded);
            },
            RegexOptions.Multiline
        );
        
        return aligned;
    }
}