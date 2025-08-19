using Microsoft.AspNetCore.Mvc;
using Server.Application.Services.Measurement;
using Server.Application.Services.MeasurementPlot;

namespace Server.Application.Controllers;

[ApiController]
public class MeasurementPageController : ControllerBase
{
    private readonly MeasurementService _measurementService;
    private readonly MeasurementPlotService _measurementPlotService;

    public MeasurementPageController(MeasurementService measurementService, MeasurementPlotService measurementPlotService)
    {
        _measurementService = measurementService;
        _measurementPlotService = measurementPlotService;
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
    [ResponseCache(Duration = 60 /*с*/ * 20 /*м*/)]
#endif
    [HttpGet("/m/{measurementId}/ebay_curves")]
    public async Task<IActionResult> GetEbayCurves(
        string measurementId,
        CancellationToken cancellationToken)
    {
        var result = await _measurementPlotService.PlotForMeasurementId(
            measurementId: measurementId,
            cancellationToken: cancellationToken,
            mergeVertical: false,
            legendVertical: true,
            addQuickTest: true,
            width: 550,
            height: 400,
            sellingOnly: true);

        if (result == null)
            return NotFound("Measurement not found");

        var response = Content(result, "image/svg+xml");
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
            height: 500,
            sellingOnly: false);

        if (result == null)
            return NotFound("Measurement not found");

        var response = Content(result, "image/svg+xml");
        return response;
    }
}