using Server.Application.Abstractions.Driven.Abstractions.Services;

namespace Server.Application.New.Services;

/// <summary>
/// Удаляет устаревшие записи объявлений.
/// </summary>
public class SaleAdvertisementCleanupService : Server.Application.Abstractions.Driving.Abstractions.Services.BackgroundProcessing.ISaleAdvertisementCleanupService
{
    private readonly IProductEmailSendHistoryRepository _productEmailSendHistoryRepository;

    /// <summary>
    /// Создает сервис очистки устаревших объявлений.
    /// </summary>
    public SaleAdvertisementCleanupService(IProductEmailSendHistoryRepository productEmailSendHistoryRepository)
    {
        _productEmailSendHistoryRepository = productEmailSendHistoryRepository;
    }

    /// <summary>
    /// Удаляет устаревшие записи.
    /// </summary>
    public Task CleanupAsync(CancellationToken cancellationToken)
    {
        var staleThreshold = DateTime.UtcNow - TimeSpan.FromDays(90);
        return _productEmailSendHistoryRepository.DeleteCreatedBeforeAsync(staleThreshold, cancellationToken);
    }
}
