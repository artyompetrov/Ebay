using System.Diagnostics.CodeAnalysis;
using System.IO.Compression;

namespace Server.Infrastructure;

public static class MeasurementHelper
{
    public static bool ReadMeasurementFile(
        byte[] measurementData,
        [NotNullWhen(false)] out List<string>? errors,
        [NotNullWhen(true)]out byte[]? anodeCurvesConfig,
        [NotNullWhen(true)]out byte[]? plateCurvesConfig,
        [NotNullWhen(true)]out byte[]? anodeCurves,
        [NotNullWhen(true)]out byte[]? plateCurves,
        [NotNullWhen(true)]out byte[]? quickTest)
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

        if (errors.Count > 0)
        {
            anodeCurves = null;
            plateCurves = null;
            quickTest = null;
            anodeCurvesConfig = null;
            plateCurvesConfig = null;
            return false;
        }
        
        return true;
    }

    private static byte[] GetBytes(ZipArchiveEntry entry)
    {
        using var entryStream = entry.Open();
        using var memory = new MemoryStream();
        entryStream.CopyTo(memory);

        return memory.ToArray();
    }
}