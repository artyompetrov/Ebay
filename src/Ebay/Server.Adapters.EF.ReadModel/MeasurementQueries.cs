using Microsoft.EntityFrameworkCore;
using Server.Application;
using Server.Application.Abstractions.Measurements;
using Server.Application.Services.Measurement;
using Server.Domain.Measurements;

namespace Sever.Adapters.EF.ReadModel;

internal sealed class MeasurementQueries : IMeasurementQueries
{
    private readonly ReadDbContext _dbContext;

    public MeasurementQueries(ReadDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<MeasurementState?> GetMeasurementState(string measurementId, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductMeasurements
            .Where(x => x.Id == measurementId)
            .Select(x => (MeasurementState?)x.MeasurementState)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<MeasurementInfoWithData>> GetMeasurementInfos(
        IReadOnlyList<string> ids,
        CancellationToken cancellationToken)
    {
        var measurements = await _dbContext.ProductMeasurements
            .AsNoTracking()
            .Where(pm => ids.Contains(pm.Id))
            .Select(pm => new MeasurementInfoWithData(
                pm.Id,
                pm.ProductId,
                pm.ProductState,
                pm.ManufactureCode,
                pm.Measurements
            ))
            .ToListAsync(cancellationToken);
        
        return measurements;
    }


    public async Task<IReadOnlyCollection<MeasurementInfo>> GetMeasurementsInfo(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken)
    {
        var measurementsQuery = await _dbContext.ProductMeasurements
            .AsNoTracking()
            .Where(m => m.ProductId == productId)
            .Where(m => measurementStates.Contains(m.MeasurementState))
            .Select(x =>
                new MeasurementInfo(
                    x.Id,
                    x.ProductId,
                    x.ProductState,
                    x.ManufactureCode
                ))
            .ToHashSetAsync(cancellationToken: cancellationToken);

        return measurementsQuery;
    }

    public async Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>>
        GetMeasurementInfosWithSimilarMeasurements(
            Guid productId,
            IReadOnlyCollection<MeasurementState> measurementStates,
            CancellationToken cancellationToken)
    {
        var measurementsQuery = from measurement in _dbContext.ProductMeasurements
            where measurement.ProductId == productId
            where measurementStates.Contains(measurement.MeasurementState)
            join difference in
                _dbContext.MatchedPairDifferences.AsNoTracking() // этот джойн нужен для двойных триодов
                on new
                {
                    MeasurementId1 = measurement.Id,
                    MeasurementId2 = measurement.Id,
                    ComparisonMode = ComparisonMode.Cross
                }
                equals new { difference.MeasurementId1, difference.MeasurementId2, difference.ComparisonMode }
                into differences
            from difference in differences.DefaultIfEmpty()
            orderby measurement.CreatedAt descending, measurement.Id descending
            select new MeasurementInfoWithSimilarMeasurements(
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
            .Where(x => x.MeasurementState == MeasurementState.Selling ||
                        x.MeasurementState == MeasurementState.Created)
            .Select(x => x.Id)
            .ToArray();

        var similarMeasurementsLookup = await GetSimilarMeasurements(
            cancellationToken: cancellationToken,
            measurementIds: measurementIds);

        return measurements
            .Select(measurement =>
            {
                if (similarMeasurementsLookup.TryGetValue(measurement.Id, out var similar))
                {
                    return measurement with { SimilarMeasurements = similar };
                }

                return measurement;
            })
            .ToList();
    }

    public async Task<Dictionary<string, IReadOnlyCollection<SimilarMeasurementInfo>>> GetSimilarMeasurements(
        CancellationToken cancellationToken,
        string[] measurementIds)
    {
        var similarMeasurements = await _dbContext.MatchedPairDifferences
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
                        Score: Math.Max(
                                   measurement.RmseSection1,
                                   measurement.RmseSection2 ?? 0.0) + // учет второй секции
                               (measurement.ComparisonMode == ComparisonMode.Cross
                                   ? 10.0
                                   : 0.0) + // штраф за cross-match
                               (!measurement.ManufactureCode1.Equals(
                                   measurement.ManufactureCode2,
                                   StringComparison.OrdinalIgnoreCase)
                                   ? 10.0
                                   : 0.0) // штраф за различие в ManufactureCode2
                    ))
                    .OrderBy(measurement => measurement.Score)
                    .DistinctBy(measurement => measurement.MeasurementId)
                    .Take(6)
                    .ToList());

        return similarMeasurementsLookup;
    }

    public async Task<MeasurementInfoWithData?> GetMeasurementInfoWithData(
        string measurementId,
        CancellationToken cancellationToken)
    {
        var measurementInfo = await _dbContext.ProductMeasurements
            .AsNoTracking()
            .Where(x => x.Id == measurementId)
            .Select(x => new MeasurementInfoWithData(x.Id, x.ProductId, x.ProductState, x.ManufactureCode, x.Measurements))
            .SingleOrDefaultAsync(cancellationToken: cancellationToken);

        return measurementInfo;
    }
}