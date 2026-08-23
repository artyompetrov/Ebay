using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driving.WebApi.Pages;

public class MeasurementPage : PageModel
{
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IProductQueries _productQueries;

    public MeasurementPage(
        IMeasurementQueries measurementQueries,
        IProductQueries productQueries)
    {
        _measurementQueries = measurementQueries;
        _productQueries = productQueries;
    }

    public ProductInfo Product { get; set; } = null!;
    public MeasurementInfoWithData Measurement { get; set; } = null!;

    public async Task<IActionResult> OnGet(string measurementId, CancellationToken cancellationToken)
    {
        var measurementInfo = await _measurementQueries.GetMeasurementInfoWithData(measurementId, cancellationToken);

        if (measurementInfo == null)
        {
            return NotFound("Measurement not found");
        }

        var product = await _productQueries.GetProductAsync(measurementInfo.ProductId, cancellationToken);

        if (product == null)
        {
            return NotFound("Product not found");
        }

        Product = product;
        Measurement = measurementInfo;

        return Page();
    }
}