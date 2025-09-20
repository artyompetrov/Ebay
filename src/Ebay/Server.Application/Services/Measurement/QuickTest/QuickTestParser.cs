using System.Globalization;
using System.Text.RegularExpressions;
using Server.Application.Services.Measurement.MeasurementTypes;
using Server.Application.Services.Measurement.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement.QuickTest;

public class QuickTestParser
{
    private static readonly Regex SectionRegex = new(
        @"SECTION\s+\d+(?<content>.*?)(?=(SECTION\s+\d+)|\Z)",
        RegexOptions.Singleline | RegexOptions.IgnoreCase | RegexOptions.Compiled);

    private static readonly Regex ValueRegex = new(
        @"^(?<value>[^()]+)\((?<unit>[^)]+)\)",
        RegexOptions.Compiled);

    private static readonly Regex NominalRegex = new(
        @"nominal\s+(?<value>[^()]+)\((?<unit>[^)]+)\)",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    private static readonly Regex SwingRegex = new(
        @"Swing\s+\+/-\s+[^()]*\((?<percent>[-\d.,]+)%\)",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    public ParseAndPrettifyQuickTestResult Parse(string quickTestOriginal, MeasurementTypeBase measurementType)
    {
        ArgumentNullException.ThrowIfNull(quickTestOriginal);
        ArgumentNullException.ThrowIfNull(measurementType);

        var normalized = quickTestOriginal.Replace("\r\n", "\n");

        return measurementType switch
        {
            TriodeAnodeCurves => CreateTriodeResult(normalized, TubeType.Triode),
            DoubleTriodeAnodeCurves => CreateTriodeResult(normalized, TubeType.DoubleTriode),
            PentodeAnodeCurves => CreatePentodeResult(normalized),
            _ => throw new ArgumentException($"The type {measurementType.GetType().Name} is not supported.")
        };
    }

    private static ParseAndPrettifyQuickTestResult CreateTriodeResult(string text, TubeType tubeType)
    {
        var sections = ParseTriodeSections(text);

        if (sections.Count == 0)
        {
            throw new FormatException("Quick test data does not contain section information.");
        }

        if (tubeType == TubeType.DoubleTriode && sections.Count < 2)
        {
            throw new FormatException("Double triode quick test must contain two sections.");
        }

        var section1 = sections[0];
        var section2 = sections.Count > 1 ? sections[1] : null;

        return new ParseAndPrettifyQuickTestResult(tubeType, section1, section2);
    }

    private static ParseAndPrettifyQuickTestResult CreatePentodeResult(string text)
    {
        var details = ParsePentode(text);

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

        return new ParseAndPrettifyQuickTestResult(TubeType.Pentode, section1, section2)
        {
            PentodeDetails = details
        };
    }

    private static List<SectionTest> ParseTriodeSections(string text)
    {
        var matches = SectionRegex.Matches(text);
        if (matches.Count == 0)
        {
            return [];
        }

        var result = new List<SectionTest>(matches.Count);
        foreach (Match match in matches)
        {
            var sectionContent = match.Groups["content"].Value;
            var lines = GetNormalizedLines(sectionContent)
                .Where(l => !string.Equals(l, "Test conditions:", StringComparison.OrdinalIgnoreCase))
                .Where(l => !string.Equals(l, "Test results:", StringComparison.OrdinalIgnoreCase))
                .ToList();

            if (lines.Count == 0)
            {
                continue;
            }

            result.Add(ParseTriodeSection(lines));
        }

        return result;
    }

    private static SectionTest ParseTriodeSection(IReadOnlyCollection<string> lines)
    {
        var vaLine = FindLine(lines, "Va");
        var vgLine = FindLine(lines, "Vg");
        var iaLine = FindLine(lines, "Ia");
        var raLine = FindLine(lines, "Ra");
        var gmLine = FindLine(lines, "Gm");
        var muLine = FindLine(lines, "mu");

        return new SectionTest(
            Va: ParseMeasurementValue(vaLine),
            Vg: ParseMeasurementValue(vgLine),
            VaSwingPercent: ParseSwingPercent(vaLine),
            VgSwingPercent: ParseSwingPercent(vgLine),
            Ia: ParseMeasurementValue(iaLine),
            IaNominal: ParseNominalValue(iaLine),
            Ra: ParseMeasurementValue(raLine),
            RaNominal: ParseNominalValue(raLine),
            Gm: ParseMeasurementValue(gmLine),
            GmNominal: ParseNominalValue(gmLine),
            Mu: ParseMeasurementValue(muLine),
            MuNominal: ParseNominalValue(muLine));
    }

    private static PentodeQuickTestDetails ParsePentode(string text)
    {
        var lines = GetNormalizedLines(text)
            .Where(l => !string.Equals(l, "Test conditions:", StringComparison.OrdinalIgnoreCase))
            .Where(l => !string.Equals(l, "Test results:", StringComparison.OrdinalIgnoreCase))
            .ToList();

        string Get(string prefix) => FindLine(lines, prefix);

        var vaLine = Get("Va");
        var vsLine = Get("Vs");
        var vgLine = Get("Vg");
        var iaLine = Get("Ia");
        var gmaLine = Get("Gma");
        var raLine = Get("Ra");
        var mu1Line = Get("mu1");
        var gm1Line = Get("Gm1");
        var isLine = Get("Is");
        var gmsLine = Get("Gms");
        var rsLine = Get("Rs");
        var mu2Line = Get("mu2");
        var gm2Line = Get("Gm2");

        return new PentodeQuickTestDetails(
            Va: ParseMeasurementValue(vaLine),
            VaSwingPercent: ParseSwingPercent(vaLine),
            Vs: ParseMeasurementValue(vsLine),
            VsSwingPercent: ParseSwingPercent(vsLine),
            Vg: ParseMeasurementValue(vgLine),
            VgSwingPercent: ParseSwingPercent(vgLine),
            Ia: ParseMeasurementValue(iaLine),
            IaNominal: ParseNominalValue(iaLine),
            Gma: ParseMeasurementValue(gmaLine),
            GmaNominal: ParseNominalValue(gmaLine),
            Ra: ParseMeasurementValue(raLine),
            RaNominal: ParseNominalValue(raLine),
            Mu1: ParseMeasurementValue(mu1Line),
            Mu1Nominal: ParseNominalValue(mu1Line),
            Gm1: ParseMeasurementValue(gm1Line),
            Is: ParseMeasurementValue(isLine),
            IsNominal: ParseNominalValue(isLine),
            Gms: ParseMeasurementValue(gmsLine),
            Rs: ParseMeasurementValue(rsLine),
            Mu2: ParseMeasurementValue(mu2Line),
            Gm2: ParseMeasurementValue(gm2Line));
    }

    private static double ParseMeasurementValue(string line)
    {
        var match = ValueRegex.Match(GetValuePart(line));
        if (!match.Success)
        {
            throw new FormatException($"Unable to parse value from line: '{line}'");
        }

        var rawValue = match.Groups["value"].Value;
        var unit = match.Groups["unit"].Value.Trim();

        var numericValue = ParseNumericValue(rawValue);
        return ConvertToBaseUnit(numericValue, unit);
    }

    private static double ParseNominalValue(string line)
    {
        var match = NominalRegex.Match(GetValuePart(line));
        if (!match.Success)
        {
            return double.NaN;
        }

        var rawValue = match.Groups["value"].Value;
        var unit = match.Groups["unit"].Value.Trim();

        var numericValue = ParseNumericValue(rawValue);
        return ConvertToBaseUnit(numericValue, unit);
    }

    private static double ParseSwingPercent(string line)
    {
        var match = SwingRegex.Match(line);
        if (!match.Success)
        {
            return double.NaN;
        }

        return ParseNumericValue(match.Groups["percent"].Value);
    }

    private static string GetValuePart(string line)
    {
        var parts = line.Split(':', 2);
        if (parts.Length != 2)
        {
            throw new FormatException($"Line does not contain separator ':': '{line}'");
        }

        return parts[1].Trim();
    }

    private static string FindLine(IEnumerable<string> lines, string prefix)
    {
        var line = lines.FirstOrDefault(l => l.StartsWith(prefix, StringComparison.OrdinalIgnoreCase));
        if (line == null)
        {
            throw new FormatException($"Line with prefix '{prefix}' was not found in quick test results.");
        }

        return line;
    }

    private static IEnumerable<string> GetNormalizedLines(string text)
    {
        return text.Replace("\r\n", "\n")
            .Split('\n', StringSplitOptions.RemoveEmptyEntries)
            .Select(l => l.Trim())
            .Where(l => !string.IsNullOrWhiteSpace(l));
    }

    private static double ParseNumericValue(string rawValue)
    {
        var normalized = rawValue.Trim();

        if (normalized.Length == 0)
        {
            return double.NaN;
        }

        if (normalized.Contains("N.A.", StringComparison.OrdinalIgnoreCase) || normalized.Contains("---", StringComparison.Ordinal))
        {
            return double.NaN;
        }

        var isGreater = normalized.StartsWith('>');
        var isLess = normalized.StartsWith('<');

        if (isGreater || isLess)
        {
            normalized = normalized[1..].Trim();
        }

        var multiplier = 1.0;
        if (normalized.EndsWith("M", StringComparison.OrdinalIgnoreCase))
        {
            multiplier = 1_000_000;
            normalized = normalized[..^1];
        }
        else if (normalized.EndsWith("k", StringComparison.OrdinalIgnoreCase))
        {
            multiplier = 1_000;
            normalized = normalized[..^1];
        }

        normalized = normalized.Replace(" ", string.Empty).Replace(',', '.');

        if (!double.TryParse(normalized, NumberStyles.Float, CultureInfo.InvariantCulture, out var value))
        {
            return double.NaN;
        }

        value *= multiplier;

        if (isGreater)
        {
            return double.PositiveInfinity;
        }

        if (isLess)
        {
            return double.NegativeInfinity;
        }

        return value;
    }

    private static double ConvertToBaseUnit(double value, string unit)
    {
        if (double.IsNaN(value) || double.IsInfinity(value))
        {
            return value;
        }

        var factor = unit switch
        {
            "V" => 1.0,
            "mV" => 1e-3,
            "A" => 1.0,
            "mA" => 1e-3,
            "uA" => 1e-6,
            "mA/V" => 1e-3,
            "uA/V" => 1e-6,
            "A/V" => 1.0,
            "ohm" => 1.0,
            "kohm" => 1e3,
            "Mohm" => 1e6,
            "-" => 1.0,
            _ => 1.0
        };

        return value * factor;
    }
}
