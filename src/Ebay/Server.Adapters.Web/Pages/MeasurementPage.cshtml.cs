using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Queries;
using Server.Application.Data;
using Server.Domain;
using Server.Domain.Measurements;

namespace Server.Adapters.Web.Pages;

public class MeasurementPage : PageModel
{
    private readonly ApplicationDbContext _applicationContext;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IMeasurementFileParser _measurementFileParser;

    public MeasurementPage(
        ApplicationDbContext applicationContext,
        IMeasurementQueries measurementQueries,
        IMeasurementFileParser measurementFileParser)
    {
        _applicationContext = applicationContext;
        _measurementQueries = measurementQueries;
        _measurementFileParser = measurementFileParser;
    }

    public Product Product { get; set; } = null!;
    public MeasurementInfoWithData Measurement { get; set; } = null!;

    public string QuickTest { get; set; } = null!;


    public async Task<IActionResult> OnGet(string measurementId, CancellationToken cancellationToken)
    {
        var measurementInfo = await _measurementQueries.GetMeasurementInfoWithData(measurementId, cancellationToken);

        if (measurementInfo == null)
        {
            return NotFound("Measurement not found");
        }

        var parseResult = _measurementFileParser.Parse(measurementInfo.Data);

        QuickTest = parseResult.PrettifiedQuickTest;

        var product = await _applicationContext.Products
            .AsNoTracking()
            .Include(x => x.SearchQueries)
            .SingleOrDefaultAsync(x => x.Id == measurementInfo.ProductId, cancellationToken: cancellationToken);

        if (product == null)
        {
            return NotFound("Product not found");
        }

        Product = product;
        Measurement = measurementInfo;

        return Page();
    }
}