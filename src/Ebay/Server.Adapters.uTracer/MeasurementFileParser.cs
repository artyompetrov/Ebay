using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using Server.Application.Services.Measurement;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;
using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Adapters.uTracer;

public class MeasurementFileParser : IMeasurementFileParser
{
    public MeasurementFileParseResult Parse(byte[] measurements)
    {
        if (!ReadMeasurementFile(
                measurementData: measurements,
                errors: out var fileErrors,
                anodeCurvesConfig: out var anodeCurvesConfig,
                anodeCurves: out var anodeCurves,
                quickTest: out var quickTest,
                fileCount: out var fileCount))
        {
            throw new MeasurementException(
                $"Errors during file parsing {string.Join(separator: ", ", values: fileErrors)}");
        }

        var config = ParseMeasurementConfigTable(configBytes: anodeCurvesConfig, measurementBytes: anodeCurves);

        ParseSpaceSeparatedTable(anodeCurves);
        ParseAndPrettifyQuickTest(quickTest: quickTest, removeSection2: false);

        var hashAnodeCurvesConfig = ComputeEntryHashAsync(anodeCurvesConfig);
        var hashAnodeCurves = ComputeEntryHashAsync(anodeCurves);

        var hashQuickTest = ComputeEntryHashAsync(quickTest);

        return new MeasurementFileParseResult(
            FileCount: fileCount,
            config,
            HashAnodeCurves: hashAnodeCurves,
            HashAnodeCurvesConfig: hashAnodeCurvesConfig,
            HashQuickTest: hashQuickTest
        );
    }



    private static byte[] GetBytes(ZipArchiveEntry entry)
    {
        using var entryStream = entry.Open();
        using var memory = new MemoryStream();
        entryStream.CopyTo(memory);

        return memory.ToArray();
    }

    private static MeasurementTypeBase? GetMeasurementType(
        int measurementType,
        int y2AxisVariable,
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints)
    {
        return measurementType switch
        {
            // I(Vg, Va) with Vs, Vh Constant - этот замер больше не делается, для сохранения обратной совместимости только оставил
            1 => y2AxisVariable switch
            {
                // второго графика нет
                0 => new TriodeGridCurves(pmaxWatt, measurementPoints),
                // Is
                2 => new DoubleTriodeGridCurves(pmaxWatt, measurementPoints),
                _ => throw new ArgumentOutOfRangeException(nameof(y2AxisVariable))
            },

            // I(Va, Vg) with Vs, Vh Constant
            2 => new PentodeAnodeCurves(pmaxWatt, measurementPoints),

            // I(Va=Vs, Vg) with Vh Constant
            4 => y2AxisVariable switch
            {
                // второго графика нет
                0 => new TriodeAnodeCurves(pmaxWatt, measurementPoints),
                // Is
                2 => new DoubleTriodeAnodeCurves(pmaxWatt, measurementPoints),
                _ => throw new ArgumentOutOfRangeException(nameof(y2AxisVariable))
            },

            // I(Vs, Vg) with Va, Vh Constant
            5 => null, //ранее были замеры по screen curves - но в них нет практического смысла, отказался от них
            _ => throw new ArgumentOutOfRangeException(nameof(measurementType), $"Value: {measurementType}")
        };
    }


    private static MeasurementConfigTableParseResult ParseMeasurementConfigTable(
        byte[] configBytes,
        byte[] measurementBytes)
    {
        var lineRegex = new Regex(pattern: @"^([+-]?\d+)\s+(.*)$", options: RegexOptions.Compiled);
        var doubleSpaceRegex = new Regex(@"\s{2,}", RegexOptions.Compiled);

        var stringData = System.Text.Encoding.UTF8.GetString(configBytes);

        var config = new Dictionary<string, int?>();
        var lines = stringData.Split('\n').Select(x => x.Trim());


        foreach (var line in lines)
        {
            var match = lineRegex.Match(line);
            if (!match.Success)
                continue;

            var value = int.Parse(match.Groups[1].Value);
            var comment = doubleSpaceRegex.Replace(match.Groups[2].Value.Trim(), " ");

            config[comment] = value;
        }

        var steppingVariableCount = config["number of stepping variables"]!.Value;
        var numberOfIntervals = config["Variable 1 number of intervals"]!.Value;

        var measurementType = GetMeasurementType(
            measurementType: config["measurement type"]!.Value,
            y2AxisVariable: config["Y2 axis variable"]!.Value,
            pmaxWatt: config["Pmax"]!.Value / 1000.0,
            measurementPoints: ParseSpaceSeparatedTable(measurementBytes));

        return new MeasurementConfigTableParseResult(
            MeasurementType: measurementType,
            SteppingVariableCount: steppingVariableCount,
            NumberOfIntervals: numberOfIntervals);
    }


