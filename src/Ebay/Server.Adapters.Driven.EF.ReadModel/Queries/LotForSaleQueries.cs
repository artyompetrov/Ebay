using Microsoft.EntityFrameworkCore;
using Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain.Measurements;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class LotForSaleQueries : ILotForSaleQueries
{
    private readonly IDbContextFactory<ReadDbContext> _dbContextFactory;

    public LotForSaleQueries(IDbContextFactory<ReadDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    public async Task<IReadOnlyCollection<LotForSaleInfo>> GetLotForSalesAsync(CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        return await SelectLotForSaleInfos(dbContext, dbContext.LotForSales.OrderBy(x => x.Id))
            .ToListAsync(cancellationToken);
    }

    public async Task<LotForSaleInfo?> GetLotForSaleByIdAsync(string lotId, CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        return await SelectLotForSaleInfos(dbContext, dbContext.LotForSales.Where(x => x.Id == lotId))
            .FirstOrDefaultAsync(cancellationToken);
    }

    // Наличие считается коррелированным подзапросом, поэтому весь список лотов читается одним SQL-запросом.
    private static IQueryable<LotForSaleInfo> SelectLotForSaleInfos(
        ReadDbContext dbContext,
        IQueryable<LotForSaleView> lotForSales)
    {
        return lotForSales.Select(lot => new LotForSaleInfo(
            lot.Id,
            lot.Name,
            lot.ProductId,
            lot.ProductState,
            lot.MeasurementState,
            dbContext.ProductMeasurements
                .Where(measurement => measurement.LotId == lot.Id && measurement.MeasurementState != MeasurementState.Sold)
                .Select(measurement => measurement.MatchId ?? measurement.Id)
                .Distinct()
                .Count()));
    }
}
