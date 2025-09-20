using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Server.Application.Services.Measurement.MeasurementTypes;
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.QuickTest;

public class QuickTestParser
{
    private static readonly CultureInfo InvariantCulture = CultureInfo.InvariantCulture;

    public ParseAndPrettifyQuickTestResult Parse(string quickTestOriginal, MeasurementTypeBase measurementType)
    {
        ArgumentNullException.ThrowIfNull(quickTestOriginal);
        ArgumentNullException.ThrowIfNull(measurementType);

        var normalized = quickTestOriginal.Replace("\r\n", "\n");
        var values = ParseQuickTestValues(normalized);

        return measurementType switch
        {
            TriodeAnodeCurves => CreateTriodeResult(values, TubeType.Triode),
            DoubleTriodeAnodeCurves => CreateTriodeResult(values, TubeType.DoubleTriode),
            PentodeAnodeCurves => CreatePentodeResult(values),
            _ => throw new ArgumentException($"The type {measurementType.GetType().Name} is not supported.")
        };
    }

    private static ParseAndPrettifyQuickTestResult CreateTriodeResult(Dictionary<string, double> values, TubeType tubeType)
    {
        var section1 = CreateSection(values, "S1_");
        SectionTest? section2 = null;

        if (HasSection(values, "S2_"))
        {
            section2 = CreateSection(values, "S2_");
        }

        if (tubeType == TubeType.DoubleTriode && section2 == null)
        {
            throw new FormatException("Double triode quick test must contain two sections.");
        }

        return new ParseAndPrettifyQuickTestResult(tubeType, section1, section2, null);
    }

    private static ParseAndPrettifyQuickTestResult CreatePentodeResult(Dictionary<string, double> values)
    {
        var details = new PentodeQuickTestDetails(
            Va: GetRequired(values, "Va"),
            VaSwingPercent: GetOptional(values, "VaSwingPercent"),
            Vs: GetOptional(values, "Vs"),
            VsSwingPercent: GetOptional(values, "VsSwingPercent"),
            Vg: GetRequired(values, "Vg"),
            VgSwingPercent: GetOptional(values, "VgSwingPercent"),
            Ia: GetOptional(values, "Ia"),
            IaNominal: GetOptional(values, "IaNominal"),
            Gma: GetOptional(values, "Gma"),
            GmaNominal: GetOptional(values, "GmaNominal"),
            Ra: GetOptional(values, "Ra"),
            RaNominal: GetOptional(values, "RaNominal"),
            Mu1: GetOptional(values, "Mu1"),
            Mu1Nominal: GetOptional(values, "Mu1Nominal"),
            Gm1: GetOptional(values, "Gm1"),
            Is: GetOptional(values, "Is"),
            IsNominal: GetOptional(values, "IsNominal"),
            Gms: GetOptional(values, "Gms"),
            Rs: GetOptional(values, "Rs"),
            Mu2: GetOptional(values, "Mu2"),
            Gm2: GetOptional(values, "Gm2"));

        var section1 = new SectionTest(
            Va: details.Va,
            Vg: details.Vg,
            VaSwingPercent: details.VaSwingPercent,
            VgSwingPercent: details.VgSwingPercent,
            Ia: details.Ia,
            IaNominal: details.IaNominal,
            Ra: details.Ra,
            RaNominal: details.RaNominal,
            Gm: details.Gma,
            GmNominal: details.GmaNominal,
            Mu: details.Mu1,
            MuNominal: details.Mu1Nominal);

        var section2 = new SectionTest(
            Va: details.Vs,
            Vg: details.Vg,
            VaSwingPercent: details.VsSwingPercent,
            VgSwingPercent: details.VgSwingPercent,
            Ia: details.Is,
            IaNominal: details.IsNominal,
            Ra: details.Rs,
            RaNominal: double.NaN,
            Gm: details.Gms,
            GmNominal: double.NaN,
            Mu: details.Mu2,
            MuNominal: double.NaN);

        return new ParseAndPrettifyQuickTestResult(TubeType.Pentode, section1, section2, details);
    }