    private static bool ReadMeasurementFile(
        byte[] measurementData,
        [NotNullWhen(false)] out List<string>? errors,
        [NotNullWhen(true)] out byte[]? anodeCurvesConfig,
        [NotNullWhen(true)] out byte[]? anodeCurves,
        [NotNullWhen(true)] out byte[]? quickTest,
        out int fileCount)
    {
        errors = [];
        anodeCurves = [];
        anodeCurvesConfig = [];
        quickTest = [];

        using var inputMemoryStream = new MemoryStream(measurementData);
        using var archive = new ZipArchive(inputMemoryStream, ZipArchiveMode.Read, leaveOpen: true);
        fileCount = 0;
        foreach (var entry in archive.Entries)
        {
            var fileName = entry.Name;

            if (string.IsNullOrEmpty(fileName))
            {
                errors.Add($"No folders allowed, but found {entry.FullName}");
                continue;
            }

            fileCount++;

            if (fileName.EndsWith("anode_curves.uts.utd", StringComparison.Ordinal))
            {
                anodeCurves = GetBytes(entry);
            }
            else if
                (fileName.EndsWith("grid_curves.uts.utd", comparisonType: StringComparison.Ordinal) ||
                 /*два названия из-за ошибки (раньше grid curves ошибочно назывались plate curves в коде,
                  неправильные названия остались в zip файлах)*/
                 fileName.EndsWith("plate_curves.uts.utd", StringComparison.Ordinal))
            {
                //замер grid curves вообще теперь не делается
            }
            else if (fileName.EndsWith(".txt", StringComparison.Ordinal))
            {
                quickTest = GetBytes(entry);
            }
            else if (fileName.EndsWith("anode_curves.uts", StringComparison.Ordinal))
            {
                anodeCurvesConfig = GetBytes(entry);
            }
            else if
                (fileName.EndsWith("grid_curves.uts", comparisonType: StringComparison.Ordinal) ||
                 /*два названия из-за ошибки (раньше grid curves ошибочно назывались plate curves в коде,
                  неправильные названия остались в zip файлах)*/
                 fileName.EndsWith("plate_curves.uts", StringComparison.Ordinal))
            {
                //замер grid curves вообще теперь не делается
            }
            else
            {
                errors.Add($"unsupported filename {entry.FullName}");
            }
        }

        if (fileCount != 5 && fileCount != 3)
        {
            errors.Add("exactly 5 or 3 files expected");
        }

        if (errors.Count <= 0) return true;


        anodeCurves = null;
        quickTest = null;
        anodeCurvesConfig = null;
        return false;
    }

