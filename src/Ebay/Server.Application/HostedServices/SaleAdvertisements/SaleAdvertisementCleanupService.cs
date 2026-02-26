using Server.Application.Data.HostedServices;

namespace Server.Application.HostedServices.SaleAdvertisements;

public class SaleAdvertisementCleanupService
{
    private readonly IProductEmailSendHistoryRepository _productEmailSendHistoryRepository;

    public SaleAdvertisementCleanupService(IProductEmailSendHistoryRepository productEmailSendHistoryRepository)
    {
        _productEmailSendHistoryRepository = productEmailSendHistoryRepository;
    }

    public async Task CleanupAsync(CancellationToken cancellationToken)
    {
        var staleThreshold = DateTime.UtcNow - WellKnown.SaleAdvertisements.RemoveAdvertisementAfter;
        await _productEmailSendHistoryRepository.DeleteCreatedBeforeAsync(staleThreshold, cancellationToken);
    }
}
