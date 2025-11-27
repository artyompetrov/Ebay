
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Server.Application.Abstractions.Queries;
using Server.Domain.Measurements;

namespace Server.Application.Pages;

public class EbayLotDescriptionPage(
    IMeasurementQueries measurementQueries,
    IProductQueries productQueries,
    IPassportQueries passportQueries) : PageModel
{
    private readonly IMeasurementQueries _measurementQueries = measurementQueries;
    private readonly IProductQueries _productQueries = productQueries;
    private readonly IPassportQueries _passportQueries = passportQueries;

    public ProductState State { get; set; }

    public Guid ProductId { get; set; }
    public string? LotId { get; set; }
    public ProductInfo Product { get; set; } = null!;

    public IReadOnlyList<Passport> Passports { get; set; } = null!;



    public IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements> Measurements { get; set; } = null!;

    public async Task<IActionResult> OnGet(Guid productId, MeasurementState? measurementState, ProductState? state, CancellationToken cancellationToken, string? lotId = null)
    {
        if (!measurementState.HasValue)
        {
            return NotFound();
        }

        if (!state.HasValue)
        {
            return NotFound();
        }

        State = state.Value;
        ProductId = productId;
        LotId = lotId;



        var product = await _productQueries.GetProductAsync(productId, cancellationToken);

        if (product == null)
        {
            return NotFound();
        }

        Measurements = await _measurementQueries.GetMeasurementInfosWithSimilarMeasurements(productId, lotId, productStates: new[] { state.Value }, measurementStates: new[] { measurementState.Value }, cancellationToken: cancellationToken);
        Passports = await _passportQueries.GetPassports(productId, cancellationToken);

        Product = product;

        return Page();
    }



}