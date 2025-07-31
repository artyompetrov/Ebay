using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;
using Server.Application.Data.Models;

namespace Server.Application.Services.Measurement;

public class MeasurementService
{
    private readonly ApplicationDbContext _applicationContext;

    public MeasurementService(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    public async Task SaveMeasurement(
        string measurementId,
        byte[] measurementsFile,
        ProductState productState,
        string manufactureCode,
        string? location,
        Guid productId,
        CancellationToken cancellationToken)
    {
        if (!Regex.IsMatch(measurementId, "^[A-Z0-9]+$"))
        {
            throw new MeasurementException($"Incorrect MeasurementId Format {measurementId}");
        }

        if (!ReadMeasurementFile(
                measurementData: measurementsFile,
                errors: out var fileErrors,
                anodeCurvesConfig: out var anodeCurvesConfig,
                gridCurvesConfig: out var gridCurvesConfig,
                anodeCurves: out var anodeCurves,
                gridCurves: out var gridCurves,
                quickTest: out var quickTest))
        {
            throw new MeasurementException($"Errors during file parsing {string.Join(", ", fileErrors)}");
        }

        // Проверка, что измерения загружены правильно
        try
        {
            var anodeConfig = ParseMeasurementConfigTable(anodeCurvesConfig);
            var gridConfig = ParseMeasurementConfigTable(gridCurvesConfig);

            if (anodeConfig.MeasurementType != MeasurementType.TriodeAnodeCurves &&
                anodeConfig.MeasurementType != MeasurementType.DoubleTriodeAnodeCurves &&
                anodeConfig.MeasurementType != MeasurementType.PentodeAnodeCurves)
            {
                throw new MeasurementException("AnodeCurves expected");
            }

            if (gridConfig.MeasurementType != MeasurementType.TriodeGridCurves &&
                gridConfig.MeasurementType != MeasurementType.DoubleTriodeGridCurves &&
                gridConfig.MeasurementType != MeasurementType.PentodeScreenCurves)
            {
                throw new MeasurementException("Grid or screen curves expected");
            }

            ParseSpaceSeparatedTable(anodeCurves);
            ParseSpaceSeparatedTable(gridCurves);
            ParseAndPrettifyQuickTest(quickTest, removeSection2: false);

            var hashAnodeCurvesConfig = ComputeEntryHashAsync(anodeCurvesConfig);
            var hashGridCurvesConfig = ComputeEntryHashAsync(gridCurvesConfig);
            var hashAnodeCurves = ComputeEntryHashAsync(anodeCurves);
            var hashGridCurves = ComputeEntryHashAsync(gridCurves);
            var hashQuickTest = ComputeEntryHashAsync(quickTest);

            var hashes = new HashSet<string>
            {
                hashAnodeCurvesConfig,
                hashGridCurvesConfig,
                hashAnodeCurves,
                hashGridCurves,
                hashQuickTest
            };

            if (hashes.Count != 5)
            {
                throw new MeasurementException("File duplicates");
            }

            await _applicationContext.ProductMeasurements.AddAsync(
                entity: new ProductMeasurement
                {
                    Id = measurementId,
                    ProductId = productId,
                    MeasurementState = MeasurementState.Created,
                    ProductState = productState,
                    Measurements = measurementsFile,
                    HashAnodeCurves = hashAnodeCurves ?? throw new NullReferenceException(nameof(hashAnodeCurves)),
                    HashGridCurves = hashGridCurves ?? throw new NullReferenceException(nameof(hashGridCurves)),
                    HashQuickTest = hashQuickTest ?? throw new NullReferenceException(nameof(hashQuickTest)),
                    ManufactureCode = manufactureCode,
                    Location = location
                },
                cancellationToken: cancellationToken);

            await _applicationContext.SaveChangesAsync(cancellationToken);
        }
        catch (Exception ex)
        {
            throw new MeasurementException($"Errors during data validation {ex.Message}");
        }
    }

    public async Task UpdateMeasurementLocation(
        string location,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        var measurement = await _applicationContext.ProductMeasurements
            .Where(m => m.ProductId == productId && m.Id == measurementId)
            .FirstOrDefaultAsync(cancellationToken);

        if (measurement == null)
        {
            throw new InvalidOperationException("Measurement not found.");
        }

        measurement.Location = location;

        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteMeasurement(Guid productId, string measurementId, CancellationToken cancellationToken)
    {
        _applicationContext.ProductMeasurements.RemoveRange(
            _applicationContext.ProductMeasurements.Where(x =>
                x.ProductId == productId && x.Id == measurementId));

        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    private static string ComputeEntryHashAsync(byte[] bytes)
    {
        var hashBytes = SHA256.HashData(bytes);
        return Convert.ToHexString(hashBytes);
    }

    public async Task<byte[]?> GetMeasurementFile(string measurementId, CancellationToken cancellationToken)
    {
        var zipBytes = await _applicationContext.ProductMeasurements
            .AsNoTracking()
            .Where(x => x.Id == measurementId)
            .Select(x => x.Measurements)
            .SingleOrDefaultAsync(cancellationToken: cancellationToken);

        if (zipBytes == null)
            return null;

        if (!ReadMeasurementFile(
                measurementData: zipBytes,
                errors: out var fileErrors,
                anodeCurvesConfig: out var anodeCurvesConfig,
                gridCurvesConfig: out var gridCurvesConfig,
                anodeCurves: out var anodeCurves,
                gridCurves: out var gridCurves,
                quickTest: out var quickTest))
        {
            return null;
        }

        var config = ParseMeasurementConfigTable(gridCurvesConfig);

        var gridFileName = config.MeasurementType switch
        {
            MeasurementType.TriodeGridCurves => "grid_curves",
            MeasurementType.DoubleTriodeGridCurves => "grid_curves",
            MeasurementType.PentodeScreenCurves => "screen_curves",
            _ => throw new ArgumentOutOfRangeException()
        };

        using var zipStream = new MemoryStream();
        using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, leaveOpen: true))
        {

            await SaveFileToZipArchive(
                archive: archive,
                fileName: "anode_curves_measurement_config.uts",
                content: anodeCurvesConfig);
            await SaveFileToZipArchive(
                archive: archive,
                fileName: $"{gridFileName}_measurement_config.uts",
                content: gridCurvesConfig);
            await SaveFileToZipArchive(archive: archive, fileName: "anode_curves.utd", content: anodeCurves);
            await SaveFileToZipArchive(archive: archive, fileName: $"{gridFileName}.utd", content: gridCurves);
            await SaveFileToZipArchive(archive: archive, fileName: "quick_test.txt", content: quickTest);
        }

        zipStream.Position = 0;

        return zipStream.ToArray();
    }

    private async static Task SaveFileToZipArchive(ZipArchive archive, string fileName, byte[] content)
    {
        var entry = archive.CreateEntry(fileName);
        await using var entryStream = entry.Open();
        entryStream.Write(content, 0, content.Length);
    }


    public async Task<MeasurementData?> GetMeasurements(
        CancellationToken cancellationToken,
        string measurementId)
    {
        var measurement = await _applicationContext.ProductMeasurements
            .AsNoTracking()
            .Where(m => m.Id == measurementId)
            .SingleOrDefaultAsync(cancellationToken);

        if (measurement == null)
            return null;
        if (!ReadMeasurementFile(
                measurementData: measurement.Measurements,
                errors: out var fileErrors,
                anodeCurvesConfig: out var anodeCurvesConfig,
                gridCurvesConfig: out var gridCurvesConfig,
                anodeCurves: out var anodeCurves,
                gridCurves: out var gridCurves,
                quickTest: out var quickTest))
        {
            return null;
        }

        var anodeCurvesConfigParsed = ParseMeasurementConfigTable(anodeCurvesConfig);
        var gridCurvesConfigParsed = ParseMeasurementConfigTable(gridCurvesConfig);

        var removeSection2 = anodeCurvesConfigParsed.MeasurementType == MeasurementType.TriodeAnodeCurves ||
                             gridCurvesConfigParsed.MeasurementType == MeasurementType.TriodeGridCurves;

        var quickTestParsed = ParseAndPrettifyQuickTest(quickTest, removeSection2);

        var data = new MeasurementData(
            ProductId: measurement.ProductId,
            MeasurementId: measurement.Id,
            ManufactureCode: measurement.ManufactureCode,
            ProductState: measurement.ProductState,
            AnodeCurvesConfig: anodeCurvesConfigParsed,
            GridCurvesConfig: gridCurvesConfigParsed,
            AnodeCurves: ParseSpaceSeparatedTable(anodeCurves),
            GridCurves: ParseSpaceSeparatedTable(gridCurves),
            QuickTest: quickTestParsed
        );

        return data;
    }


    private static bool ReadMeasurementFile(
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


    private static MeasurementConfig ParseMeasurementConfigTable(byte[] data)
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
            MeasurementType: GetMeasurementType(
                measurementType: config["measurement type"]!.Value,
                y2AxisVariable: config["Y2 axis variable"]!.Value),
            Pmax: config["Pmax"]!.Value
        );
    }

    private static MeasurementType GetMeasurementType(int measurementType, int y2AxisVariable)
    {
        return measurementType switch
        {
            // I(Vg, Va) with Vs, Vh Constant
            1 => y2AxisVariable switch
            {
                // второго графика нет
                0 => MeasurementType.TriodeGridCurves,
                // Is
                2 => MeasurementType.DoubleTriodeGridCurves,
                _ => throw new ArgumentOutOfRangeException(nameof(y2AxisVariable))
            },

            // I(Va, Vg) with Vs, Vh Constant
            2 => MeasurementType.PentodeAnodeCurves,

            // I(Va=Vs, Vg) with Vh Constant
            4 => y2AxisVariable switch
            {
                // второго графика нет
                0 => MeasurementType.TriodeAnodeCurves,
                // Is
                2 => MeasurementType.DoubleTriodeAnodeCurves,
                _ => throw new ArgumentOutOfRangeException(nameof(y2AxisVariable))
            },

            // I(Vs, Vg) with Va, Vh Constant
            5 => MeasurementType.PentodeScreenCurves,
            _ => throw new ArgumentOutOfRangeException(nameof(measurementType))
        };
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
}