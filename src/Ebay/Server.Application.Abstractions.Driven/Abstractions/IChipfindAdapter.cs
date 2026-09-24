using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт для получения объявлений о продаже с внешней площадки chipfind.ru.
/// </summary>
public interface IChipfindAdapter
{
    Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentSaleAdvertisements(CancellationToken cancellationToken);

    Task<string?> TryGetAdvertisementContactAsync(SaleAdvertisement saleAdvertisement, CancellationToken cancellationToken);
}
