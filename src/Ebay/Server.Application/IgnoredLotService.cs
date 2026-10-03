using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;

namespace Server.Application;

/// <summary>
/// Сервис сценариев работы с отметками об игнорируемых лотах.
/// </summary>
public class IgnoredLotService
{
    private readonly IIgnoredLotRepository _ignoredLotRepository;
    private readonly ILotQueries _lotQueries;

    /// <summary>
    /// Создает сервис сценариев работы с отметками об игнорируемых лотах.
    /// </summary>
    public IgnoredLotService(
        IIgnoredLotRepository ignoredLotRepository,
        ILotQueries lotQueries)
    {
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
            // IIgnoredLotRepository.InsertMissingAsync commits itself (with conflict-tolerant retry against a
            // concurrent insert of the same pair), so there is nothing left for the unit of work to flush here.
            await _ignoredLotRepository.InsertMissingAsync(productId, lotIds, cancellationToken);
        }
    }
}
