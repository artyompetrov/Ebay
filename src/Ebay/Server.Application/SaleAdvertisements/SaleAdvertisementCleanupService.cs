using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.LotForSale;

namespace Server.Application.SaleAdvertisements;

/// <summary>
/// Сценарий очистки устаревшей истории отправки писем по объявлениям о продаже.
/// </summary>
public class SaleAdvertisementCleanupService
{
    private readonly IProductEmailSendHistoryRepository _productEmailSendHistoryRepository;
    private readonly ICurrentTimeProvider _currentTimeProvider;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;

    /// <summary>
    /// Создает сервис очистки истории отправки писем по объявлениям о продаже.
    /// </summary>
    public SaleAdvertisementCleanupService(
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        IProductEmailSendHistoryRepository productEmailSendHistoryRepository,
        ICurrentTimeProvider currentTimeProvider)
    {
        _unitOfWorkFactory = unitOfWorkFactory;
        _productEmailSendHistoryRepository = productEmailSendHistoryRepository;
        _currentTimeProvider = currentTimeProvider;
    }

    /// <summary>
    /// Удаляет записи об объявлениях, не обновлявшихся дольше <see cref="WellKnown.SaleAdvertisements.RemoveAdvertisementAfter"/>.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    public async Task RemoveStaleAdvertisementsAsync(CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var staleThreshold = _currentTimeProvider.UtcNow - WellKnown.SaleAdvertisements.RemoveAdvertisementAfter;

        await _productEmailSendHistoryRepository.RemoveOlderThanAsync(unitOfWork, staleThreshold, cancellationToken);
    }
}
