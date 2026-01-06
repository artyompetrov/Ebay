using Server.Application.HostedServices.ChipFind;

namespace Server.Application.Abstractions.Queries;

public interface ISaleAdvertisementQueries
{
    Task<ICollection<SaleAdvertisement>?> GetSaleAdvertisementsAsync(Guid productId, CancellationToken cancellationToken);
}