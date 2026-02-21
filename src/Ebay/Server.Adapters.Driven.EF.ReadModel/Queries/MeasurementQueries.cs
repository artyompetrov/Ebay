using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain.Measurements;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class MeasurementQueries : IMeasurementQueries
{
    private readonly ReadDbContext _dbContext;
    public MeasurementQueries(ReadDbContext dbContext)
    {
        _dbContext = dbContext;
    }


    public async Task<MeasurementInfo?> GetMeasurementInfo(string measurementId, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductMeasurements
            .Where(x => x.Id == measurementId)
            .Select(x => new MeasurementInfo(
                x.Id,
                x.ProductId,
                x.MatchId,
                x.LotId,
                x.Location,
                x.MeasurementState,
                x.ProductState,
                x.ManufactureCode,
                x.CreatedAt,
                x.LastTimeWatchedOnEbay
            ))
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<MeasurementInfoWithData>> GetMeasurementInfosWithData(
        IReadOnlyList<string> ids,
        CancellationToken cancellationToken)
    {
        var measurements = await _dbContext.ProductMeasurements
            .AsNoTracking()
            .Where(pm => ids.Contains(pm.Id))
            .Select(pm => new MeasurementInfoWithData(
                pm.Id,
                pm.ProductId,
                pm.MatchId,
                pm.LotId,
                    pm.Location,
                pm.MeasurementState,
                pm.ProductState,
                pm.ManufactureCode,
                pm.LastTimeWatchedOnEbay,
                pm.CreatedAt,
                pm.Measurements

            ))
            .ToListAsync(cancellationToken);

        return measurements;
    }

    public async Task<double?> GetDoubleTriodeSectionRmse(string measurementId, CancellationToken cancellationToken)
    {
        return await _dbContext.MatchedPairDifferences
            .AsNoTracking()
            .Where(x => x.Measurement1Id == measurementId
                        && x.Measurement2Id == measurementId
                        && x.ComparisonMode == ComparisonMode.Cross)
            .Select(x => (double?)x.RmseSection1)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<string>> GetMeasurementPairMeasurements(string id, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductMeasurements
             .Where(x => x.MatchId != null) // чтоб не тянуть весь null
             .Where(x => x.MatchId == _dbContext.ProductMeasurements
                 .Where(m => m.Id == id)
                 .Select(m => m.MatchId)
                 .FirstOrDefault())
             .Where(x => x.Id != id)
             .Select(x => x.Id)
             .OrderBy(x => x)
             .ToListAsync(cancellationToken: cancellationToken);
    }

    public async Task<IReadOnlySet<string?>> GetLotIds(Guid productId, CancellationToken cancellationToken)
    {
        return await _dbContext.ProductMeasurements.Where(x => x.ProductId == productId)
            .Select(x => x.LotId)
            .Distinct()
            .OrderByDescending(x => x)
            .ToHashSetAsync(cancellationToken);
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
                    x.MatchId,
                    x.LotId,
                    x.Location,
                    x.MeasurementState,
                    x.ProductState,
                    x.ManufactureCode,
                    x.CreatedAt,
                    x.LastTimeWatchedOnEbay
                ))
            .ToHashSetAsync(cancellationToken: cancellationToken);

        return measurementsQuery;
    }

    public Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfosWithSimilarMeasurements(
        Guid productId,
        IReadOnlyCollection<ProductState> productStates,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken)
    {
        return GetMeasurementInfosWithSimilarMeasurementsInternal(
            productId: productId,
            withLotIdFilter: false,
            lotId: null,
            productStates: productStates,
            measurementStates: measurementStates,
            cancellationToken: cancellationToken);
    }

    public Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>>
        GetMeasurementInfosWithSimilarMeasurements(
            Guid productId,
            string? lotId,
            IReadOnlyCollection<ProductState> productStates,
            IReadOnlyCollection<MeasurementState> measurementStates,
            CancellationToken cancellationToken)
    {
        return GetMeasurementInfosWithSimilarMeasurementsInternal(
            productId: productId,
            withLotIdFilter: true,
            lotId: lotId,
            productStates: productStates,
            measurementStates: measurementStates,
            cancellationToken: cancellationToken);
    }

    private async Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>>
        GetMeasurementInfosWithSimilarMeasurementsInternal(
            Guid productId,
            bool withLotIdFilter,
            string? lotId,
            IReadOnlyCollection<ProductState> productStates,
            IReadOnlyCollection<MeasurementState> measurementStates,
            CancellationToken cancellationToken)
    {
        var measurementsQuery = from measurement in _dbContext.ProductMeasurements
                                where measurement.ProductId == productId
                                where !withLotIdFilter || measurement.LotId == lotId
                                where productStates.Contains(measurement.ProductState)
                                where measurementStates.Contains(measurement.MeasurementState)
                                join difference in
                                    _dbContext.MatchedPairDifferences.AsNoTracking() // этот джойн нужен для двойных триодов
                                    on new
                                    {
                                        MeasurementId1 = measurement.Id,
                                        MeasurementId2 = measurement.Id,
                                        ComparisonMode = ComparisonMode.Cross
                                    }
                                    equals new
                                    {
                                        MeasurementId1 = difference.Measurement1Id,
                                        MeasurementId2 = difference.Measurement2Id,
                                        difference.ComparisonMode
                                    }
                                    into differences
                                from difference in differences.DefaultIfEmpty()
                                orderby measurement.MatchId, measurement.CreatedAt descending, measurement.Id descending
                                select new MeasurementInfoWithSimilarMeasurements(
                                    new MeasurementInfo(
                                        measurement.Id,
                                        measurement.ProductId,
                                        measurement.MatchId,
                                        measurement.LotId,
                                        measurement.Location,
                                        measurement.MeasurementState,
                                        measurement.ProductState,
                                        measurement.ManufactureCode,
                                        measurement.CreatedAt,
                                        measurement.LastTimeWatchedOnEbay
                                    ),
                                    difference == null ? null : difference.RmseSection1,
                                                        Array.Empty<SimilarMeasurementInfo>(),
                                                        null);

        var measurements = await measurementsQuery.ToListAsync(cancellationToken);

        if (measurements.Count == 0)
        {
            return measurements;
        }

        var measurementIds = measurements
            .Where(x => x.MeasurementInfo.MeasurementState is MeasurementState.Selling or
                        MeasurementState.Created)
            .Select(x => x.MeasurementInfo.Id)
            .ToArray();

        var similarMeasurementsLookup = await GetSimilarMeasurements(
            cancellationToken: cancellationToken,
            measurementIds: measurementIds);

        var result = measurements
            .Select(measurement =>
            {
                if (similarMeasurementsLookup.TryGetValue(measurement.MeasurementInfo.Id, out var similar))
                {
                    var withSimilar = measurement with
                    {
                        SimilarMeasurements = similar,
                        ScorePlusBalance = similar.Min(x => x.Score) + (measurement.DoubleTriodeSectionRmse ?? 0.0)
                    };

                    return withSimilar;
                }

                return measurement;
            })
            .OrderByDescending(x => x.MeasurementInfo.MatchId)
            .ThenBy(x => x.ScorePlusBalance)
            .ToList();

        return result;
    }



    private async Task<Dictionary<string, IReadOnlyCollection<SimilarMeasurementInfo>>> GetSimilarMeasurements(
        string[] measurementIds, CancellationToken cancellationToken)
    {
        var similarMeasurements = await _dbContext.MatchedPairDifferences
            .AsNoTracking()
            .Where(x => measurementIds.Contains(x.Measurement1Id))
            .Where(x => x.Measurement1Id != x.Measurement2Id)
            .Where(x =>
                x.Measurement1.MeasurementState == x.Measurement2.MeasurementState &&
                x.Measurement1.ProductState == x.Measurement2.ProductState)
            .Select(x => new
            {
                MeasurementId1 = x.Measurement1Id,
                MeasurementId2 = x.Measurement2Id,
                x.RmseSection1,
                x.RmseSection2,
                x.ComparisonMode,
                ManufactureCode1 = x.Measurement1.ManufactureCode,
                ManufactureCode2 = x.Measurement2.ManufactureCode,
                IsMatchedPair = x.Measurement2.MatchId != null && x.Measurement1.MatchId == x.Measurement2.MatchId,
                x.Measurement2.MatchId,
                DoubleTriodeSectionRmseTube1 = _dbContext.MatchedPairDifferences
                    .Where(m => m.Measurement1Id == x.Measurement1Id && m.Measurement2Id == x.Measurement1Id && m.ComparisonMode == ComparisonMode.Cross)
                    .Select(m => m.RmseSection1)     // любой скалярный столбец
                    .FirstOrDefault(),
                DoubleTriodeSectionRmseTube2 = _dbContext.MatchedPairDifferences
                    .Where(m => m.Measurement1Id == x.Measurement2Id && m.Measurement2Id == x.Measurement2Id && m.ComparisonMode == ComparisonMode.Cross)
                    .Select(m => m.RmseSection1)     // любой скалярный столбец
                    .FirstOrDefault()
            })
            .ToListAsync(cancellationToken);

        var similarMeasurementsLookup = similarMeasurements
            .GroupBy(x => x.MeasurementId1)
            .ToDictionary(
                x => x.Key,
                x => (IReadOnlyCollection<SimilarMeasurementInfo>)[.. x
                    .Select(measurement => new SimilarMeasurementInfo(
                        MeasurementId: measurement.MeasurementId2,
                        ManufactureCode: measurement.ManufactureCode2,
                        RmseSection1: measurement.RmseSection1,
                        RmseSection2: measurement.RmseSection2,
                        ComparisonMode: measurement.ComparisonMode,
                        Score:
                                //берем максимальную ошибку из двух секций
                                Math.Max(
                                   measurement.RmseSection1,
                                   measurement.RmseSection2 ?? 0.0) // учет второй секции

                                // штраф за cross-match
                                + (measurement.ComparisonMode == ComparisonMode.Cross
                                   ? 10.0
                                   : 0.0) +

                               //штраф за различие в ManufactureCode2
                               +(!measurement.ManufactureCode1.Equals(
                                   measurement.ManufactureCode2,
                                   StringComparison.OrdinalIgnoreCase)
                                   ? 10.0
                                   : 0.0)
                               // добавляем разность балансов для двоиных триодов
                               + Math.Abs(measurement.DoubleTriodeSectionRmseTube1 - measurement.DoubleTriodeSectionRmseTube2),
                        IsMatchedPair: measurement.IsMatchedPair,
                        MatchId: measurement.MatchId,
                        DoubleTriodeSectionRmse: measurement.DoubleTriodeSectionRmseTube2
                    ))
                    .OrderBy(measurement => !measurement.IsMatchedPair)
                    .ThenBy(measurement => measurement.Score)
                    .DistinctBy(measurement => measurement.MeasurementId)
                    .Take(6)]);

        return similarMeasurementsLookup;
    }

    public async Task<MeasurementInfoWithData?> GetMeasurementInfoWithData(
        string measurementId,
        CancellationToken cancellationToken)
    {
        var measurementInfo = await _dbContext.ProductMeasurements
            .AsNoTracking()
            .Where(x => x.Id == measurementId)
            .Select(x => new MeasurementInfoWithData(
                x.Id, x.ProductId,
                x.MatchId,
                x.LotId,
                x.Location,
                x.MeasurementState,
                x.ProductState,
                x.ManufactureCode,
                x.LastTimeWatchedOnEbay,
                x.CreatedAt,
                x.Measurements))
            .SingleOrDefaultAsync(cancellationToken: cancellationToken);

        return measurementInfo;
    }
}