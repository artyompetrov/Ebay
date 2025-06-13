using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO.Compression;

namespace Server.Infrastructure;

public static class MeasurementHelper
{
    public static bool ReadMeasurementFile(
        byte[] measurementData,
        [NotNullWhen(false)] out List<string>? errors,
        [NotNullWhen(true)] out byte[]? anodeCurvesConfig,
        [NotNullWhen(true)] out byte[]? plateCurvesConfig,
        [NotNullWhen(true)] out byte[]? anodeCurves,
        [NotNullWhen(true)] out byte[]? plateCurves,
        [NotNullWhen(true)] out byte[]? quickTest)
    {
        errors = [];
        anodeCurves = [];
        plateCurves = [];
        quickTest = [];
        anodeCurvesConfig = [];
        plateCurvesConfig = [];

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
            else if (fileName.EndsWith("plate_curves.uts.utd", StringComparison.Ordinal))
            {
                plateCurves = GetBytes(entry);
            }
            else if (fileName.EndsWith(".txt", StringComparison.Ordinal))
            {
                quickTest = GetBytes(entry);
            }
            else if (fileName.EndsWith("anode_curves.uts", StringComparison.Ordinal))
            {
                anodeCurvesConfig = GetBytes(entry);
            }
            else if (fileName.EndsWith("plate_curves.uts", StringComparison.Ordinal))
            {
                plateCurvesConfig = GetBytes(entry);
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
        plateCurves = null;
        quickTest = null;
        anodeCurvesConfig = null;
        plateCurvesConfig = null;
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

        var rows = lines.Skip(1)
            .Select(l => l.Split(separator: ["  "], options: StringSplitOptions.RemoveEmptyEntries))
            .Select(parts => new
            {
                Curve = int.Parse(parts[idxCurve]),
                Data = new MeasurementPoint(
                    Ia: double.Parse(s: parts[idxIa], provider: CultureInfo.InvariantCulture),
                    Is: double.Parse(s: parts[idxIs], provider: CultureInfo.InvariantCulture),
                    Vg: double.Parse(s: parts[idxVg], provider: CultureInfo.InvariantCulture),
                    Va: double.Parse(s: parts[idxVa], provider: CultureInfo.InvariantCulture),
                    Vs: double.Parse(s: parts[idxVs], provider: CultureInfo.InvariantCulture),
                    Vf: double.Parse(s: parts[idxVf], provider: CultureInfo.InvariantCulture)
                )
            });

        return rows.GroupBy(x => x.Curve)
            .ToDictionary(x => x.Key, x => x.Select(x => x.Data).ToArray());
    }
}