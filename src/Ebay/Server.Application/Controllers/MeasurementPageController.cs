using System.Collections.Concurrent;
using System.IO.Compression;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScottPlot;
using ScottPlot.PlotStyles;
using Server.Application.Data;
using Server.Application.Infrastructure;
using Server.Application.Services;
using Server.Application.Services.MeasurementService;

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
    [ResponseCache(Duration = 60 /*с*/ * 60 /*м*/ * 24 /*ч*/)]
#endif
    [HttpGet("/m/{measurementId}/curves")]
    public async Task<IActionResult> Get(
        string measurementId,
        CancellationToken cancellationToken)
    {
        var result = await _measurementPlotService.PlotForMeasurementId(
            measurementId: measurementId,
            cancellationToken: cancellationToken,
            mergeVertical: true,
            legendVertical: true,
            width: 800,
            height: 500);

        if (result == null)
            return NotFound("Measurement not found");

        var response = Content(result, "image/svg+xml");
        return response;
    }
}