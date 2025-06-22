namespace Server.HostedServices;

public interface IChipfindAdapter
{
    Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentSaleAdvertisements(CancellationToken cancellationToken);
}