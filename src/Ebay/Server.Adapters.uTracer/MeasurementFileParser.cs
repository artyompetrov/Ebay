using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;
using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Adapters.uTracer;

internal sealed class MeasurementFileParser : IMeasurementFileParser
{
    public MeasurementFileParseResult Parse(byte[] measurements)
    {
        if (!ReadMeasurementFile(
                measurementData: measurements,
                errors: out var fileErrors,
                anodeCurvesConfig: out var anodeCurvesConfig,
                anodeCurves: out var anodeCurves,
                fileCount: out var fileCount))
        {
            // todo тут не стоит кидать exception по идее
            throw new MeasurementException(
                $"Errors during file parsing {string.Join(separator: ", ", values: fileErrors)}");
        }

        var parsedMeasurement = ParseMeasurement(configBytes: anodeCurvesConfig, measurementBytes: anodeCurves);

        var hashAnodeCurvesConfig = ComputeEntryHashAsync(anodeCurvesConfig);
        var hashAnodeCurves = ComputeEntryHashAsync(anodeCurves);

        return new MeasurementFileParseResult(
            FileCount: fileCount,
            MeasurementConfigTableParseResult: parsedMeasurement,
            HashAnodeCurves: hashAnodeCurves,
            HashAnodeCurvesConfig: hashAnodeCurvesConfig);
    }

    public async Task<byte[]> ToPrettifiedZip(byte[] zipBytes, CancellationToken cancellationToken)
    {
        if (!ReadMeasurementFile(
                measurementData: zipBytes,
                errors: out var fileErrors,
                anodeCurvesConfig: out var anodeCurvesConfig,
                anodeCurves: out var anodeCurves,
                fileCount: out _))
        {
            // todo тут не стоит кидать exception по идее
            throw new MeasurementException(
                $"Errors during file parsing {string.Join(separator: ", ", values: fileErrors)}");
        }

        using var zipStream = new MemoryStream();
        using (var archive = new ZipArchive(stream: zipStream, mode: ZipArchiveMode.Create, leaveOpen: true))
        {
            await SaveFileToZipArchive(
                archive: archive,
                fileName: "anode_curves_measurement_config.uts",
                content: anodeCurvesConfig,
                cancellationToken);
            await SaveFileToZipArchive(archive: archive, fileName: "anode_curves.utd", content: anodeCurves, cancellationToken);
        }

        zipStream.Position = 0;

        return zipStream.ToArray();
    }

    private static async Task SaveFileToZipArchive(ZipArchive archive, string fileName, byte[] content, CancellationToken cancellationToken)
    {
        var entry = archive.CreateEntry(fileName);
        await using var entryStream = entry.Open();
        await entryStream.WriteAsync(content, cancellationToken);
    }


    private static byte[] GetBytes(ZipArchiveEntry entry)
    {
        using var entryStream = entry.Open();
        using var memory = new MemoryStream();
        entryStream.CopyTo(memory);

        return memory.ToArray();
    }

    private static AnodeCurvesBase GetMeasurementType(
        int measurementType,
        int y2AxisVariable,
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints)
    {
        return measurementType switch
        {
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

            _ => throw new ArgumentOutOfRangeException(nameof(measurementType), $"Value: {measurementType}")
        };
    }


    private static MeasurementConfigTableParseResult ParseMeasurement(
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
            {
                continue;
            }

            var value = int.Parse(match.Groups[1].Value, CultureInfo.InvariantCulture);
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
            AnodeCurves: measurementType,
            SteppingVariableCount: steppingVariableCount,
            NumberOfIntervals: numberOfIntervals);
    }


    private static bool ReadMeasurementFile(
        byte[] measurementData,
        [NotNullWhen(false)] out List<string>? errors,
        [NotNullWhen(true)] out byte[]? anodeCurvesConfig,
        [NotNullWhen(true)] out byte[]? anodeCurves,
        out int fileCount)
    {
        errors = [];
        anodeCurves = [];
        anodeCurvesConfig = [];

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
                // замер grid curves вообще теперь не делается
            }
            else if (fileName.EndsWith(".txt", StringComparison.Ordinal))
            {
                // quick test больше не делается
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
                // замер grid curves вообще теперь не делается
            }
            else
            {
                errors.Add($"unsupported filename {entry.FullName}");
            }
        }

        if (fileCount is not 2 and not 5 and not 3)
        {
            errors.Add("exactly 2 files expected (or 5 or 3 for legacy files)");
        }

        if (errors.Count <= 0)
        {
            return true;
        }

        anodeCurves = null;
        anodeCurvesConfig = null;
        return false;
    }

    private static Dictionary<int, MeasurementPoint[]> ParseSpaceSeparatedTable(byte[] data)
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


        var rows = lines.Skip(1)
            .Select(l => l.Split(separator: ["  "], options: StringSplitOptions.RemoveEmptyEntries))
            .Select(parts =>
            {
                var currentCurve = int.Parse(parts[idxCurve], CultureInfo.InvariantCulture);

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
                        Vf: currentVf),
                };

                return result;
            }).ToList();

        return rows.GroupBy(x => x.Curve)
            .ToDictionary(x => x.Key, x => x.Select(x => x.Data).ToArray());
    }

    private static string ComputeEntryHashAsync(byte[] bytes)
    {
        var hashBytes = SHA256.HashData(bytes);
        return Convert.ToHexString(hashBytes);
    }
}