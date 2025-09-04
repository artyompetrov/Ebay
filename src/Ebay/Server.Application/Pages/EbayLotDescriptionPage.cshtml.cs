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

    public ProductState State { get; set; }

    public Guid ProductId { get; set; }

    public record ProductWithMeasurementsDto(
        List<string> SearchQueries,
        List<MeasurementIdWithManufactureCode> Measurements,
        List<PassportDto> Passports
    );

    public record MeasurementIdWithManufactureCode(
        string MeasurementId,
        string ManufactureCode,
        ProductState ProductState
    );

    public record PassportDto(
        Guid Id,
        string FileName
    );

    public async Task<IActionResult> OnGet(Guid productId, ProductState state, CancellationToken cancellationToken)
    {
        State = state;
        ProductId = productId;

        var product = await _applicationContext.Products
            .Where(x => x.Id == productId)
            .Select(x => new ProductWithMeasurementsDto(
                x.SearchQueries.Select(m => m.Query).ToList(),
                x.ProductMeasurements
                    .Where(pm => pm.MeasurementState == MeasurementState.Selling && pm.ProductState == state)
                    .Select(m => new MeasurementIdWithManufactureCode(m.Id, m.ManufactureCode, m.ProductState))
                    .ToList(),
                x.Passports
                    .OrderBy(p => p.Order)
                    .Select(p => new PassportDto(p.Id, p.FileName))
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