using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Measurements;
using Server.Application.Data;
using Server.Application.Services.Measurement;
using Server.Domain;

namespace Server.Application.Pages;

public class MeasurementPage : PageModel
{
    private readonly MeasurementService _measurementService;
    private readonly ApplicationDbContext _applicationContext;
    private readonly IMeasurementQueries _measurementQueries;

    //конструктор обязательно должен быть public
    public MeasurementPage( ApplicationDbContext applicationContext, IMeasurementQueries measurementQueries)
    {
        _applicationContext = applicationContext;
        _measurementQueries = measurementQueries;
    }

    public Product Product { get; set; } = null!;
    public MeasurementInfo Measurement { get; set; } = null!;


    public async Task<IActionResult> OnGet(string measurementId, CancellationToken cancellationToken)
    {
        var measurementInfo = await _measurementQueries.GetMeasurementInfo(measurementId, cancellationToken);
        
        if (measurementInfo == null)
            return NotFound("Measurement not found");

        var product = await _applicationContext.Products
            .AsNoTracking()
            .Include(x => x.SearchQueries)
            .Include(x => x.Passports)
            .SingleOrDefaultAsync(x => x.Id == measurementInfo.ProductId);

        if (product == null)
        {
            return NotFound("Product not found");
        }

        Product = product;
        Measurement = measurementInfo;

        return Page();
    }
}