    private static SectionTest CreateSection(Dictionary<string, double> values, string prefix)
    {
        if (!HasSection(values, prefix))
        {
            throw new FormatException($"Section '{prefix}' is missing.");
        }

        return new SectionTest(
            Va: GetRequired(values, prefix + "Va"),
            Vg: GetRequired(values, prefix + "Vg"),
            VaSwingPercent: GetOptional(values, prefix + "VaSwingPercent"),
            VgSwingPercent: GetOptional(values, prefix + "VgSwingPercent"),
            Ia: GetOptional(values, prefix + "Ia"),
            IaNominal: GetOptional(values, prefix + "IaNominal"),
            Ra: GetOptional(values, prefix + "Ra"),
            RaNominal: GetOptional(values, prefix + "RaNominal"),
            Gm: GetOptional(values, prefix + "Gm"),
            GmNominal: GetOptional(values, prefix + "GmNominal"),
            Mu: GetOptional(values, prefix + "Mu"),
            MuNominal: GetOptional(values, prefix + "MuNominal"));
    }

    private static bool HasSection(Dictionary<string, double> values, string prefix)
    {
        return values.Keys.Any(k => k.StartsWith(prefix, StringComparison.OrdinalIgnoreCase));
    }

    private static double GetRequired(Dictionary<string, double> values, string key)
    {
        if (!values.TryGetValue(key, out var value))
        {
            throw new FormatException($"Required value '{key}' is missing in quick test results.");
        }

        return value;
    }

    private static double GetOptional(Dictionary<string, double> values, string key)
    {
        return values.TryGetValue(key, out var value) ? value : double.NaN;
    }

    private static Dictionary<string, double> ParseQuickTestValues(string text)
    {
        var result = new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase);
        var lines = text.Split('\n');
        var sectionPrefix = string.Empty;

        foreach (var rawLine in lines)
        {
            var line = rawLine.Trim();
            if (string.IsNullOrEmpty(line))
            {
                continue;
            }

            if (line.StartsWith("SECTION", StringComparison.OrdinalIgnoreCase))
            {
                sectionPrefix = ParseSectionPrefix(line);
                continue;
            }

            if (!line.Contains(':', StringComparison.Ordinal))
            {
                continue;
            }

            var colonIndex = line.IndexOf(':');
            var keyPart = line[..colonIndex].Trim();

            var normalizedKey = NormalizeKey(keyPart);
            if (normalizedKey == null)
            {
                continue;
            }

            var valuePart = line[(colonIndex + 1)..];
            var key = sectionPrefix + normalizedKey;
            result[key] = ParseValueWithUnit(valuePart);

            if (normalizedKey is "Va" or "Vg" or "Vs")
            {
                var swingPercent = ParseSwingPercent(valuePart);
                if (!double.IsNaN(swingPercent))
                {
                    result[sectionPrefix + normalizedKey + "SwingPercent"] = swingPercent;
                }
            }
            else
            {
                var nominal = ParseNominalValue(valuePart);
                if (!double.IsNaN(nominal))
                {
                    result[sectionPrefix + normalizedKey + "Nominal"] = nominal;
                }
            }
        }

