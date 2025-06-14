using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO.Compression;
using System.Text.RegularExpressions;

namespace Server.Infrastructure;

public static class MeasurementHelper
{
    public static bool ReadMeasurementFile(
        byte[] measurementData,
        [NotNullWhen(false)] out List<string>? errors,
        [NotNullWhen(true)] out byte[]? anodeCurvesConfig,
        [NotNullWhen(true)] out byte[]? gridCurvesConfig,
        [NotNullWhen(true)] out byte[]? anodeCurves,
        [NotNullWhen(true)] out byte[]? gridCurves,
        [NotNullWhen(true)] out byte[]? quickTest)
    {
        errors = [];
        anodeCurves = [];
        gridCurves = [];
        quickTest = [];
        anodeCurvesConfig = [];
        gridCurvesConfig = [];

        using var inputMemoryStream = new MemoryStream(measurementData);
        using var archive = new ZipArchive(inputMemoryStream, ZipArchiveMode.Read, leaveOpen: true);
        var fileCount = 0;
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
                gridCurves = GetBytes(entry);
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
                gridCurvesConfig = GetBytes(entry);
            }
            else
            {
                errors.Add($"unsupported filename {entry.FullName}");
            }
        }

        if (fileCount != 5)
        {
            errors.Add("exactly 5 files expected");
        }

        if (errors.Count <= 0) return true;


        anodeCurves = null;
        gridCurves = null;
        quickTest = null;
        anodeCurvesConfig = null;
        gridCurvesConfig = null;
        return false;
    }

    private static byte[] GetBytes(ZipArchiveEntry entry)
    {
        using var entryStream = entry.Open();
        using var memory = new MemoryStream();
        entryStream.CopyTo(memory);

        return memory.ToArray();
    }


    public static Dictionary<int, MeasurementPoint[]> ParseSpaceSeparatedTable(byte[] data)
    {
        var stringData = System.Text.Encoding.UTF8.GetString(data);

        var lines = stringData
            .Replace(oldChar: ',', newChar: '.')
            .Split(separator: ['\r', '\n'], options: StringSplitOptions.RemoveEmptyEntries);

        var header = lines[0].Split(separator: ["  "], options: StringSplitOptions.RemoveEmptyEntries)
            .Select(x => x.Trim()).ToArray();

        var idxCurve = Array.IndexOf(array: header, value: "Curve");
        var idxIa = Array.IndexOf(array: header, value: "Ia (mA)");
        var idxIs = Array.IndexOf(array: header, value: "Is (mA)");
        var idxVg = Array.IndexOf(array: header, value: "Vg (V)");
        var idxVa = Array.IndexOf(array: header, value: "Va (V)");
        var idxVs = Array.IndexOf(array: header, value: "Vs (V)");
        var idxVf = Array.IndexOf(array: header, value: "Vf (V)");

        var previousIa = 0.0;
        var previousIs = 0.0;
        var previousVg = 0.0;
        var previousVa = 0.0;
        var previousVs = 0.0;
        var previousVf = 0.0;

        var previousCurve = 0;

        
        var rows = lines.Skip(1)
            .Select(l => l.Split(separator: ["  "], options: StringSplitOptions.RemoveEmptyEntries))
            .Select(parts =>
            {
                var currentCurve = int.Parse(parts[idxCurve]);
                if (previousCurve != currentCurve)
                {
                    previousIa = 0.0;
                    previousIs = 0.0;
                    previousVg = 0.0;
                    previousVa = 0.0;
                    previousVs = 0.0;
                    previousVf = 0.0;

                    previousCurve = currentCurve;
                }
                
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
                        Vf: currentVf,
                        dIa: currentIa - previousIa,
                        dIs: currentIs - previousIs,
                        dVg: currentVg - previousVg,
                        dVa: currentVa - previousVa,
                        dVs: currentVs - previousVs,
                        dVf: currentVf - previousVf
                    )
                };
                
                previousIa = currentIa;
                previousIs = currentIs;
                previousVg = currentVg;
                previousVa = currentVa;
                previousVs = currentVs;
                previousVf = currentVf;
                return result;
            }).ToList();

        return rows.GroupBy(x => x.Curve)
            .ToDictionary(x => x.Key, x => x.Select(x => x.Data).ToArray());
    }


    public static MeasurementConfig ParseMeasurementConfigTable(byte[] data)
    {
        var lineRegex = new Regex(@"^([+-]?\d+)\s+(.*)$", RegexOptions.Compiled);

        var stringData = System.Text.Encoding.UTF8.GetString(data);

        var config = new Dictionary<string, int?>();
        var lines = stringData.Split('\n').Select(x => x.Trim());


        foreach (var line in lines)
        {
            var match = lineRegex.Match(line);
            if (!match.Success)
                continue;

            var value = int.Parse(match.Groups[1].Value);
            var comment = match.Groups[2].Value.Trim();

            config[comment] = value;
        }
        
        return new MeasurementConfig(
            MeasurementType: (MeasurementType)config["measurement type"]!.Value,
            Pmax: config.GetValueOrDefault("Pmax", defaultValue: null)
        );
    }


    /// <param name="Pmax">Максимальная мощность мВт</param>
    public record MeasurementConfig(MeasurementType MeasurementType, int? Pmax);

    public enum MeasurementType
    {
        // I(Vg, Va) with Vs, Vh Constant
        TriodeGridCurves = 1,
        
        // I(Va, Vg) with Vs, Vh Constant
        PentodeAnodeCurves = 2,
        
        // I(Va=Vs, Vg) with Vh Constant
        TriodeAnodeCurves = 4,
        
        // I(Vs, Vg) with Va, Vh Constant
        PentodeScreenCurves = 5
    }
    
    public static string ParseAndPrettifyQuickTest(byte[] quickTest)
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
}