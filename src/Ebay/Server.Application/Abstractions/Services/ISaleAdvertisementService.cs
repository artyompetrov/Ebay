using Server.Application.HostedServices.ChipFind;

namespace Server.Application.Abstractions.Services;

public interface ISaleAdvertisementService
{
    Task<ICollection<SaleAdvertisement>> GetSaleAdvertisementsAsync(Guid productId, CancellationToken cancellationToken);
}