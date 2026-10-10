using ScottPlot;
using ScottPlot.PlotStyles;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Adapters.Driven.Plotting;

internal sealed class PlottingAdapter : IPlottingAdapter
{
    public string RenderMeasurementPlot(MeasurementPlotRenderRequest request) =>
        CreateMergedPlot(
            mergeVertical: request.Layout.MergeVertical,
            legendVertical: request.Layout.LegendVertical,
            width: request.Layout.Width,
            height: request.Layout.Height,
            quickTestData: request.QuickTest,
            minMaxCoordinates: request.AxisRanges,
            anodeCurves: request.AnodeCurves,
            gridCurves: request.GridCurves);

    public string RenderStatus(string status) => StatusSvg(status);

    public string RenderTubeInfo(TubeInfoRenderRequest request) =>
        BuildTubeInfoSvg(
            manufactureCode: request.ManufactureCode,
            productState: request.ProductState,
            doubleTriodeSectionRmse: request.DoubleTriodeSectionRmse);

    private static string CreateMergedPlot(
        bool mergeVertical,
        bool legendVertical,
        int width,
        int height,
        QuickTestValues? quickTestData,
        PlotAxisRanges minMaxCoordinates,
        AnodeCurvesBase anodeCurves,
        GridCurvesBase gridCurves)
    {
        var plot1 = CreatePlot(
            curves: anodeCurves,
            legendVertical: legendVertical,
            width: width,
            height: height,
            curvesMinX: minMaxCoordinates.AnodeCurvesMinX,
            curvesMaxX: minMaxCoordinates.AnodeCurvesMaxX,
            curvesMaxY: minMaxCoordinates.AnodeCurvesMaxY);

        var plot2 = CreatePlot(
            curves: gridCurves,
            legendVertical: legendVertical,
            width: width,
            height: height,
            curvesMinX: minMaxCoordinates.GridCurvesMinX,
            curvesMaxX: minMaxCoordinates.GridCurvesMaxX,
            curvesMaxY: minMaxCoordinates.AnodeCurvesMaxY /*используем анодный максимум, чтобы было симметрично*/);

        var quickTestSvg = quickTestData != null ? QuickTestSvg(quickTestData) : null;

        var result = SvgMerger.MergeSvgs(
            mergeVertical: mergeVertical,
            new SvgMerger.Svg(quickTestSvg, false),
            new SvgMerger.Svg(plot1, true),
            new SvgMerger.Svg(plot2, true));

        if (!anodeCurves.HasValuesAbovePmax && !gridCurves.HasValuesAbovePmax)
        {
            result = SvgMerger.MergeSvgs(
                mergeVertical: true,
                new SvgMerger.Svg(result, true),
                new SvgMerger.Svg(NotEnoughTesterRangeSvg(anodeCurves.PmaxWatt, gridCurves.PmaxWatt), true));
        }

        return result;
    }

