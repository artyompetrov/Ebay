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
    private readonly ReadDbContext _readDbContext;

    public ProductQueries(ReadDbContext readDbContext)
    {
        _readDbContext = readDbContext;
    }

    public async Task<ProductInfo?> GetProductAsync(Guid productId, CancellationToken cancellationToken)
    {
        await using var transaction = await _readDbContext.Database.BeginTransactionAsync(
            isolationLevel: IsolationLevel.RepeatableRead,
            cancellationToken: cancellationToken);

        var result = await _readDbContext
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
            LastCheckTime: result.LastCheckTime
        );
    }

    public async Task<IReadOnlyList<ProductInfo>> GetAllProductsAsync(CancellationToken cancellationToken)
    {
        await using var transaction = await _readDbContext.Database.BeginTransactionAsync(
            isolationLevel: IsolationLevel.RepeatableRead,
            cancellationToken: cancellationToken);

        var products = await _readDbContext
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
            LastCheckTime: p.LastCheckTime
        )).ToList();

        return result;
    }

    public async Task<IReadOnlyList<Guid>> GetAllProductsIdsAsync(CancellationToken cancellationToken) => await _readDbContext.Products.Select(x => x.Id).ToListAsync(cancellationToken: cancellationToken);

    public async Task<IReadOnlyList<LotCalculationResult>> GetLotCalculationResultsAsync(Guid productId, CancellationToken cancellationToken)
    {
        var result = await _readDbContext.Lots
            .Where(x => x.ProductId == productId && x.LotCalculationResult != null)
            .Select(x => x.LotCalculationResult!)
            .ToListAsync(cancellationToken);

        return result;
    }

    public async Task<int> GetUnpublishedOnEbayCountAsync(
        Guid productId,
        MeasurementState measurementState,
        DateTime publishedThreshold,
        CancellationToken cancellationToken)
    {
        var result = await _readDbContext.ProductMeasurements
            .CountAsync(
                x => x.ProductId == productId &&
                     x.MeasurementState == measurementState &&
                     (x.LastTimeWatchedOnEbay == null || x.LastTimeWatchedOnEbay <= publishedThreshold),
                cancellationToken);

        return result;
    }
}
