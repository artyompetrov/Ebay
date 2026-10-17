using System.Data;
using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain;
using Server.Domain.Measurements;
using Server.Domain.Product;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class ProductQueries : IProductQueries
{
    private readonly IDbContextFactory<ReadDbContext> _dbContextFactory;

    public ProductQueries(IDbContextFactory<ReadDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    public async Task<ProductInfo?> GetProductAsync(Guid productId, CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            isolationLevel: IsolationLevel.RepeatableRead,
            cancellationToken: cancellationToken);

        var result = await dbContext
            .Products
            .AsSplitQuery()
            .Include(x => x.SearchQueries)
            .Include(productView => productView.RuSearchQueries)
            .SingleOrDefaultAsync(x => x.Id == productId, cancellationToken: cancellationToken);

        if (result == null)
        {
            return null;
        }

        await transaction.CommitAsync(cancellationToken);

        return new ProductInfo(
            Id: result.Id,
            Name: result.Name,
            SearchQueries: [.. result.SearchQueries.Select(x => new SearchQueryWithId(x.Id, x.Query))],
            RuSearchQueries: [.. result.RuSearchQueries.Select(x => new SearchQueryWithId(x.Id, x.Query))],
            Weight: result.Weight,
            CalculationResult: result.ProductCalculationResult,
            LastCheckTime: result.LastCheckTime,
            Description: result.Description
        );
    }

    public async Task<IReadOnlyList<ProductInfo>> GetAllProductsAsync(CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        await using var transaction = await dbContext.Database.BeginTransactionAsync(
            isolationLevel: IsolationLevel.RepeatableRead,
            cancellationToken: cancellationToken);

        var products = await dbContext
            .Products
            .AsNoTracking()
            .AsSplitQuery()
            .Include(p => p.SearchQueries)
            .Include(p => p.RuSearchQueries)
            .OrderBy(x => x.Name)
            .ToListAsync(cancellationToken);

        await transaction.CommitAsync(cancellationToken);

        var result = products.Select(p => new ProductInfo(
            Id: p.Id,
            Name: p.Name,
            SearchQueries: [.. p.SearchQueries.Select(q => new SearchQueryWithId(q.Id, q.Query))],
            RuSearchQueries: [.. p.RuSearchQueries.Select(q => new SearchQueryWithId(q.Id, q.Query))],
            Weight: p.Weight,
            CalculationResult: p.ProductCalculationResult,
            LastCheckTime: p.LastCheckTime,
            Description: p.Description
        )).ToList();

        return result;
    }

    public async Task<IReadOnlyList<Guid>> GetAllProductsIdsAsync(CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        return await dbContext.Products.Select(x => x.Id).ToListAsync(cancellationToken: cancellationToken);
    }

    public async Task<IReadOnlyList<LotCalculationResult>> GetLotCalculationResultsAsync(Guid productId, CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        var result = await dbContext.Lots
            .Where(x => x.ProductId == productId && x.LotCalculationResult != null)
            .Select(x => x.LotCalculationResult!)
            .ToListAsync(cancellationToken);

        return result;
    }

    public async Task<int> GetUnpublishedOnEbayCountAsync(
        Guid productId,
        MeasurementState measurementState,
        DateTimeOffset publishedThreshold,
        CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        var result = await dbContext.ProductMeasurements
            .CountAsync(
                x => x.ProductId == productId &&
                     x.MeasurementState == measurementState &&
                     (x.LastTimeWatchedOnEbay == null || x.LastTimeWatchedOnEbay <= publishedThreshold),
                cancellationToken);

        return result;
    }
}