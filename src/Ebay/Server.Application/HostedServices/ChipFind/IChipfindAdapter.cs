namespace Server.Application.HostedServices.ChipFind;

public interface IChipfindAdapter
{
    Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentSaleAdvertisements(CancellationToken cancellationToken);
    Task<string?> TryGetAdvertisementContactAsync(Uri link, CancellationToken cancellationToken);
}