using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Measurements;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Application.Pages;

public class PurchasePage : PageModel
{
    private readonly IMeasurementQueries _measurementQueries;

    public PurchasePage(IMeasurementQueries measurementQueries)
    {
        _measurementQueries = measurementQueries;
    }

    public IReadOnlyList<MeasurementInfoWithData> Measurements { get; private set; } = Array.Empty<MeasurementInfoWithData>();


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

        await _measurementQueries.GetMeasurementInfos(ids, cancellationToken);

        var measurements = await _measurementQueries.GetMeasurementInfos(ids, cancellationToken);

        if (measurements.Count == 0)
        {
            return NotFound("Measurements not found");
        }

        var order = ids
            .Select((id, index) => new { id, index })
            .ToDictionary(x => x.id, x => x.index, StringComparer.OrdinalIgnoreCase);

        Measurements = measurements
            .OrderBy(m => order.TryGetValue(m.Id, out var index) ? index : int.MaxValue)
            .ToList();

        return Page();
    }
}
