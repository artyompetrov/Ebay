using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;
using Server.Application.Data.Models;
using Server.Application.Services.Measurement;

namespace Server.Application.Pages;

public class MeasurementPage : PageModel
{
    private readonly MeasurementService _measurementService;
    private readonly ApplicationDbContext _applicationContext;

//конструктор обязательно должен быть public
    public MeasurementPage(MeasurementService measurementService, ApplicationDbContext applicationContext)
    {
        _measurementService = measurementService;
        _applicationContext = applicationContext;
    }

    public Product Product { get; set; } = null!;
    public MeasurementData Measurement { get; set; } = null!;


    public async Task<IActionResult> OnGet(string measurementId, CancellationToken cancellationToken)
    {
        var measurementData = await _measurementService.GetMeasurements(cancellationToken, measurementId);

        if (measurementData == null)
            return NotFound("Measurement not found");
        
        var product = await _applicationContext.Products
            .AsNoTracking()
            .Include(x => x.SearchQueries)
            .SingleOrDefaultAsync(x => x.Id == measurementData.ProductId);

        if (product == null)
        {
            return NotFound("Product not found");
        }

        Product = product;
        Measurement = measurementData;

        return Page();
    }
}