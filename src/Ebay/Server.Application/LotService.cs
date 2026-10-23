using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Application;

/// <summary>
/// Сервис сценариев работы с агрегатом лота.
/// </summary>
public class LotService
{
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;
    private readonly ILotRepository _lotRepository;
    private readonly IIgnoredLotRepository _ignoredLotRepository;
    private readonly IPriceRecalculationPublisher _priceRecalculationPublisher;

    /// <summary>
    /// Создает сервис сценариев работы с лотами.
    /// </summary>
    public LotService(
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        ILotRepository lotRepository,
        IIgnoredLotRepository ignoredLotRepository,
        IPriceRecalculationPublisher priceRecalculationPublisher)
    {
        _unitOfWorkFactory = unitOfWorkFactory;
        _lotRepository = lotRepository;
        _ignoredLotRepository = ignoredLotRepository;
        _priceRecalculationPublisher = priceRecalculationPublisher;
    }

    /// <summary>
    /// Создает или обновляет информацию о лоте, синхронизирует историю покупок, снимает отметку об
    /// игнорировании лота и инициирует пересчет цен.
    /// </summary>
    public async Task UpsertLotInfoAsync(
        long lotId,
        Guid productId,
        string name,
        int pcs,
        int? lotSize,
        string currencyId,
        string shippingCountry,
        double price,
        double shipping,
        double shippingAdditional,
        string description,
        string? shortDescription,
        string condition,
        string? conditionDescription,
        string seller,
        string locatedIn,
        DateTimeOffset titleChangeDate,
        DateTimeOffset updateDate,
        IReadOnlyDictionary<string, string> categories,
        IReadOnlyList<(DateTimeOffset Date, double? Price, int Quantity)> purchaseHistory,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var lot = await _lotRepository.GetByIdAsync(unitOfWork, lotId, cancellationToken);
        if (lot == null)
        {
            lot = Lot.Create(
                id: lotId,
                productId: productId,
                name: name,
                pcs: pcs,
                lotSize: lotSize,
                currencyId: currencyId,
                shippingCountry: shippingCountry,
                price: price,
                shipping: shipping,
                shippingAdditional: shippingAdditional,
                description: description,
                shortDescription: shortDescription,
                condition: condition,
                conditionDescription: conditionDescription,
                seller: seller,
                locatedIn: locatedIn,
                titleChangeDate: titleChangeDate,
                updateDate: updateDate,
                categories: categories);
            await _lotRepository.AddAsync(unitOfWork, lot, cancellationToken);
        }
        else
        {
            lot.UpdateInfo(
                name: name,
                pcs: pcs,
                lotSize: lotSize,
                currencyId: currencyId,
                shippingCountry: shippingCountry,
                price: price,
                shipping: shipping,
                shippingAdditional: shippingAdditional,
                description: description,
                shortDescription: shortDescription,
                condition: condition,
                conditionDescription: conditionDescription,
                seller: seller,
                locatedIn: locatedIn,
                titleChangeDate: titleChangeDate,
                updateDate: updateDate,
                categories: categories);
        }

        foreach (var purchase in purchaseHistory)
        {
            if (purchase.Date < titleChangeDate)
            {
                continue;
            }

            lot.UpsertPurchase(purchase.Date, purchase.Price, purchase.Quantity);
        }

        lot.RemovePurchasesBefore(titleChangeDate);

        await _priceRecalculationPublisher.PublishForLotAsync(unitOfWork, lotId, cancellationToken);

        // IIgnoredLotRepository.RemoveAsync executes an immediate ExecuteDeleteAsync rather than going through
        // the change tracker, so without an explicit transaction it would commit independently of the lot
        // upsert and the outbox message flushed by SaveChangesAsync below - an explicit transaction keeps the
        // un-ignore, the lot upsert, and the recalculation trigger atomic.
        await using var transaction = await unitOfWork.BeginTransactionAsync(cancellationToken);

        // Лот больше не считается проигнорированным, раз для него снова пришли актуальные данные.
        await _ignoredLotRepository.RemoveAsync(unitOfWork, productId, lotId, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
    }

    /// <summary>
    /// Удаляет лот и инициирует пересчет цен товара.
    /// </summary>
    /// <returns><see cref="NotFound"/>, если лот не найден.</returns>
    public async Task<OneOf<Success, NotFound>> DeleteLotInfoAsync(long lotId, CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var lot = await _lotRepository.GetByIdAsync(unitOfWork, lotId, cancellationToken);
        if (lot is null)
        {
            return new NotFound();
        }

        await _priceRecalculationPublisher.PublishForProductAsync(unitOfWork, lot.ProductId, cancellationToken);

        // ILotRepository.RemoveAsync executes an immediate ExecuteDeleteAsync rather than going through the
        // change tracker, so without an explicit transaction it would commit independently of the outbox
        // message flushed by SaveChangesAsync below - an explicit transaction keeps the deletion and the
        // recalculation trigger atomic.
        await using var transaction = await unitOfWork.BeginTransactionAsync(cancellationToken);
        await _lotRepository.RemoveAsync(unitOfWork, lotId, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return new Success();
    }

    /// <summary>
    /// Инициирует пересчет цен всех лотов всех товаров.
    /// </summary>
    public async Task CalculatePricesForAllAsync(CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        await _priceRecalculationPublisher.PublishForAllAsync(unitOfWork, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
