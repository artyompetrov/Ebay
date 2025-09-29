using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;
using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement;

public class MeasurementService
{

    private readonly IRepository<ProductMeasurement, string> _productMeasurementRepository;
    private readonly IMeasurementFileParser _measurementFileParser;

    public MeasurementService(
        IRepository<ProductMeasurement, string> productMeasurementRepository,
        IMeasurementFileParser measurementFileParser)
    {
        _productMeasurementRepository = productMeasurementRepository;
        _measurementFileParser = measurementFileParser;
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
        var measurement = ProductMeasurement.Create(
            id: measurementId,
            productId: productId,
            measurements: measurementsFile,
            manufactureCode: manufactureCode,
            location: location,
            matchId: matchId,
            productState: productState,
            measurementFileParser: _measurementFileParser
        );

        await _productMeasurementRepository.SaveAsync(measurement, cancellationToken);
    }

    public async Task UpdateMeasurementLocation(
        string location,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken);
        
        if (productMeasurement == null)
        {
            throw new InvalidOperationException("Measurement not found.");
        }

        productMeasurement.Location = location;
    }

    public async Task UpdateMeasurementMatchId(
        string? batchId,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken);


        if (productMeasurement == null)
        {
            throw new InvalidOperationException("Measurement not found.");
        }

        productMeasurement.MatchId = batchId;
    }

    public async Task UpdateMeasurementState(
        MeasurementState state,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken);

        if (productMeasurement == null)
        {
            throw new InvalidOperationException("Measurement not found.");
        }

        productMeasurement.MeasurementState = state;
    }

    public async Task DeleteMeasurement(Guid productId, string measurementId, CancellationToken cancellationToken)
    {
        await _productMeasurementRepository.RemoveAsync(measurementId, cancellationToken);
        
    }

    
    // todo унести на ридмодель
    public async Task<MeasurementState?> GetMeasurementState(string measurementId, CancellationToken cancellationToken)
    {
        return await _applicationContext.ProductMeasurements
            .AsNoTracking()
            .Where(x => x.Id == measurementId)
            .Select(x => (MeasurementState?)x.MeasurementState)
            .SingleOrDefaultAsync(cancellationToken);
    }

    // todo унести на ридмодель
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

    // унести на ридмодель
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

    // todo унести на ридмодель
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


    // todo унести на ридмодель

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

    // todo унести на ридмодель
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
}