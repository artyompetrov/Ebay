using System.Security.Cryptography;
using System.Text;
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
    public string? LotId { get; set; }
    public ProductInfo Product { get; set; } = null!;

    public IReadOnlyList<Passport> Passports { get; set; } = null!;
    
    public string FakeTubeId1 { get; set; } = null!;
    public string FakeTubeId2 { get; set; } = null!;

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

        FakeTubeId1 = MakeCode($"{productId}_1");
        FakeTubeId2 = MakeCode($"{productId}_2");

        var product = await _productQueries.GetProductAsync(productId, cancellationToken);

        if (product == null)
        {
            return NotFound();
        }

        Measurements = await _measurementQueries.GetMeasurementInfosWithSimilarMeasurements(productId,  lotId, productStates: new []{ state.Value }, measurementStates: new[] { measurementState.Value }, cancellationToken: cancellationToken);
        Passports = await _passportQueries.GetPassports(productId, cancellationToken);

        Product = product;

        return Page();
    }


    public static string MakeCode(string input, int length = 7)
    {
        const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        
        using var md5 = MD5.Create();
        var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(input ?? ""));

        var sb = new StringBuilder(length);
        for (int i = 0; i < hash.Length && sb.Length < length; i++)
        {
            sb.Append(alphabet[hash[i] % alphabet.Length]);
        }

        return sb.ToString();
    }
}