    private static string CreatePlot(
        MeasurementTypeBase curves,
        bool legendVertical,
        int width,
        int height,
        double curvesMinX,
        double curvesMaxX,
        double curvesMaxY)
    {
        var plt = new Plot();
        plt.SetStyle(
            new Light
            {
                FigureBackgroundColor = new Color(red: 0, green: 0, blue: 0, alpha: 0),
                DataBackgroundColor = new Color(red: 0, green: 0, blue: 0, alpha: 0),
                LegendBackgroundColor = new Color(red: 0, green: 0, blue: 0, alpha: 0),
                LegendOutlineColor = new Color(red: 0, green: 0, blue: 0)
            });
        var legendItems = new List<LegendItem>();

        var section1LinePattern = LinePattern.Solid;
        var section1MarkerShape = MarkerShape.FilledCircle;
        var section2LinePattern = LinePattern.Dotted;
        var section2MarkerShape = MarkerShape.OpenCircle;
        var lineWidth = 1;
        var markerSize = 5;

        foreach (var curveSet in curves.CurveSets)
        {
            var scatter1 = plt.Add.Scatter(
                curveSet.V.Zip(curveSet.I1)
                    .Select(x => new Coordinates(x: x.First, y: x.Second)).ToList());
            scatter1.Smooth = true;
            scatter1.LinePattern = section1LinePattern;
            scatter1.MarkerShape = section1MarkerShape;
            scatter1.MarkerSize = markerSize;
            scatter1.LineWidth = lineWidth;

            legendItems.Add(
                new LegendItem
                {
                    LabelText = $"{curves.SteppingVariableName} = {curveSet.VSteppingValue:N1}",
                    LineColor = scatter1.Color,
                    LinePattern = LinePattern.Solid,
                    LineWidth = lineWidth
                });

            if (curveSet.I2 != null)
            {
                var scatter2 = plt.Add.Scatter(
                    curveSet.V.Zip(curveSet.I2)
                        .Select(x => new Coordinates(x: x.First, y: x.Second)).ToList());
                scatter2.Smooth = true;
                scatter2.LinePattern = section2LinePattern;
                scatter2.MarkerShape = section2MarkerShape;
                scatter2.Color = scatter1.Color;
                scatter2.MarkerSize = markerSize;
                scatter2.LineWidth = lineWidth;
            }
        }

        legendItems.Add(
            new LegendItem
            {
                LabelText = curves.Curve1Name,
                LinePattern = section1LinePattern,
                MarkerShape = section1MarkerShape,
                MarkerSize = markerSize,
                LineWidth = lineWidth,
                MarkerFillColor = new Color(0, 0, 0)
            });

        if (curves.Curve2Name != null)
        {
            legendItems.Add(
                new LegendItem
                {
                    LabelText = curves.Curve2Name,
                    LinePattern = section2LinePattern,
                    MarkerShape = section2MarkerShape,
                    MarkerSize = markerSize,
                    LineWidth = lineWidth,
                    MarkerFillColor = new Color(0, 0, 0)
                });
        }

        if (curves.PlotPmax)
        {
            var func = plt.Add.Function(curves.MaxI);
            func.MinX = 0.1;
            func.LineColor = new Color(255, 0, 0);
            func.LineWidth = 3;
            legendItems.Add(
                new LegendItem
                {
                    LabelText = $"MaxP = {curves.PmaxWatt:F1}W",
                    LineColor = func.LineColor,
                    LineWidth = func.LineWidth,
                });
        }

        plt.Axes.SetLimits(bottom: 0, left: curvesMinX, top: curvesMaxY, right: curvesMaxX);
        plt.XLabel(curves.XLabel);
        plt.YLabel(curves.YLabel);
        plt.Title(curves.CurveTitle);

        plt.Legend.ManualItems = legendItems;
        plt.Legend.ShadowColor = new Color(red: 0, green: 0, blue: 0, alpha: 0);

        plt.ShowLegend(legendVertical ? Edge.Right : Edge.Bottom);

        return plt.GetSvgXml(width: width, height: height);
    }

    private static string NotEnoughTesterRangeSvg(double pmaxWatt1, double pmaxWatt2)
    {
        var pmaxWatt = Math.Max(pmaxWatt1, pmaxWatt2);
        var quickTestSvg = $"""
                            <svg xmlns="http://www.w3.org/2000/svg" width="950" height="24">
                              <!-- маленький жёлтый треугольник -->
                              <polygon points="5,20 12,6 19,20" fill="yellow" stroke="black" stroke-width="1"/>
                              <!-- восклицательный знак -->
                              <text x="12" y="18" text-anchor="middle" font-size="12" font-family="monospace" fill="black">!</text>

                              <!-- весь текст в одну строку -->
                              <text x="28" y="17" font-size="12" font-family="monospace" fill="black">
                                uTracer 3+ range (Anode/Screen: 0..400V@600mA, Grid: 0..–50V) is not sufficient to cover full operating range of this high-power tube ({pmaxWatt:F1}W). That's why the maximum load line is not visible. But you can still evaluate tube health.
                              </text>
                            </svg>
                            """;
        return quickTestSvg;
    }

    private static string QuickTestSvg(QuickTestValues quickTest)
    {
        var lineHeight = 16;

        var lines = new List<string>();
        var lineIndex = 1;

        void AddLine(string text, bool bold = false, string? fill = null)
        {
            var fillAttribute = fill == null ? string.Empty : $" fill=\"{fill}\"";
            var weightAttribute = bold ? " font-weight=\"bold\"" : string.Empty;

            lines.Add(
                $"""<tspan x="10"{fillAttribute}{weightAttribute} y="{lineHeight + lineIndex * lineHeight}">{text}</tspan>""");
            lineIndex++;
        }

        void AddSpacer()
        {
            lineIndex++;
        }

        AddLine("Measurement point:");
        AddLine($"Vanode: {quickTest.Ua:F0} V", bold: true);
        AddLine($"Vgrid: {quickTest.Ug:F1} V", bold: true);

        AddSpacer();
        AddLine("Anode current:");
        AddLine($"Ianode{(quickTest.Ia2.HasValue ? "1" : string.Empty)}: {quickTest.Ia:F1} mA", bold: true, fill: "#8B2E2E");

        if (quickTest.Ia2 != null)
        {
            AddLine($"Ianode2: {quickTest.Ia2.Value:F1} mA", bold: true, fill: "#8B2E2E");
        }

        AddSpacer();
        AddLine("Transconductance:");
        AddLine($"Gm{(quickTest.Transconductance2.HasValue ? "1" : string.Empty)}: {quickTest.Transconductance:F2} mA/V", bold: true, fill: "#8B2E2E");
        if (quickTest.Transconductance2 != null)
        {
            AddLine($"Gm2: {quickTest.Transconductance2.Value:F2} mA/V", bold: true, fill: "#8B2E2E");
        }

        var tspans = string.Join("\n", values: lines);

        var quickTestSvg = $"""
                            <svg width="160" height="{lineHeight + (lineIndex - 1) * lineHeight}" xmlns="http://www.w3.org/2000/svg">
                                <text font-size="14" fill="black" xml:space="preserve" font-family="monospace">
                                    {tspans}
                                </text>
                            </svg>
                            """;
        return quickTestSvg;
    }

