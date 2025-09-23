using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Application.Pages;

public class PurchasePage : PageModel
{
    private readonly ApplicationDbContext _applicationContext;

    public PurchasePage(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    public IReadOnlyList<MeasurementDto> Measurements { get; private set; } = Array.Empty<MeasurementDto>();

    public record MeasurementDto(
        string MeasurementId,
        string ManufactureCode,
        ProductState ProductState,
        string ProductName
    );

    public async Task<IActionResult> OnGet(string measurementIds, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(measurementIds))
        {
            return BadRequest("measurementIds parameter is required");
        }

        var ids = measurementIds
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (ids.Count == 0)
        {
            return BadRequest("measurementIds parameter is required");
        }

        var measurements = await _applicationContext.ProductMeasurements
            .AsNoTracking()
            .Where(pm => ids.Contains(pm.Id))
            .Select(pm => new MeasurementDto(
                pm.Id,
                pm.ManufactureCode,
                pm.ProductState,
                pm.Product.SearchQueries
                    .OrderBy(q => q.Query)
                    .Select(q => q.Query)
                    .FirstOrDefault() ?? pm.Id
            ))
            .ToListAsync(cancellationToken);

        if (measurements.Count == 0)
        {
            return NotFound("Measurements not found");
        }

        var order = ids
            .Select((id, index) => new { id, index })
            .ToDictionary(x => x.id, x => x.index, StringComparer.OrdinalIgnoreCase);

        Measurements = measurements
            .OrderBy(m => order.TryGetValue(m.MeasurementId, out var index) ? index : int.MaxValue)
            .ToList();

        return Page();
    }
}
