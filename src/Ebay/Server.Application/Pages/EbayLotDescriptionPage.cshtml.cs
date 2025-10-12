using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Server.Application.Abstractions.Measurements;
using Server.Domain.Measurements;

namespace Server.Application.Pages;

public class EbayLotDescriptionPage : PageModel
{
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IProductQueries _productQueries;
    private readonly IPassportQueries _passportQueries;

    //конструктор обязательно должен быть public
    public EbayLotDescriptionPage(
        IMeasurementQueries measurementQueries,
        IProductQueries productQueries,
        IPassportQueries passportQueries)
    {
        _measurementQueries = measurementQueries;
        _productQueries = productQueries;
        _passportQueries = passportQueries;
    }



    public ProductState State { get; set; }

    public Guid ProductId { get; set; }

    public ProductInfo Product { get; set; } = null!;

    public IReadOnlyList<Passport> Passports { get; set; } = null!;

    public IReadOnlyCollection<MeasurementInfo> Measurements { get; set; } = null!;

    public async Task<IActionResult> OnGet(Guid productId, ProductState state, CancellationToken cancellationToken)
    {
        State = state;
        ProductId = productId;

        var product = await _productQueries.GetProduct(productId, cancellationToken);

        if (product == null)
        {
            return NotFound();
        }

        Measurements = await _measurementQueries.GetMeasurementsInfo(productId, new[] { MeasurementState.Selling }, cancellationToken);
        Passports = await _passportQueries.GetPassports(productId, cancellationToken);

        Product = product;

        return Page();
    }
}