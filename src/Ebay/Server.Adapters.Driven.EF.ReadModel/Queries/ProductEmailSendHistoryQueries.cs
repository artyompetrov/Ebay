using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class ProductEmailSendHistoryQueries : IProductEmailSendHistoryQueries
{
    private readonly IDbContextFactory<ReadDbContext> _dbContextFactory;

    public ProductEmailSendHistoryQueries(IDbContextFactory<ReadDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    public async Task<Guid?> FindIdAsync(Guid productId, string seller, string marketplace, CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        return await dbContext.ProductEmailSendHistories
            .Where(x => x.ProductId == productId && x.Seller == seller && x.Marketplace == marketplace)
            .Select(x => (Guid?)x.Id)
            .SingleOrDefaultAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<ProductEmailSendHistoryDetails>> GetForProductAsync(Guid productId, CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        var history = await dbContext.ProductEmailSendHistories
            .Where(x => x.ProductId == productId)
            .OrderByDescending(x => x.AdvertisementDate)
            .ToListAsync(cancellationToken);

        return [.. history.Select(x => new ProductEmailSendHistoryDetails(
            Id: x.Id,
            ProductId: x.ProductId,
            Seller: x.Seller,
            Link: x.Link,
            Marketplace: x.Marketplace,
            IsAmbiguous: x.IsAmbiguous,
            AdvertisementDate: x.AdvertisementDate,
            Contact: x.Contact))];
    }
}
