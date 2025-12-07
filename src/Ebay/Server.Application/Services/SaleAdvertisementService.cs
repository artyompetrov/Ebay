using Server.Application.Abstractions.Services;

namespace Server.Application.Services;

public class SaleAdvertisementService : ISaleAdvertisementService
{
    public void GetSaleAdvertisementsAsync(Guid productId, CancellationToken cancellationToken)
    {
        var exist = await _applicationContext.Products
            .AsNoTracking()
            .AnyAsync(x => x.Id == productId, cancellationToken);

        if (!exist)
        {
            throw NonOkHttpAnswerException.NotFound400();
        }

        var ads = await _applicationContext.ProductEmailSendHistory
            .AsNoTracking()
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