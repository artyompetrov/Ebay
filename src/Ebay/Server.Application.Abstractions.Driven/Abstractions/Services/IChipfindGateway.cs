using Server.Application.Abstractions.Driven.Models.Services;

namespace Server.Application.Abstractions.Driven.Abstractions.Services;

public interface IChipfindGateway
{
    Task<IReadOnlyCollection<SaleAdvertisementDto>> GetRecentSaleAdvertisementsAsync(CancellationToken cancellationToken);

    Task<string?> TryGetAdvertisementContactAsync(SaleAdvertisementDto saleAdvertisement, CancellationToken cancellationToken);
}
