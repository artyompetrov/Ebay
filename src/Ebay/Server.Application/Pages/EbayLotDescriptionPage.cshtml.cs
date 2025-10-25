using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Server.Application.Abstractions.Queries;
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

    public IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements> Measurements { get; set; } = null!;

    public async Task<IActionResult> OnGet(Guid productId, MeasurementState measurementState, ProductState state, CancellationToken cancellationToken)
    {
        State = state;
        ProductId = productId;

        var product = await _productQueries.GetProductAsync(productId, cancellationToken);

        if (product == null)
        {
            return NotFound();
        }

        Measurements = await _measurementQueries.GetMeasurementInfosWithSimilarMeasurements(productId, new[] { measurementState }, cancellationToken);
        Passports = await _passportQueries.GetPassports(productId, cancellationToken);

        Product = product;

        return Page();
    }


}