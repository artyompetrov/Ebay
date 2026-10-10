using AwesomeAssertions;
using Server.Domain.Measurements;
using Server.Domain.Measurements.Approximation;
using Server.Domain.Measurements.MeasurementTypes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(AnodeCurveModelBuilder))]
public sealed class AnodeCurveModelBuilderTests
{
    private const double Mu = 20;
    private const double Perveance = 0.002;
    private const double PmaxWatt = 100;
    private const double RelativeTolerance = 0.05;

    [Test]
    public void Build_ApproximatesCurrentAtWorkingPoint_CloseToMeasuredCurve()
    {
        var workingPoint = new ApproximationWorkingPoint(
            AnodeVoltage: 160,
            GridVoltage: -2,
            AnodeVoltageHalfWidth: 40,
            GridVoltageHalfWidth: 1,
            NominalCurrent: Current(anodeVoltage: 160, gridVoltage: -2));
        var anodeCurves = new TriodeAnodeCurves(PmaxWatt, CreateTriodePoints());

        var model = AnodeCurveModelBuilder.Build(anodeCurves, static x => x.I1, workingPoint);

        model.IatWorkingPoint().Should().BeApproximately(
            workingPoint.NominalCurrent,
            workingPoint.NominalCurrent * RelativeTolerance);
    }

    private static Dictionary<int, MeasurementPoint[]> CreateTriodePoints()
    {
        int[] gridVoltages = [-4, -3, -2, -1, 0];
        return gridVoltages
            .Select((gridVoltage, index) => (index, points: Enumerable.Range(0, 16)
                .Select(step => 20.0 * step)
                .Select(anodeVoltage => new MeasurementPoint(
                    Ia: Current(anodeVoltage, gridVoltage),
                    Is: 0,
                    Vg: gridVoltage,
                    Va: anodeVoltage,
                    Vs: 0,
                    Vf: 0))
                .ToArray()))
            .ToDictionary(static x => x.index, static x => x.points);
    }

    private static double Current(double anodeVoltage, double gridVoltage) =>
        Perveance * Math.Pow(Math.Max(0, anodeVoltage + Mu * gridVoltage), 1.5);
}
