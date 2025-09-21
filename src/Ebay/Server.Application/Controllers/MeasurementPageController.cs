using System.Collections.Generic;
using System.Globalization;
using System.Text;
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
        string? product,
        CancellationToken cancellationToken)
    {
        var xRealIp = Request.Headers["X-Real-IP"].FirstOrDefault();
        var userAgent = Request.Headers["User-Agent"].ToString();

        await _geoIpService.LogRequest($"GetEbayCurves for product {product} requested", xRealIp, userAgent, cancellationToken);

        var result = await _measurementPlotService.PlotForEbay(measurementId, cancellationToken);

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

#if !DEBUG
    // Только в релизе используем кеширование
    [ResponseCache(Duration = 60 /*с*/ * 60 /*м*/ * 24 /*ч*/)]
#endif
    [HttpGet("/m/{measurementId}/similar_measurements")]
    public async Task<IActionResult> GetSimilarMeasurements(
        string measurementId,
        CancellationToken cancellationToken)
    {
        var measurementState = await _measurementService.GetMeasurementState(measurementId, cancellationToken);

        if (measurementState == null)
        {
            return NotFound("Measurement not found");
        }

        var similarMeasurements = await _measurementService.GetSimilarMeasurements(measurementId, cancellationToken);
        var svg = BuildSimilarMeasurementsSvg(measurementId, similarMeasurements);

        return Content(svg, "image/svg+xml");
    }

    private static string BuildSimilarMeasurementsSvg(
        string measurementId,
        IReadOnlyCollection<SimilarMeasurementInfo> similarMeasurements)
    {
        const int width = 420;
        const int horizontalPadding = 18;
        const int rowHeight = 42;
        const int rowSpacing = 6;
        const int headerHeight = 54;
        const int footerPadding = 18;

        var rowsCount = Math.Max(1, similarMeasurements.Count);
        var height = headerHeight + rowsCount * rowHeight + footerPadding;

        var svg = new StringBuilder();
        svg.AppendLine(FormattableString.Invariant($"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif">"""));
        svg.AppendLine(FormattableString.Invariant($"""  <rect x="0.5" y="0.5" width="{width - 1}" height="{height - 1}" rx="12" fill="#ffffff" stroke="#dee2e6"/>"""));
        svg.AppendLine("  <text x=\"18\" y=\"30\" font-size=\"18\" font-weight=\"600\" fill=\"#212529\">Похожие замеры</text>");
        svg.AppendLine(FormattableString.Invariant($"""  <text x="18" y="48" font-size="13" fill="#6c757d">Ближайшие пары к #{measurementId}</text>"""));

        if (similarMeasurements.Count == 0)
        {
            svg.AppendLine("  <text x=\"18\" y=\"86\" font-size=\"14\" fill=\"#6c757d\">Нет данных о похожих замерах</text>");
        }
        else
        {
            var startY = headerHeight;
            var index = 0;

            foreach (var similarMeasurement in similarMeasurements)
            {
                var rectY = startY + index * rowHeight;
                var rectHeight = rowHeight - rowSpacing;
                var rmseText = FormatRmse(similarMeasurement.RmseSection1);
                var palette = GetSimilarityPalette(similarMeasurement.RmseSection1);

                svg.AppendLine(FormattableString.Invariant($"""  <rect x="{horizontalPadding}" y="{rectY}" width="{width - horizontalPadding * 2}" height="{rectHeight}" rx="10" fill="{palette.Background}" stroke="{palette.Border}"/>"""));

                var textBaseline = rectY + rectHeight / 2 + 6;
                svg.AppendLine(FormattableString.Invariant($"""  <text x="{horizontalPadding + 12}" y="{textBaseline}" font-size="15" font-weight="600" fill="{palette.Text}">#{similarMeasurement.MeasurementId}</text>"""));

                var detailsBaseline = rectY + rectHeight - 10;
                svg.AppendLine(FormattableString.Invariant($"""  <text x="{horizontalPadding + 12}" y="{detailsBaseline}" font-size="12" fill="{palette.Text}">RMSE первой секции</text>"""));

                var chipText = FormattableString.Invariant($"RMSE {rmseText}");
                var chipWidth = Math.Max(88, 20 + (int)Math.Ceiling(chipText.Length * 7.2));
                var chipHeight = 26;
                var chipX = width - horizontalPadding - chipWidth;
                var chipY = rectY + (rectHeight - chipHeight) / 2;

                svg.AppendLine(FormattableString.Invariant($"""  <rect x="{chipX}" y="{chipY}" width="{chipWidth}" height="{chipHeight}" rx="13" fill="#ffffff" stroke="{palette.Border}"/>"""));
                var chipTextBaseline = chipY + chipHeight / 2 + 5;
                svg.AppendLine(FormattableString.Invariant($"""  <text x="{chipX + chipWidth / 2}" y="{chipTextBaseline}" font-size="12" font-weight="600" fill="{palette.Text}" text-anchor="middle">{chipText}</text>"""));

                index++;
            }
        }

        svg.AppendLine("</svg>");

        return svg.ToString();
    }

    private static SimilarityPalette GetSimilarityPalette(double rmse)
    {
        if (rmse < 5)
        {
            return new SimilarityPalette("#d1e7dd", "#badbcc", "#0f5132");
        }

        if (rmse > 20)
        {
            return new SimilarityPalette("#f8d7da", "#f5c2c7", "#842029");
        }

        return new SimilarityPalette("#fff3cd", "#ffe69c", "#664d03");
    }

    private static string FormatRmse(double rmse)
    {
        return string.Format(CultureInfo.InvariantCulture, "{0:0.###}", rmse);
    }

    private readonly record struct SimilarityPalette(string Background, string Border, string Text);
}
