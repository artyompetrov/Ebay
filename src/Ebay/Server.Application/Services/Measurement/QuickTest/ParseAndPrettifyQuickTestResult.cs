using System.Globalization;
using System.Text;

namespace Server.Application.Services.Measurement.QuickTest;

public record ParseAndPrettifyQuickTestResult(
    TubeType TubeType,
    SectionTest Section1,
    SectionTest? Section2
)
{
    public PentodeQuickTestDetails? PentodeDetails { get; init; }

    public string PrettyQuickTestResult
    {
        get
        {
            var culture = CultureInfo.GetCultureInfo("ru-RU");
            var builder = new StringBuilder();

            switch (TubeType)
            {
                case TubeType.Triode:
                    AppendTriodeSection(builder, Section1, 1, culture);

                    if (Section2 != null)
                    {
                        builder.AppendLine();
                        AppendTriodeSection(builder, Section2, 2, culture);
                    }

                    break;

                case TubeType.DoubleTriode:
                    AppendTriodeSection(builder, Section1, 1, culture);

                    if (Section2 == null)
                    {
                        break;
                    }

                    builder.AppendLine();
                    AppendTriodeSection(builder, Section2, 2, culture);
                    break;

                case TubeType.Pentode when PentodeDetails != null:
                    AppendPentode(builder, PentodeDetails, culture);
                    break;

                default:
                    AppendTriodeSection(builder, Section1, 1, culture);

                    if (Section2 != null)
                    {
                        builder.AppendLine();
                        AppendTriodeSection(builder, Section2, 2, culture);
                    }

                    break;
            }

            return builder.ToString().TrimEnd();
        }
    }

    private static void AppendTriodeSection(StringBuilder builder, SectionTest section, int sectionNumber, CultureInfo culture)
    {
        builder.AppendLine($"SECTION {sectionNumber}");
        builder.AppendLine();
        builder.AppendLine("Test conditions:");
        builder.AppendLine(BuildVoltageLine("Va", section.Va, section.VaSwingPercent, culture));
        builder.AppendLine(BuildVoltageLine("Vg", section.Vg, section.VgSwingPercent, culture));
        builder.AppendLine();
        builder.AppendLine("Test results:");
        builder.AppendLine(BuildResultLine(
            "Ia",
            FormatCurrent(section.Ia, culture),
            FormatPercent(section.Ia, section.IaNominal, culture),
            FormatCurrent(section.IaNominal, culture),
            null));
        builder.AppendLine(BuildResultLine(
            "Ra",
            FormatResistance(section.Ra, culture),
            FormatPercent(section.Ra, section.RaNominal, culture),
            FormatResistance(section.RaNominal, culture),
            "Ra = dVa/dIa"));
        builder.AppendLine(BuildResultLine(
            "Gm",
            FormatTransconductance(section.Gm, culture),
            FormatPercent(section.Gm, section.GmNominal, culture),
            FormatTransconductance(section.GmNominal, culture),
            "Gm = dIa/dVg"));
        builder.AppendLine(BuildResultLine(
            "mu",
            FormatMu(section.Mu, culture),
            FormatPercent(section.Mu, section.MuNominal, culture),
            FormatMu(section.MuNominal, culture),
            "mu = Gm*Ra"));
    }

    private static void AppendPentode(StringBuilder builder, PentodeQuickTestDetails details, CultureInfo culture)
    {
        builder.AppendLine("Test conditions:");
        builder.AppendLine(BuildVoltageLine("Va", details.Va, details.VaSwingPercent, culture));
        builder.AppendLine(BuildVoltageLine("Vs", details.Vs, details.VsSwingPercent, culture));
        builder.AppendLine(BuildVoltageLine("Vg", details.Vg, details.VgSwingPercent, culture));
        builder.AppendLine();
        builder.AppendLine("Test results:");
        builder.AppendLine(BuildResultLine(
            "Ia",
            FormatCurrent(details.Ia, culture),
            FormatPercent(details.Ia, details.IaNominal, culture),
            FormatCurrent(details.IaNominal, culture),
            null));
        builder.AppendLine(BuildResultLine(
            "Gma",
            FormatTransconductance(details.Gma, culture),
            FormatPercent(details.Gma, details.GmaNominal, culture),
            FormatTransconductance(details.GmaNominal, culture),
            "Gma = dIa/dVg"));
        builder.AppendLine(BuildResultLine(
            "Ra",
            FormatResistance(details.Ra, culture),
            FormatPercent(details.Ra, details.RaNominal, culture),
            FormatResistance(details.RaNominal, culture),
            "Ra  = dVa/dIa"));
        builder.AppendLine(BuildResultLine(
            "mu1",
            FormatMu(details.Mu1, culture),
            FormatPercent(details.Mu1, details.Mu1Nominal, culture),
            FormatMu(details.Mu1Nominal, culture),
            "mu1 = Gma*Ra"));
        builder.AppendLine(BuildResultLine(
            "Gm1",
            FormatTransconductance(details.Gm1, culture),
            null,
            null,
            "Gm1 = dIa/dVs"));
        builder.AppendLine();
        builder.AppendLine(BuildResultLine(
            "Is",
            FormatCurrent(details.Is, culture),
            FormatPercent(details.Is, details.IsNominal, culture),
            FormatCurrent(details.IsNominal, culture),
            null));
        builder.AppendLine(BuildResultLine(
            "Gms",
            FormatTransconductance(details.Gms, culture),
            null,
            null,
            "Gms = dIs/dVg"));
        builder.AppendLine(BuildResultLine(
            "Rs",
            FormatResistance(details.Rs, culture),
            null,
            null,
            "Rs  = dVs/dIs"));
        builder.AppendLine(BuildResultLine(
            "mu2",
            FormatMu(details.Mu2, culture),
            null,
            null,
            "mu2 = Gms*Rs"));
        builder.AppendLine(BuildResultLine(
            "Gm2",
            FormatTransconductance(details.Gm2, culture),
            null,
            null,
            "Gm2 = dIs/dVa"));
    }

    private static string BuildVoltageLine(string name, double value, double percent, CultureInfo culture)
    {
        var formattedValue = FormatVoltage(value, culture);
        var swingValue = Math.Abs(value) * percent / 100.0;
        var formattedSwing = FormatVoltage(swingValue, culture);
        var percentValue = double.IsNaN(percent) ? "---" : percent.ToString("0.##", culture);

        return $"{name.PadRight(4)}: {formattedValue.PadRight(24)}Swing +/- {formattedSwing} ({percentValue}%)";
    }

    private static string BuildResultLine(
        string name,
        string value,
        string? percent,
        string? nominal,
        string? explanation)
    {
        var builder = new StringBuilder();
        builder.Append(name.PadRight(4));
        builder.Append(": ");
        builder.Append(value);

        if (percent != null && nominal != null)
        {
            var spacing = Math.Max(1, 24 - value.Length);
            builder.Append(' ', spacing);
            builder.Append(percent == "---"
                ? "--- % of nominal "
                : $"{percent} % of nominal ");
            builder.Append(nominal);
        }

        if (!string.IsNullOrEmpty(explanation))
        {
            if (percent != null && nominal != null)
            {
                builder.Append("          ");
            }
            else
            {
                builder.Append(' ');
            }

            builder.Append(explanation);
        }

        return builder.ToString();
    }

    private static string FormatVoltage(double value, CultureInfo culture)
    {
        if (double.IsNaN(value))
        {
            return "N.A. (V)";
        }

        return $"{FormatNumber(value, culture)} (V)";
    }

    private static string FormatCurrent(double value, CultureInfo culture)
    {
        if (double.IsNaN(value))
        {
            return "N.A. (mA)";
        }

        var abs = Math.Abs(value);
        string unit;
        double displayValue;

        if (abs >= 1)
        {
            unit = "A";
            displayValue = value;
        }
        else if (abs >= 1e-3)
        {
            unit = "mA";
            displayValue = value * 1e3;
        }
        else
        {
            unit = "uA";
            displayValue = value * 1e6;
        }

        return $"{FormatNumber(displayValue, culture)} ({unit})";
    }

    private static string FormatResistance(double value, CultureInfo culture)
    {
        if (double.IsPositiveInfinity(value))
        {
            return "> 1M (ohm)";
        }

        if (double.IsNaN(value))
        {
            return "N.A. (ohm)";
        }

        var abs = Math.Abs(value);
        string unit;
        double displayValue;

        if (abs >= 1e6)
        {
            unit = "Mohm";
            displayValue = value / 1e6;
        }
        else if (abs >= 1e3)
        {
            unit = "kohm";
            displayValue = value / 1e3;
        }
        else
        {
            unit = "ohm";
            displayValue = value;
        }

        return $"{FormatNumber(displayValue, culture)} ({unit})";
    }

    private static string FormatTransconductance(double value, CultureInfo culture)
    {
        if (double.IsNaN(value))
        {
            return "N.A. (mA/V)";
        }

        var abs = Math.Abs(value);
        string unit;
        double displayValue;

        if (abs >= 1e-3)
        {
            unit = "mA/V";
            displayValue = value * 1e3;
        }
        else if (abs >= 1e-6)
        {
            unit = "uA/V";
            displayValue = value * 1e6;
        }
        else
        {
            unit = "A/V";
            displayValue = value;
        }

        return $"{FormatNumber(displayValue, culture)} ({unit})";
    }

    private static string FormatMu(double value, CultureInfo culture)
    {
        if (double.IsNaN(value))
        {
            return "N.A. (-)";
        }

        return $"{FormatNumber(value, culture)} (-)";
    }

    private static string FormatPercent(double value, double nominal, CultureInfo culture)
    {
        if (double.IsNaN(value) || double.IsNaN(nominal) || nominal == 0 || double.IsInfinity(value))
        {
            return "---";
        }

        var percent = value / nominal * 100.0;
        var rounded = Math.Round(percent, 0, MidpointRounding.AwayFromZero);
        return rounded.ToString("0", culture);
    }

    private static string FormatNumber(double value, CultureInfo culture)
    {
        return value.ToString(value % 1 == 0 ? "0" : "0.##", culture);
    }
}

public record PentodeQuickTestDetails(
    double Va,
    double VaSwingPercent,
    double Vs,
    double VsSwingPercent,
    double Vg,
    double VgSwingPercent,
    double Ia,
    double IaNominal,
    double Gma,
    double GmaNominal,
    double Ra,
    double RaNominal,
    double Mu1,
    double Mu1Nominal,
    double Gm1,
    double Is,
    double IsNominal,
    double Gms,
    double Rs,
    double Mu2,
    double Gm2);
