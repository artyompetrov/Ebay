namespace Server.HostedServices.ChipFind;

public interface IChipfindAdapter
{
    Task<IReadOnlyCollection<SaleAdvertisement>> GetRecentSaleAdvertisements(CancellationToken cancellationToken);
}