    private static Dictionary<int, MeasurementPoint[]> ParseSpaceSeparatedTable(byte[] data)
    {
        var stringData = System.Text.Encoding.UTF8.GetString(data);

        var lines = stringData
            .Replace(oldChar: ',', newChar: '.')
            .Split(separator: new[] { '\r', '\n' }, options: StringSplitOptions.RemoveEmptyEntries);

        var header = lines[0].Split(separator: new[] { "  " }, options: StringSplitOptions.RemoveEmptyEntries)
            .Select(x => x.Trim()).ToArray();

        var idxCurve = Array.IndexOf(array: header, value: "Curve");
        var idxIa = Array.IndexOf(array: header, value: "Ia (mA)");
        var idxIs = Array.IndexOf(array: header, value: "Is (mA)");
        var idxVg = Array.IndexOf(array: header, value: "Vg (V)");
        var idxVa = Array.IndexOf(array: header, value: "Va (V)");
        var idxVs = Array.IndexOf(array: header, value: "Vs (V)");
        var idxVf = Array.IndexOf(array: header, value: "Vf (V)");


        var rows = lines.Skip(1)
            .Select(l => l.Split(separator: new[] { "  " }, options: StringSplitOptions.RemoveEmptyEntries))
            .Select(parts =>
            {
                var currentCurve = int.Parse(parts[idxCurve]);

                var currentIa = double.Parse(s: parts[idxIa], provider: CultureInfo.InvariantCulture);
                var currentIs = double.Parse(s: parts[idxIs], provider: CultureInfo.InvariantCulture);
                var currentVg = double.Parse(s: parts[idxVg], provider: CultureInfo.InvariantCulture);
                var currentVa = double.Parse(s: parts[idxVa], provider: CultureInfo.InvariantCulture);
                var currentVs = double.Parse(s: parts[idxVs], provider: CultureInfo.InvariantCulture);
                var currentVf = double.Parse(s: parts[idxVf], provider: CultureInfo.InvariantCulture);

                var result = new
                {
                    Curve = currentCurve,
                    Data = new MeasurementPoint(
                        Ia: currentIa,
                        Is: currentIs,
                        Vg: currentVg,
                        Va: currentVa,
                        Vs: currentVs,
                        Vf: currentVf
                    )
                };

                return result;
            }).ToList();

        return rows.GroupBy(x => x.Curve)
            .ToDictionary(x => x.Key, x => x.Select(x => x.Data).ToArray());
    }


    private static string ParseAndPrettifyQuickTest(byte[] quickTest, bool removeSection2)
    {
        var quickTestOriginal = System.Text.Encoding.UTF8.GetString(quickTest);

        var quickTestStr = Regex.Replace(
            quickTestOriginal,
            @"(\r?\n[ \t]*){2,}",
            "\n\n"
        );

        quickTestStr = Regex.Replace(
            quickTestStr,
            @"\s+\d+\s*% of nominal [\d\.,]+ ?\([^)]+\)",
            m => new string(' ', m.Value.Length));

        quickTestStr = Regex.Replace(quickTestStr, @"[ ]{3,}", "|");

        quickTestStr = Regex.Replace(quickTestStr, @"[ ]{3,}", "");

        if (removeSection2)
        {
            var parts = quickTestStr.Split("SECTION 2", StringSplitOptions.None);
            quickTestStr = parts[0];
        }

        var matches = Regex.Matches(quickTestStr, @"^(.*?)\|", RegexOptions.Multiline);
        var maxWidth = matches.Cast<Match>().Select(m => m.Groups[1].Value.Length).DefaultIfEmpty(0).Max();
        var tabSize = 8; // браузер чаще всего 8

        // Шаг 2: Заменить каждое "до |" на выровненное + табы
        var aligned = Regex.Replace(
            quickTestStr,
            @"^(.*?)\|",
            m =>
            {
                var left = m.Groups[1].Value.TrimEnd();
                // Сколько надо символов до maxWidth
                var padLen = maxWidth - left.Length;
                // Сколько табов (с учётом табуляции 8)
                var tabsNeeded = ((left.Length + padLen) / tabSize) + 1 - (left.Length / tabSize);
                if (tabsNeeded < 1) tabsNeeded = 1;
                return left + new string('\t', tabsNeeded);
            },
            RegexOptions.Multiline
        );

        if (quickTestOriginal == quickTestStr)
        {
            throw new InvalidOperationException("Nothing has changed after quick test prettification");
        }

        return aligned.Trim();
    }
    
    private static string ComputeEntryHashAsync(byte[] bytes)
    {
        var hashBytes = SHA256.HashData(bytes);
        return Convert.ToHexString(hashBytes);
    }
}