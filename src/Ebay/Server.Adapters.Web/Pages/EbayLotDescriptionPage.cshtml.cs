using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Server.Application.Abstractions.Queries;
using Server.Domain.Measurements;

namespace Server.Adapters.Web.Pages;

public class EbayLotDescriptionPage : PageModel
{
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IProductQueries _productQueries;

    public EbayLotDescriptionPage(
        IMeasurementQueries measurementQueries,
        IProductQueries productQueries)
    {
        _measurementQueries = measurementQueries;
        _productQueries = productQueries;
    }

    public ProductState State { get; set; }

    public Guid ProductId { get; set; }
    public string? LotId { get; set; }
    public ProductInfo Product { get; set; } = null!;
    
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

        Measurements = await _measurementQueries.GetMeasurementInfosWithSimilarMeasurements(productId, lotId, productStates:
            [state.Value], measurementStates: [measurementState.Value], cancellationToken: cancellationToken);

        Product = product;

        return Page();
    }

}