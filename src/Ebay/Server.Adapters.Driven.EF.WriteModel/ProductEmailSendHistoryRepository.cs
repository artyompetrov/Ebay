using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Services;
using Server.Application.Abstractions.Driven.Models.Services;
using Server.Application.Data;
using Server.Domain;

namespace Server.Adapters.Driven.EF.WriteModel;

public class ProductEmailSendHistoryRepository : IProductEmailSendHistoryRepository
{
    private readonly ApplicationDbContext _dbContext;

    public ProductEmailSendHistoryRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProductEmailSendHistoryRecord?> GetByProductAndSellerAsync(
        Guid productId,
        string seller,
        string marketplace,
        CancellationToken cancellationToken)
    {
        var entity = await _dbContext.ProductEmailSendHistory
            .FirstOrDefaultAsync(
                e => e.ProductId == productId && e.Seller == seller && e.Marketplace == marketplace,
                cancellationToken);

        return entity is null
            ? null
            : new ProductEmailSendHistoryRecord(entity.ProductId, entity.Seller, entity.Link, entity.Contact, entity.Marketplace, entity.IsAmbiguous, entity.CreatedAt, entity.Id);
    }

    public async Task AddAsync(ProductEmailSendHistoryRecord entity, CancellationToken cancellationToken)
    {
        _ = await _dbContext.ProductEmailSendHistory.AddAsync(Map(entity), cancellationToken);
    }

    public async Task UpdateAsync(ProductEmailSendHistoryRecord entity, CancellationToken cancellationToken)
    {
        if (entity.Id is null)
        {
            throw new InvalidOperationException("Record id is required for update");
        }

        var existing = await _dbContext.ProductEmailSendHistory.FirstAsync(x => x.Id == entity.Id.Value, cancellationToken);
        existing.Link = entity.Link;
        existing.Contact = entity.Contact;
        existing.IsAmbiguous = entity.IsAmbiguous;
        existing.CreatedAt = entity.CreatedAt;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        _ = await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public Task DeleteCreatedBeforeAsync(DateTime thresholdUtc, CancellationToken cancellationToken)
    {
        return _dbContext.ProductEmailSendHistory.Where(e => e.CreatedAt < thresholdUtc).ExecuteDeleteAsync(cancellationToken);
    }

    private static ProductEmailSendHistory Map(ProductEmailSendHistoryRecord entity) =>
        new()
        {
            ProductId = entity.ProductId,
            Seller = entity.Seller,
            Link = entity.Link,
            Contact = entity.Contact,
            Marketplace = entity.Marketplace,
            IsAmbiguous = entity.IsAmbiguous,
            CreatedAt = entity.CreatedAt
        };
}