        return result;
    }

    private static string? NormalizeKey(string key)
    {
        if (string.IsNullOrWhiteSpace(key))
        {
            return null;
        }

        if (key.Equals("Va", StringComparison.OrdinalIgnoreCase))
        {
            return "Va";
        }

        if (key.Equals("Vg", StringComparison.OrdinalIgnoreCase))
        {
            return "Vg";
        }

        if (key.Equals("Vs", StringComparison.OrdinalIgnoreCase))
        {
            return "Vs";
        }

        if (key.Equals("Ia", StringComparison.OrdinalIgnoreCase))
        {
            return "Ia";
        }

        if (key.Equals("Is", StringComparison.OrdinalIgnoreCase))
        {
            return "Is";
        }

        if (key.Equals("Ra", StringComparison.OrdinalIgnoreCase))
        {
            return "Ra";
        }

        if (key.Equals("Rs", StringComparison.OrdinalIgnoreCase))
        {
            return "Rs";
        }

        if (key.Equals("Gm", StringComparison.OrdinalIgnoreCase))
        {
            return "Gm";
        }

        if (key.Equals("Gma", StringComparison.OrdinalIgnoreCase))
        {
            return "Gma";
        }

        if (key.Equals("Gm1", StringComparison.OrdinalIgnoreCase))
        {
            return "Gm1";
        }

        if (key.Equals("Gms", StringComparison.OrdinalIgnoreCase))
        {
            return "Gms";
        }

        if (key.Equals("Gm2", StringComparison.OrdinalIgnoreCase))
        {
            return "Gm2";
        }

        if (key.Equals("mu", StringComparison.OrdinalIgnoreCase))
        {
            return "Mu";
        }

        if (key.Equals("mu1", StringComparison.OrdinalIgnoreCase))
        {
            return "Mu1";
        }

        if (key.Equals("mu2", StringComparison.OrdinalIgnoreCase))
        {
            return "Mu2";
        }

        return null;
    }

    private static string ParseSectionPrefix(string line)
    {
        var parts = line.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        if (parts.Length < 2 || !int.TryParse(parts[1], NumberStyles.Integer, CultureInfo.InvariantCulture, out var sectionNumber))
        {
            throw new FormatException($"Cannot parse section number from '{line}'.");
        }

        return $"S{sectionNumber}_";
    }

    private static double ParseValueWithUnit(string valuePart)
    {
        var trimmed = valuePart.Trim();
        if (string.IsNullOrEmpty(trimmed))
        {
            throw new FormatException("Measurement line does not contain a value.");
        }

        if (trimmed.StartsWith('>'))
        {
            return double.PositiveInfinity;
        }

        if (trimmed.StartsWith("N.A.", StringComparison.OrdinalIgnoreCase))
        {
            return double.NaN;
        }

        var openIndex = trimmed.IndexOf('(');
        var closeIndex = trimmed.IndexOf(')', openIndex + 1);

        if (openIndex < 0 || closeIndex < 0)
        {
            throw new FormatException($"Cannot parse unit from '{trimmed}'.");
        }

        var valueString = trimmed[..openIndex].Trim();
        var unit = trimmed[(openIndex + 1)..closeIndex].Trim();

        var value = ParseNumber(valueString);
        return ConvertValue(unit, value);
    }

    private static double ParseNominalValue(string valuePart)
    {
        var index = valuePart.IndexOf("nominal", StringComparison.OrdinalIgnoreCase);
        if (index < 0)
        {
            return double.NaN;
        }

        var afterNominal = valuePart[(index + "nominal".Length)..];
        return ParseValueWithOptionalText(afterNominal);
    }

    private static double ParseValueWithOptionalText(string text)
    {
        var trimmed = text.Trim();
        if (string.IsNullOrEmpty(trimmed))
        {
            return double.NaN;
        }

        var openIndex = trimmed.IndexOf('(');
        var closeIndex = trimmed.IndexOf(')', openIndex + 1);
        if (openIndex < 0 || closeIndex < 0)
        {
            return double.NaN;
        }

        var valueString = trimmed[..openIndex].Trim();
        var unit = trimmed[(openIndex + 1)..closeIndex].Trim();

        if (valueString.StartsWith('>'))
        {
            return double.PositiveInfinity;
        }

        if (valueString.StartsWith("N.A.", StringComparison.OrdinalIgnoreCase))
        {
            return double.NaN;
        }

        var value = ParseNumber(valueString);
        return ConvertValue(unit, value);
    }

    private static double ParseSwingPercent(string valuePart)
    {
        var percentIndex = valuePart.LastIndexOf('%');
        if (percentIndex < 0)
        {
            return double.NaN;
        }

        var openIndex = valuePart.LastIndexOf('(', percentIndex);
        if (openIndex < 0)
        {
            return double.NaN;
        }

        var percentString = valuePart[(openIndex + 1)..percentIndex].Trim();

        return TryParseInvariant(percentString, out var percent)
            ? percent
            : double.NaN;
    }

    private static double ParseNumber(string value)
    {
        if (TryParseInvariant(value, out var result))
        {
            return result;
        }

        throw new FormatException($"Cannot parse numeric value '{value}'.");
    }

    private static bool TryParseInvariant(string value, out double result)
    {
        var normalized = value.Replace(',', '.');
        return double.TryParse(normalized, NumberStyles.Float, InvariantCulture, out result);
    }

    private static double ConvertValue(string unit, double value)
    {
        return unit switch
        {
            "A" => value,
            "mA" => value / 1000.0,
            "uA" => value / 1_000_000.0,
            "V" => value,
            "ohm" => value,
            "kohm" => value * 1000.0,
            "Mohm" => value * 1_000_000.0,
            "A/V" => value,
            "mA/V" => value / 1000.0,
            "uA/V" => value / 1_000_000.0,
            "(-)" => value,
            _ => value
        };
    }
}