    private static string StatusSvg(string text)
    {
        return $"""
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="30">
                    <text x="10" y="20" font-size="20" fill="black">{text}</text>
                </svg>
                """;
    }

    private static string BuildTubeInfoSvg(
        string manufactureCode,
        ProductState productState,
        double? doubleTriodeSectionRmse)
    {
        var manufactureCodeSplited = manufactureCode.Split(['_', ' '], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        string? badgeText = null;
        string? badgeSub = null;
        var badgeFill = "none";

        if (doubleTriodeSectionRmse is { } rmse)
        {
            switch (rmse)
            {
                case < 5:
                    badgeText = "EXCELLENT";
                    badgeSub = "(&lt; 5%)";
                    badgeFill = "#16a34a";
                    break;
                case < 10:
                    badgeText = "EXCELLENT";
                    badgeSub = "(&lt; 10%)";
                    badgeFill = "#16a34a";
                    break;
                case < 15:
                    badgeText = "GOOD";
                    badgeSub = "(&lt; 15%)";
                    badgeFill = "#16a34a";
                    break;
                case < 20:
                    badgeText = "GOOD";
                    badgeSub = "(&lt; 20%)";
                    badgeFill = "#16a34a";
                    break;
                case < 25:
                    badgeText = "GOOD";
                    badgeSub = "(&lt; 25%)";
                    badgeFill = "#16a34a";
                    break;
                case < 30:
                    badgeText = "DECENT";
                    badgeSub = "(&lt; 30%)";
                    badgeFill = "#16a34a";
                    break;
                default:
                    break;
            }
        }

        var svgHeight = badgeText is null ? 75 + manufactureCodeSplited.Length * 15 : 155 + manufactureCodeSplited.Length * 15;

        var yPosition = 65;
        var manufactureCodePart = string.Join("\n", manufactureCodeSplited.Select(x => $"<text x=\"5\" y=\"{yPosition += 15}\" class=\"important\">{x}</text>"));

        var badge = badgeText is null
            ? ""
            : $"""
                <rect x="0" y="{yPosition += 15}" width="80" height="70" rx="8" fill="{badgeFill}"/>
                <text x="5" y="{yPosition += 15}" class="badgeText">{badgeText}</text>
                <text x="5" y="{yPosition += 15}" class="badgeText">SECTION</text>
                <text x="5" y="{yPosition += 15}" class="badgeText">BALANCE!</text>
                <text x="5" y="{yPosition += 15}" class="badgeText">{badgeSub}</text>
               """;

        return $$"""
                  <svg xmlns="http://www.w3.org/2000/svg"
                       width="80" height="{{svgHeight}}" viewBox="0 0 80 {{svgHeight}}">
                    <defs>
                      <style>
                        .important     { font: 700 13px 'Segoe UI', sans-serif; fill: #0f172a; }
                        .label     { font: 600 13px 'Segoe UI', sans-serif; fill: #475569; }
                        .value     { font: 400 13px 'Consolas', monospace; fill:  #0f172a; }
                        .notImportant { font: 400 13px 'Segoe UI', sans-serif; fill: #0f172a; }
                        .badgeText { font: 700 13px 'Segoe UI', sans-serif; fill: #ffffff; }
                      </style>
                    </defs>
                    
                    <text x="5" y="20" class="label">State:</text>
                    <text x="5" y="35" class="important">{{productState}}</text>
                    
                    <text x="5" y="65" class="label">Date/code:</text>
                    {{manufactureCodePart}}
                    {{badge}}
                    </svg>
                  """;
    }
}
