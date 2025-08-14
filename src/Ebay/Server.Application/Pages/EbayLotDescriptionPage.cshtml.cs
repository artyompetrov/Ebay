using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;
using Server.Application.Data.Models;

namespace Server.Application.Pages;

public class EbayLotDescriptionPage : PageModel
{
    private readonly ApplicationDbContext _applicationContext;

    //конструктор обязательно должен быть public
    public EbayLotDescriptionPage(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    public ProductWithMeasurementsDto Product { get; set; } = null!;

    public record ProductWithMeasurementsDto(
        List<string> SearchQueries,
        List<string> ProductMeasurementIds
    );
    public async Task<IActionResult> OnGet(Guid productId, CancellationToken cancellationToken)
    {

        var product = await _applicationContext.Products
            .Where(x => x.Id == productId)
            .Select(x => new ProductWithMeasurementsDto(
                x.SearchQueries.Select(m => m.Query).ToList(),
                x.ProductMeasurements
                    .Where(pm => pm.MeasurementState == MeasurementState.Selling)
                    .Select(m => m.Id)
                    .ToList()
            ))
            .SingleOrDefaultAsync(cancellationToken);

        if (product == null)
        {
            return NotFound();
        }

        Product = product;

        return Page();
    }
}