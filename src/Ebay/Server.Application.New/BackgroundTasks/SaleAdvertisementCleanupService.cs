using Server.Application.Abstractions.Driven.Abstractions.BackgroundTasks;

namespace Server.Application.New.BackgroundTasks;

/// <summary>
/// Удаляет устаревшие записи объявлений.
/// </summary>
public class SaleAdvertisementCleanupService
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
        var staleThreshold = DateTime.UtcNow - BackgroundTaskSchedule.RemoveAdvertisementAfter;
        return _productEmailSendHistoryRepository.DeleteCreatedBeforeAsync(staleThreshold, cancellationToken);
    }
}
