using System.Xml.Linq;
using AwesomeAssertions;
using Server.Adapters.Driven.Plotting;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(PlottingAdapter))]
public sealed class PlottingAdapterTests
{
    private const double PmaxWatt = 2.5;
    private const double Mu = 20;
    private const double Perveance = 0.002;
    private const double AnodeCurrent = 7.3;
    private const double Transconductance = 2.15;

    private readonly PlottingAdapter _adapter = new();

    [Test]
    public void RenderMeasurementPlot_RendersWellFormedSvgWithSeriesLabels()
    {
        var anodeCurves = new TriodeAnodeCurves(PmaxWatt, CreateTriodePoints());
        var gridCurves = anodeCurves.ConvertToGridCurves();
        var request = new MeasurementPlotRenderRequest(
            AnodeCurves: anodeCurves,
            GridCurves: gridCurves,
            AxisRanges: new PlotAxisRanges(
                AnodeCurvesMinX: anodeCurves.MinX,
                AnodeCurvesMaxX: anodeCurves.MaxX,
                AnodeCurvesMaxY: anodeCurves.MaxY,
                GridCurvesMinX: gridCurves.MinX,
                GridCurvesMaxX: gridCurves.MaxX),
            QuickTest: new QuickTestValues(Ua: 160, Ug: -2, Ia: AnodeCurrent, Ia2: null, Transconductance: Transconductance, Transconductance2: null),
            Layout: new PlotLayout(MergeVertical: false, LegendVertical: true, Width: 525, Height: 400));

        var svg = _adapter.RenderMeasurementPlot(request);

        var text = ParseText(svg);
        text.Should().Contain(anodeCurves.CurveTitle)
            .And.Contain(gridCurves.CurveTitle)
            .And.Contain(anodeCurves.Curve1Name)
            .And.Contain($"{anodeCurves.SteppingVariableName} = {anodeCurves.CurveSets.First().VSteppingValue:N1}")
            .And.Contain($"MaxP = {PmaxWatt:F1}W")
            .And.Contain("Vanode: 160 V")
            .And.Contain($"Ianode: {AnodeCurrent:F1} mA")
            .And.Contain($"Gm: {Transconductance:F2} mA/V");
    }

    [Test]
    public void RenderStatus_RendersWellFormedSvgWithStatusText()
    {
        var svg = _adapter.RenderStatus(nameof(MeasurementState.Sold));

        ParseText(svg).Should().Contain(nameof(MeasurementState.Sold));
    }

    [TestCase(3.0, "EXCELLENT")]
    [TestCase(22.0, "GOOD")]
    [TestCase(28.0, "DECENT")]
    public void RenderTubeInfo_RendersStateCodeAndSectionBalanceBadge(double rmse, string expectedBadge)
    {
        var svg = _adapter.RenderTubeInfo(new TubeInfoRenderRequest("1965_12 R", ProductState.New, rmse));

        ParseText(svg).Should().Contain(nameof(ProductState.New))
            .And.Contain("1965")
            .And.Contain("12")
            .And.Contain(expectedBadge);
    }

    [Test]
    public void RenderTubeInfo_WithoutRmse_OmitsSectionBalanceBadge()
    {
        var svg = _adapter.RenderTubeInfo(new TubeInfoRenderRequest("1965", ProductState.Used, null));

        ParseText(svg).Should().NotContain("BALANCE");
    }

    private static string ParseText(string svg) =>
        string.Join(" ", XDocument.Parse(svg).Descendants().Select(static x => x.Value));

    private static Dictionary<int, MeasurementPoint[]> CreateTriodePoints()
    {
        int[] gridVoltages = [-4, -3, -2, -1, 0];
        return gridVoltages
            .Select((gridVoltage, index) => (index, points: Enumerable.Range(0, 16)
                .Select(step => 20.0 * step)
                .Select(anodeVoltage => new MeasurementPoint(
                    Ia: Perveance * Math.Pow(Math.Max(0, anodeVoltage + Mu * gridVoltage), 1.5),
                    Is: 0,
                    Vg: gridVoltage,
                    Va: anodeVoltage,
                    Vs: 0,
                    Vf: 0))
                .ToArray()))
            .ToDictionary(static x => x.index, static x => x.points);
    }
}
