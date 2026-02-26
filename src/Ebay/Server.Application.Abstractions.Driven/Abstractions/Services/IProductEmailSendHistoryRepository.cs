using Server.Application.Abstractions.Driven.Models.Services;

namespace Server.Application.Abstractions.Driven.Abstractions.Services;

public interface IProductEmailSendHistoryRepository
{
    Task<ProductEmailSendHistoryRecord?> GetByProductAndSellerAsync(
        Guid productId,
        string seller,
        string marketplace,
        CancellationToken cancellationToken);

    Task AddAsync(ProductEmailSendHistoryRecord entity, CancellationToken cancellationToken);

    Task UpdateAsync(ProductEmailSendHistoryRecord entity, CancellationToken cancellationToken);

    Task SaveChangesAsync(CancellationToken cancellationToken);

    Task DeleteCreatedBeforeAsync(DateTime thresholdUtc, CancellationToken cancellationToken);
}
