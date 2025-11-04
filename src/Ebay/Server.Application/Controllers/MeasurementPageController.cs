using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Server.Application.Services.GeoIp;
using Server.Application.Services.Measurement;
using Server.Application.Services.MeasurementPlot;

namespace Server.Application.Controllers;

[ApiController]
public class MeasurementPageController : ControllerBase
{
    private readonly MeasurementService _measurementService;
    private readonly MeasurementPlotService _measurementPlotService;
    private readonly GeoIpService _geoIpService;
    private readonly ILogger<MeasurementPageController> _logger;

    public MeasurementPageController(
        MeasurementService measurementService,
        MeasurementPlotService measurementPlotService,
        GeoIpService geoIpService,
        ILogger<MeasurementPageController> logger)
    {
        _measurementService = measurementService;
        _measurementPlotService = measurementPlotService;
        _geoIpService = geoIpService;
        _logger = logger;
    }

    [HttpGet("/m/{measurementId}/download")]
    public async Task<IActionResult> DownloadZip(string measurementId, CancellationToken cancellationToken)
    {
        var file = await _measurementService.GetMeasurementFile(measurementId, cancellationToken);

        if (file == null)
            return NotFound();

        return File(file, "application/zip", $"{measurementId}.zip");
    }

#if !DEBUG
    // Только в релизе используем кеширование
    [ResponseCache(Duration = 60 /*с*/ * 5 /*м*/)]
#endif
    [HttpGet("/m/{measurementId}/ebay_curves")]
    public async Task<IActionResult> GetEbayCurves(
        string measurementId,
        string? lotId,
        bool? sellingOnly,
        CancellationToken cancellationToken)
    {
        var result = await _measurementPlotService.PlotForEbay(
            measurementId: measurementId,
            lotId: lotId,
            sellingOnly: sellingOnly ?? true,
            cancellationToken: cancellationToken);

        if (result == null)
            return NotFound("Measurement not found");

        var response = Content(content: result, contentType: "image/svg+xml");
        return response;
    }
    
#if !DEBUG
    // Только в релизе используем кеширование
    [ResponseCache(Duration = 60 /*с*/ * 5 /*м*/)]
#endif
    [HttpGet("/m/{measurementId}/ebay_tube_description")]
    public async Task<IActionResult> GetEbayTubeDescription(
        string measurementId,
        string? lotId,
        bool? sellingOnly,
        CancellationToken cancellationToken)
    {
        var result = await _measurementPlotService.GetEbayTubeDescription(
            measurementId: measurementId,
            lotId: lotId,
            sellingOnly: sellingOnly ?? true,
            cancellationToken: cancellationToken);

        if (result == null)
            return NotFound("Measurement not found");

        var response = Content(content: result, contentType: "image/svg+xml");
        return response;
    }

    [HttpGet("/m/sold")]
    public IActionResult GetSoldImage()
    {
        var result = _measurementPlotService.PlotSold();
    
        var response = Content(content: result, contentType: "image/svg+xml");
        return response;
    }

#if !DEBUG
    // Только в релизе используем кеширование
    [ResponseCache(Duration = 60 /*с*/ * 60 /*м*/ * 24 /*ч*/)]
#endif
    [HttpGet("/m/{measurementId}/curves")]
    public async Task<IActionResult> GetCurves(
        string measurementId,
        CancellationToken cancellationToken)
    {
        var result = await _measurementPlotService.PlotForMeasurementId(
            measurementId: measurementId,
            cancellationToken: cancellationToken,
            mergeVertical: true,
            legendVertical: true,
            addQuickTest: false,
            width: 800,
            height: 500);

        if (result == null)
            return NotFound("Measurement not found");

        var response = Content(result, "image/svg+xml");
        return response;
    }
    
    
    [HttpGet("/empty_picture")]
    public async Task<IActionResult> GetEmptyPicture(
        string product,
        string? lotId,
        CancellationToken cancellationToken)
    {
        var xRealIp = Request.Headers["X-Real-IP"].FirstOrDefault();
        var userAgent = Request.Headers["User-Agent"].ToString();

        await _geoIpService.LogRequest(
            prefix: $"GetEbayCurves for product {product} {lotId} requested",
            realIp: xRealIp,
            ua: userAgent,
            token: cancellationToken);

        var result = """
                <svg xmlns="http://www.w3.org/2000/svg" width="5" height="5">
                </svg>
                """;

        var response = Content(content: result, contentType: "image/svg+xml");
        return response;
    }
}