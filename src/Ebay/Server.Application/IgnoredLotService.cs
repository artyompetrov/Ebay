using Server.Application.Abstractions.Driven.Abstractions;
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
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;

    /// <summary>
    /// Создает сервис сценариев работы с отметками об игнорируемых лотах.
    /// </summary>
    public IgnoredLotService(
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        IIgnoredLotRepository ignoredLotRepository,
        ILotQueries lotQueries)
    {
        _unitOfWorkFactory = unitOfWorkFactory;
        _ignoredLotRepository = ignoredLotRepository;
        _lotQueries = lotQueries;
    }

    /// <summary>
    /// Отмечает лоты как игнорируемые для товара, если ни один из них ещё не сохранён как реальный лот.
    /// </summary>
    public async Task IgnoreLotsAsync(Guid productId, IReadOnlySet<long> lotIds, CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var alreadySaved = await _lotQueries.AnyLotExistsForProductAsync(productId, lotIds, cancellationToken);

        if (!alreadySaved)
        {
            await _ignoredLotRepository.InsertMissingAsync(unitOfWork, productId, lotIds, cancellationToken);
            await unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
