using NUnit.Framework;
using Server.Application.Services.Measurement;
using Server.Application.Services.Measurement.MeasurementTypes;
using Server.Application.Services.Measurement.MeasurementTypes.Base;
using Server.Application.Services.Measurement.QuickTest;

namespace Tests.Services.Measurement.QuickTest;

[TestFixture]
[TestOf(typeof(QuickTestParser))]
public class QuickTestParserTest
{
    private static readonly Dictionary<int, MeasurementPoint[]> MinimalMeasurementPoints = new()
    {
        { 0, new[] { new MeasurementPoint(0, 0, 0, 0, 0, 0) } }
    };

    private const string TriodeSample = """
20.06.2025 13:09:07   uTracer3, GUI  V3.11  Triode Quick Test

SECTION 1

Test conditions:
Va  : 120 (V)                Swing +/- 12 V (10%)
Vg  : -30 (V)                Swing +/- 3 V (10%)

Test results:
Ia  : 271.83 (mA)            97 % of nominal 280 (mA)
Ra  : 111 (ohm)              0 % of nominal 106 (kohm)          Ra = dVa/dIa
Gm  : 20.36 (mA/V)           102 % of nominal 20 (mA/V)         Gm = dIa/dVg
mu  : 2 (-)                  113 % of nominal 2 (-)             mu = Gm*Ra


SECTION 2

Test conditions:
Va  : 120 (V)                Swing +/- 12 V (10%)
Vg  : -30 (V)                Swing +/- 3 V (10%)

Test results:
Ia  : 0 (mA)                 0 % of nominal 280 (mA)
Ra  : > 1M (ohm)             --- % of nominal 106 (kohm)        Ra = dVa/dIa
Gm  : 0 (mA/V)               0 % of nominal 20 (mA/V)           Gm = dIa/dVg
mu  : N.A. (-)               --- % of nominal 2 (-)             mu = Gm*Ra
""";

    private const string DoubleTriodeSample = """
20.06.2025 13:09:07   uTracer3, GUI  V3.11  Triode Quick Test

SECTION 1

Test conditions:
Va  : 250 (V)                Swing +/- 25 V (10%)
Vg  : -8 (V)                 Swing +/- 0,8 V (10%)

Test results:
Ia  : 8.27 (mA)              100 % of nominal 8.27 (mA)
Ra  : 7.51 (kohm)            98 % of nominal 7.66 (kohm)        Ra = dVa/dIa
Gm  : 2.58 (mA/V)            102 % of nominal 2.53 (mA/V)       Gm = dIa/dVg
mu  : 19 (-)                 99 % of nominal 19.2 (-)           mu = Gm*Ra

SECTION 2

Test conditions:
Va  : 250 (V)                Swing +/- 25 V (10%)
Vg  : -8 (V)                 Swing +/- 0,8 V (10%)

Test results:
Ia  : 7.86 (mA)              95 % of nominal 8.27 (mA)
Ra  : 7.72 (kohm)            101 % of nominal 7.66 (kohm)       Ra = dVa/dIa
Gm  : 2.51 (mA/V)            99 % of nominal 2.53 (mA/V)        Gm = dIa/dVg
mu  : 19 (-)                 99 % of nominal 19.2 (-)           mu = Gm*Ra
""";

    private const string PentodeSample = """
27.05.2025 17:53:37   uTracer3, GUI  V3.11  Pentode Quick Test

Test conditions:
Va  : 200 (V)                Swing +/- 50 V (25%)
Vs  : 135 (V)                Swing +/- 33,75 V (25%)
Vg  : -3 (V)                 Swing +/- 0,75 V (25%)

Test results:
Ia  : 4.93 (mA)              90 % of nominal 5.5 (mA)
Gma : 1.72 (mA/V)            93 % of nominal 1.85 (mA/V)        Gma = dIa/dVg
Ra  : 654.57 (kohm)          131 % of nominal 500 (kohm)        Ra  = dVa/dIa
mu1 : 1124 (-)               112 % of nominal 1000 (-)          mu1 = Gma*Ra
Gm1 : 83 (uA/V)              Gm1 = dIa/dVs

Is  : 0.86 (mA)              82 % of nominal 1.05 (mA)
Gms : 312 (uA/V)             Gms = dIs/dVg
Rs  : 63.31 (kohm)           Rs  = dVs/dIs
mu2 : 20 (-)                 mu2 = Gms*Rs
Gm2 : 0 (uA/V)               Gm2 = dIs/dVa
""";

