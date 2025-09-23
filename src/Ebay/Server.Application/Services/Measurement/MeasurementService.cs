using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;
using Server.Application.Services.Measurement.MeasurementTypes;
using Server.Application.Services.Measurement.MeasurementTypes.Base;
using Server.Domain.Measurements;

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
        string? matchId,
        Guid productId,
        CancellationToken cancellationToken)
    {
        if (!Regex.IsMatch(input: measurementId, pattern: "^[A-Z0-9]+$"))
        {
            throw new MeasurementException($"Incorrect MeasurementId Format {measurementId}");
        }

        if (!ReadMeasurementFile(
                measurementData: measurementsFile,
                errors: out var fileErrors,
                anodeCurvesConfig: out var anodeCurvesConfig,
                anodeCurves: out var anodeCurves,
                quickTest: out var quickTest,
                fileCount: out var fileCount))
        {
            throw new MeasurementException($"Errors during file parsing {string.Join(separator: ", ", values: fileErrors)}");
        }

        if (fileCount != 3)
        {
            throw new MeasurementException($"Exactly 3 files is expected but was {fileCount}");
        }

        // Проверка, что измерения загружены правильно
        try
        {
            var config = ParseMeasurementConfigTable(configBytes: anodeCurvesConfig, measurementBytes: anodeCurves);

            if (config.NumberOfIntervals < 30)
            {
                throw new MeasurementException("At least 30 intervals is expected");
            }

            if (config.SteppingVariableCount < 9)
            {
                throw new MeasurementException("At least 9 stepping variables is expected");
            }

            if (config.MeasurementType is not TriodeAnodeCurves &&
                config.MeasurementType is not DoubleTriodeAnodeCurves &&
                config.MeasurementType is not PentodeAnodeCurves)
            {
                throw new MeasurementException("AnodeCurves expected");
            }

            ParseSpaceSeparatedTable(anodeCurves);
            ParseAndPrettifyQuickTest(quickTest: quickTest, removeSection2: false);

            var hashAnodeCurvesConfig = ComputeEntryHashAsync(anodeCurvesConfig);
            var hashAnodeCurves = ComputeEntryHashAsync(anodeCurves);

            var hashQuickTest = ComputeEntryHashAsync(quickTest);

            var hashes = new HashSet<string>
            {
                hashAnodeCurvesConfig,
                hashAnodeCurves,
                hashQuickTest
            };

            if (hashes.Count != 3)
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
                    HashQuickTest = hashQuickTest ?? throw new NullReferenceException(nameof(hashQuickTest)),
                    ManufactureCode = manufactureCode,
                    Location = location,
                    MatchId = matchId
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

    public async Task UpdateMeasurementMatchId(
        string? batchId,
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

        measurement.MatchId = batchId;

        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task UpdateMeasurementState(
        MeasurementState state,
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

        measurement.MeasurementState = state;

        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteMeasurement(Guid productId, string measurementId, CancellationToken cancellationToken)
    {
        _applicationContext.ProductMeasurements.RemoveRange(
            _applicationContext.ProductMeasurements.Where(x =>
                x.ProductId == productId && x.Id == measurementId));

        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<MeasurementState?> GetMeasurementState(string measurementId, CancellationToken cancellationToken)
    {
        return await _applicationContext.ProductMeasurements
            .AsNoTracking()
            .Where(x => x.Id == measurementId)
            .Select(x => (MeasurementState?)x.MeasurementState)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<string>> GetMeasurementIds(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken)
    {
        var measurementsQuery = _applicationContext.ProductMeasurements
            .AsNoTracking()
            .Where(m => m.ProductId == productId)
            .Where(m => measurementStates.Contains(m.MeasurementState));

        return await measurementsQuery
            .OrderBy(m => m.Id)
            .Select(m => m.Id)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyCollection<MeasurementInfo>> GetMeasurementInfos(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken)
    {
        var measurementsQuery = from measurement in _applicationContext.ProductMeasurements.AsNoTracking()
                                where measurement.ProductId == productId
                                where measurementStates.Contains(measurement.MeasurementState)
                                join difference in _applicationContext.MatchedPairDifferences.AsNoTracking() // этот джойн нужен для двойных триодов
                                    on new
                                    {
                                        MeasurementId1 = measurement.Id,
                                        MeasurementId2 = measurement.Id,
                                        ComparisonMode = ComparisonMode.Cross
                                    }
                                    equals new
                                    {
                                        difference.MeasurementId1,
                                        difference.MeasurementId2,
                                        difference.ComparisonMode
                                    }
                                    into differences
                                from difference in differences.DefaultIfEmpty()
                                orderby measurement.CreatedAt descending, measurement.Id descending
                                select new MeasurementInfo(
                                    measurement.Id,
                                    measurement.ManufactureCode,
                                    measurement.ProductState,
                                    measurement.Location,
                                    measurement.MatchId,
                                    difference != null ? difference.RmseSection1 : null,
                                    measurement.MeasurementState);

        var measurements = await measurementsQuery.ToListAsync(cancellationToken);

        if (measurements.Count == 0)
        {
            return measurements;
        }

        var measurementIds = measurements
            .Where(x => x.MeasurementState == MeasurementState.Selling || x.MeasurementState == MeasurementState.Created)
            .Select(x => x.Id)
            .ToArray();

        var similarMeasurementsLookup = await GetSimilarMeasurements(cancellationToken: cancellationToken, measurementIds: measurementIds);

        return measurements
            .Select(measurement =>
            {
                if (similarMeasurementsLookup.TryGetValue(measurement.Id, out var similar))
                {
                    return measurement with
                    {
                        SimilarMeasurements = similar
                    };
                }

                return measurement;
            })
            .ToList();
    }

    private async Task<Dictionary<string, IReadOnlyCollection<SimilarMeasurementInfo>>> GetSimilarMeasurements(
        CancellationToken cancellationToken,
        string[] measurementIds)
    {
        var similarMeasurements = await _applicationContext.MatchedPairDifferences
            .AsNoTracking()
            .Where(x => measurementIds.Contains(x.MeasurementId1))
            .Where(x => x.MeasurementId1 != x.MeasurementId2)
            .Where(x =>
                x.Measurement1.MeasurementState == x.Measurement2.MeasurementState &&
                x.Measurement1.ProductState == x.Measurement2.ProductState)
            .Select(x => new
            {
                x.MeasurementId1,
                x.MeasurementId2,
                x.RmseSection1,
                x.RmseSection2,
                x.ComparisonMode,
                ManufactureCode1 = x.Measurement1.ManufactureCode,
                ManufactureCode2 = x.Measurement2.ManufactureCode
            })
            .ToListAsync(cancellationToken);

        var similarMeasurementsLookup = similarMeasurements
            .GroupBy(x => x.MeasurementId1)
            .ToDictionary(
                x => x.Key,
                x => (IReadOnlyCollection<SimilarMeasurementInfo>)x
                    .Select(measurement => new SimilarMeasurementInfo(
                        MeasurementId: measurement.MeasurementId2,
                        ManufactureCode: measurement.ManufactureCode2,
                        RmseSection1: measurement.RmseSection1,
                        RmseSection2: measurement.RmseSection2,
                        ComparisonMode: measurement.ComparisonMode,
                        Score: Math.Max(measurement.RmseSection1, measurement.RmseSection2 ?? 0.0) + // учет второй секции
                               (measurement.ComparisonMode == ComparisonMode.Cross ? 10.0 : 0.0) + // штраф за cross-match
                               (!measurement.ManufactureCode1.Equals(measurement.ManufactureCode2, StringComparison.OrdinalIgnoreCase) ? 10.0 : 0.0) // штраф за различие в ManufactureCode2
                    ))
                    .OrderBy(measurement => measurement.Score)
                    .DistinctBy(measurement => measurement.MeasurementId)
                    .Take(6)
                    .ToList());

        return similarMeasurementsLookup;
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
                errors: out _,
                anodeCurvesConfig: out var anodeCurvesConfig,
                anodeCurves: out var anodeCurves,
                quickTest: out var quickTest,
                fileCount: out _))
        {
            return null;
        }

        using var zipStream = new MemoryStream();
        using (var archive = new ZipArchive(stream: zipStream, mode: ZipArchiveMode.Create, leaveOpen: true))
        {

            await SaveFileToZipArchive(
                archive: archive,
                fileName: "anode_curves_measurement_config.uts",
                content: anodeCurvesConfig);
            await SaveFileToZipArchive(archive: archive, fileName: "anode_curves.utd", content: anodeCurves);
            await SaveFileToZipArchive(archive: archive, fileName: "quick_test.txt", content: quickTest);
        }

        zipStream.Position = 0;

        return zipStream.ToArray();
    }

    private async static Task SaveFileToZipArchive(ZipArchive archive, string fileName, byte[] content)
    {
        var entry = archive.CreateEntry(fileName);
        await using var entryStream = entry.Open();
        await entryStream.WriteAsync(content, 0, content.Length);
    }


    public async Task<MeasurementData?> GetMeasurement(
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
                anodeCurvesConfig: out var anodeCurvesConfigBytes,
                anodeCurves: out var anodeCurvesBytes,
                quickTest: out var quickTest,
                fileCount: out var fileCount
                ))
        {
            return null;
        }

        var anodeCurves =
            ParseMeasurementConfigTable(anodeCurvesConfigBytes, anodeCurvesBytes).MeasurementType as AnodeCurvesBase ??
            throw new InvalidOperationException($"{nameof(AnodeCurvesBase)} is expected");

        var gridCurves = anodeCurves.ConvertToGridCurves();

        var removeSection2 = anodeCurves is TriodeAnodeCurves;

        var quickTestParsed = ParseAndPrettifyQuickTest(quickTest, removeSection2);

        var data = new MeasurementData(
            ProductId: measurement.ProductId,
            MeasurementId: measurement.Id,
            ManufactureCode: measurement.ManufactureCode,
            ProductState: measurement.ProductState,
            AnodeCurves: anodeCurves,
            GridCurves: gridCurves,
            QuickTest: quickTestParsed
        );

        return data;
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

    private static MeasurementTypeBase? GetMeasurementType(int measurementType, int y2AxisVariable, double pmaxWatt, Dictionary<int, MeasurementPoint[]> measurementPoints)
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