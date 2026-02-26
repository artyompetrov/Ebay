using Server.Application.Abstractions.Driven.Models.BackgroundTasks;

namespace Server.Application.Abstractions.Driven.Abstractions.BackgroundTasks;

public interface IChipfindGateway
{
    Task<IReadOnlyCollection<SaleAdvertisementDto>> GetRecentSaleAdvertisementsAsync(CancellationToken cancellationToken);

    Task<string?> TryGetAdvertisementContactAsync(
        SaleAdvertisementDto saleAdvertisement,
        CancellationToken cancellationToken);
}
