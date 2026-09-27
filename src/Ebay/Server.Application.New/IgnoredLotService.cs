using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;

namespace Server.Application.New;

/// <summary>
/// Сервис сценариев работы с отметками об игнорируемых лотах.
/// </summary>
public class IgnoredLotService
{
    private readonly IWriteModelUnitOfWork _unitOfWork;
    private readonly IIgnoredLotRepository _ignoredLotRepository;
    private readonly ILotQueries _lotQueries;

    /// <summary>
    /// Создает сервис сценариев работы с отметками об игнорируемых лотах.
    /// </summary>
    public IgnoredLotService(
        IWriteModelUnitOfWork unitOfWork,
        IIgnoredLotRepository ignoredLotRepository,
        ILotQueries lotQueries)
    {
        _unitOfWork = unitOfWork;
        _ignoredLotRepository = ignoredLotRepository;
        _lotQueries = lotQueries;
    }

    /// <summary>
    /// Отмечает лоты как игнорируемые для товара, если ни один из них ещё не сохранён как реальный лот.
    /// </summary>
    public async Task IgnoreLotsAsync(Guid productId, IReadOnlySet<long> lotIds, CancellationToken cancellationToken)
    {
        var alreadySaved = await _lotQueries.AnyLotExistsForProductAsync(productId, lotIds, cancellationToken);

        if (!alreadySaved)
        {
            await _ignoredLotRepository.InsertMissingAsync(productId, lotIds, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