    [Test]
    public void Parse_TriodeQuickTest_ReturnsSectionsAndPrettyResult()
    {
        var parser = new QuickTestParser();
        var measurementType = new TriodeAnodeCurves(1, MinimalMeasurementPoints);

        var result = parser.Parse(TriodeSample, measurementType);

        Assert.That(result.TubeType, Is.EqualTo(TubeType.Triode));
        Assert.That(result.Section1.Va, Is.EqualTo(120));
        Assert.That(result.Section1.Vg, Is.EqualTo(-30));
        Assert.That(result.Section1.VaSwingPercent, Is.EqualTo(10));
        Assert.That(result.Section1.Ia, Is.EqualTo(0.27183).Within(1e-5));
        Assert.That(result.Section1.IaNominal, Is.EqualTo(0.28).Within(1e-5));
        Assert.That(result.Section1.Ra, Is.EqualTo(111));
        Assert.That(result.Section1.RaNominal, Is.EqualTo(106000));
        Assert.That(result.Section1.Gm, Is.EqualTo(0.02036).Within(1e-5));
        Assert.That(result.Section1.GmNominal, Is.EqualTo(0.02).Within(1e-5));
        Assert.That(result.Section1.Mu, Is.EqualTo(2));
        Assert.That(result.Section1.MuNominal, Is.EqualTo(2));

        Assert.That(result.Section2, Is.Not.Null);
        Assert.That(result.Section2!.Ia, Is.Zero);
        Assert.That(double.IsPositiveInfinity(result.Section2.Ra), Is.True);
        Assert.That(double.IsNaN(result.Section2.Mu), Is.True);

        Assert.That(result.PrettyQuickTestResult, Does.Contain("SECTION 1"));
        Assert.That(result.PrettyQuickTestResult, Does.Contain("Va  : 120 (V)"));
        Assert.That(result.PrettyQuickTestResult, Does.Contain("Ia  : 271.83 (mA)"));
        Assert.That(result.PrettyQuickTestResult, Does.Contain("mu  : 2 (-)"));
    }

    [Test]
    public void Parse_DoubleTriodeQuickTest_ReturnsTwoSections()
    {
        var parser = new QuickTestParser();
        var measurementType = new DoubleTriodeAnodeCurves(1, MinimalMeasurementPoints);

        var result = parser.Parse(DoubleTriodeSample, measurementType);

        Assert.That(result.TubeType, Is.EqualTo(TubeType.DoubleTriode));
        Assert.That(result.Section1.Ia, Is.EqualTo(0.00827).Within(1e-6));
        Assert.That(result.Section2, Is.Not.Null);
        Assert.That(result.Section2!.Ia, Is.EqualTo(0.00786).Within(1e-6));
        Assert.That(result.PrettyQuickTestResult, Does.Contain("SECTION 2"));
        Assert.That(result.PrettyQuickTestResult, Does.Contain("Va  : 250 (V)"));
    }

    [Test]
    public void Parse_PentodeQuickTest_ReturnsDetailsAndPrettyResult()
    {
        var parser = new QuickTestParser();
        var measurementType = new PentodeAnodeCurves(1, MinimalMeasurementPoints);

        var result = parser.Parse(PentodeSample, measurementType);

        Assert.That(result.TubeType, Is.EqualTo(TubeType.Pentode));
        Assert.That(result.Section1.Va, Is.EqualTo(200));
        Assert.That(result.Section1.Vg, Is.EqualTo(-3));
        Assert.That(result.Section1.Gm, Is.EqualTo(0.00172).Within(1e-6));
        Assert.That(result.Section1.Mu, Is.EqualTo(1124));
        Assert.That(result.Section2, Is.Not.Null);
        Assert.That(result.Section2!.Va, Is.EqualTo(135));
        Assert.That(result.Section2.Gm, Is.EqualTo(0.000312).Within(1e-7));

        Assert.That(result.PrettyQuickTestResult, Does.Contain("Vs  : 135 (V)"));
        Assert.That(result.PrettyQuickTestResult, Does.Contain("Gma = dIa/dVg"));
        Assert.That(result.PrettyQuickTestResult, Does.Contain("Gm1 : 83"));
        Assert.That(result.PrettyQuickTestResult, Does.Contain("Gm2 = dIs/dVa"));
    }
}
