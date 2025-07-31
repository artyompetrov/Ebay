using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;

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
        string Name,
        List<string> SearchQueries,
        List<string> ProductMeasurementIds
    );
    public async Task<IActionResult> OnGet(Guid productId, CancellationToken cancellationToken)
    {

        var product = await _applicationContext.Products
            .Include(x => x.ProductMeasurements)
            .Where(x => x.Id == productId)
            .Select(x => new ProductWithMeasurementsDto(
                x.Name,
                x.SearchQueries.Select(m => m.Query).ToList(),
                x.ProductMeasurements.Select(m => m.Id).ToList()
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