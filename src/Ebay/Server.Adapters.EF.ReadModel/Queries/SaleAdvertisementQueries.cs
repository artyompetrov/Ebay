using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Queries;
using Server.Application.HostedServices.ChipFind;

namespace Server.Adapters.EF.ReadModel.Queries;

internal class SaleAdvertisementQueries : ISaleAdvertisementQueries
{
    private readonly ReadDbContext _dbContext;

    public SaleAdvertisementQueries(ReadDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    
    public async Task<ICollection<SaleAdvertisement>?> GetSaleAdvertisementsAsync(Guid productId, CancellationToken cancellationToken)
    {
        var exist = await _dbContext.Products
            .AnyAsync(x => x.Id == productId, cancellationToken);

        if (!exist)
        {
            return null;
        }

        var ads = await _dbContext.ProductEmailSendHistory
            .Where(x => x.ProductId == productId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);

        return [.. ads
            .Select(x => new SaleAdvertisement(
                createdAt: x.CreatedAt,
                isAmbiguous: x.IsAmbiguous,
                link: x.Link,
                marketplace: x.Marketplace,
                seller: x.Seller,
                contact: x.Contact))];
        
    }
}