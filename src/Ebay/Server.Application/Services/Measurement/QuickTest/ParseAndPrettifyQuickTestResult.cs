using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace Server.Application.Services.Measurement.QuickTest;

public sealed record ParseAndPrettifyQuickTestResult
{
    private readonly IReadOnlyDictionary<string, double> _values;

    public ParseAndPrettifyQuickTestResult(
        TubeType tubeType,
        SectionTest section1,
        SectionTest? section2,
        IReadOnlyDictionary<string, double> values)
    {
        ArgumentNullException.ThrowIfNull(values);

        TubeType = tubeType;
        Section1 = section1;
        Section2 = section2;
        _values = values;
    }

    public TubeType TubeType { get; init; }

    public SectionTest Section1 { get; init; }

    public SectionTest? Section2 { get; init; }

    public string PrettyQuickTestResult
    {
        get
        {
            var culture = CultureInfo.InvariantCulture;
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

                case TubeType.DoubleTriode when Section2 != null:
                    AppendTriodeSection(builder, Section1, 1, culture);
                    builder.AppendLine();
                    AppendTriodeSection(builder, Section2, 2, culture);
                    break;

                case TubeType.DoubleTriode:
                    throw new InvalidOperationException("Double triode quick test must contain two sections.");

                case TubeType.Pentode when Section2 != null:
                    AppendPentode(builder, culture);
                    break;

                default:
                    throw new InvalidOperationException($"Unsupported tube type '{TubeType}'.");
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

    private void AppendPentode(StringBuilder builder, CultureInfo culture)
    {
        var section2 = Section2 ?? throw new InvalidOperationException("Pentode quick test must contain two sections.");

        builder.AppendLine("Test conditions:");
        builder.AppendLine(BuildVoltageLine("Va", Section1.Va, Section1.VaSwingPercent, culture));
        builder.AppendLine(BuildVoltageLine("Vs", section2.Va, section2.VaSwingPercent, culture));
        builder.AppendLine(BuildVoltageLine("Vg", Section1.Vg, Section1.VgSwingPercent, culture));
        builder.AppendLine();
        builder.AppendLine("Test results:");
        builder.AppendLine(BuildResultLine(
            "Ia",
            FormatCurrent(Section1.Ia, culture),
            FormatPercent(Section1.Ia, Section1.IaNominal, culture),
            FormatCurrent(Section1.IaNominal, culture),
            null));
        builder.AppendLine(BuildResultLine(
            "Gma",
            FormatTransconductance(Section1.Gm, culture),
            FormatPercent(Section1.Gm, Section1.GmNominal, culture),
            FormatTransconductance(Section1.GmNominal, culture),
            "Gma = dIa/dVg"));
        builder.AppendLine(BuildResultLine(
            "Ra",
            FormatResistance(Section1.Ra, culture),
            FormatPercent(Section1.Ra, Section1.RaNominal, culture),
            FormatResistance(Section1.RaNominal, culture),
            "Ra  = dVa/dIa"));
        builder.AppendLine(BuildResultLine(
            "mu1",
            FormatMu(Section1.Mu, culture),
            FormatPercent(Section1.Mu, Section1.MuNominal, culture),
            FormatMu(Section1.MuNominal, culture),
            "mu1 = Gma*Ra"));
        builder.AppendLine(BuildResultLine(
            "Gm1",
            FormatTransconductance(GetValue("Gm1"), culture),
            null,
            null,
            "Gm1 = dIa/dVs"));
        builder.AppendLine();
        builder.AppendLine(BuildResultLine(
            "Is",
            FormatCurrent(section2.Ia, culture),
            FormatPercent(section2.Ia, section2.IaNominal, culture),
            FormatCurrent(section2.IaNominal, culture),
            null));
        builder.AppendLine(BuildResultLine(
            "Gms",
            FormatTransconductance(section2.Gm, culture),
            null,
            null,
            "Gms = dIs/dVg"));
        builder.AppendLine(BuildResultLine(
            "Rs",
            FormatResistance(section2.Ra, culture),
            null,
            null,
            "Rs  = dVs/dIs"));
        builder.AppendLine(BuildResultLine(
            "mu2",
            FormatMu(section2.Mu, culture),
            null,
            null,
            "mu2 = Gms*Rs"));
        builder.AppendLine(BuildResultLine(
            "Gm2",
            FormatTransconductance(GetValue("Gm2"), culture),
            null,
            null,
            "Gm2 = dIs/dVa"));
    }

    private double GetValue(string key)
    {
        if (_values.TryGetValue(key, out var value))
        {
            return value;
        }

        throw new InvalidOperationException($"Value '{key}' is missing in quick test results.");
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
