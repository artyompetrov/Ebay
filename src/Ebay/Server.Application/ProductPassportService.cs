using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Application;

/// <summary>
/// Сервис сценариев работы с агрегатом паспорта товара, включая порядок отображения.
/// </summary>
public class ProductPassportService
{
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;
    private readonly IProductPassportRepository _productPassportRepository;
    private readonly IPassportQueries _passportQueries;

    /// <summary>
    /// Создает сервис сценариев работы с паспортами товара.
    /// </summary>
    public ProductPassportService(
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        IProductPassportRepository productPassportRepository,
        IPassportQueries passportQueries)
    {
        _unitOfWorkFactory = unitOfWorkFactory;
        _productPassportRepository = productPassportRepository;
        _passportQueries = passportQueries;
    }

    /// <summary>
    /// Загружает новый паспорт товара, при отсутствии явного порядка добавляет его последним.
    /// </summary>
    public async Task UploadAsync(
        Guid productId,
        string fileName,
        string contentType,
        int? order,
        byte[] content,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        if (order == null)
        {
            var existingPassports = await _passportQueries.GetPassports(productId, cancellationToken);
            order = (existingPassports.Count == 0 ? -1 : existingPassports.Max(x => x.Order)) + 1;
        }

        var entity = ProductPassport.Create(
            productId: productId,
            fileName: fileName,
            contentType: contentType,
            order: order.Value,
            content: content);

        await _productPassportRepository.AddAsync(unitOfWork, entity, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Удаляет паспорт товара и сдвигает порядок оставшихся паспортов.
    /// </summary>
    /// <returns><see cref="NotFound"/>, если паспорт с указанным идентификатором не найден среди паспортов товара.</returns>
    public async Task<OneOf<Success, NotFound>> DeleteAsync(Guid productId, Guid passportId, CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var passports = await _passportQueries.GetPassports(productId, cancellationToken);
        var passport = passports.SingleOrDefault(x => x.Id == passportId);
        if (passport is null)
        {
            return new NotFound();
        }

        // IProductPassportRepository.RemoveAsync executes an immediate ExecuteDeleteAsync rather than going
        // through the change tracker, so without an explicit transaction it would commit independently of the
        // order-shift flushed by SaveChangesAsync below - an explicit transaction keeps the deletion and the
        // reorder atomic.
        await using var transaction = await unitOfWork.BeginTransactionAsync(cancellationToken);

        await _productPassportRepository.RemoveAsync(unitOfWork, passportId, cancellationToken);

        var passportsToDecrement = passports.Where(x => x.Order > passport.Order);
        foreach (var p in passportsToDecrement)
        {
            // A passport removed concurrently since it was read has no order left to shift.
            var tracked = await _productPassportRepository.GetByIdAsync(unitOfWork, p.Id, cancellationToken);
            tracked?.SetOrder(tracked.Order - 1);
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return new Success();
    }

    /// <summary>
    /// Изменяет порядок паспорта товара, сдвигая порядок остальных паспортов в диапазоне.
    /// </summary>
    /// <returns><see cref="NotFound"/>, если паспорт с указанным идентификатором не найден среди паспортов товара.</returns>
    public async Task<OneOf<Success, NotFound>> UpdateOrderAsync(Guid productId, Guid passportId, int newOrder, CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var passports = await _passportQueries.GetPassports(productId, cancellationToken);
        var current = passports.SingleOrDefault(x => x.Id == passportId);
        if (current is null)
        {
            return new NotFound();
        }

        if (current.Order == newOrder)
        {
            return new Success();
        }

        var minOrder = Math.Min(current.Order, newOrder);
        var maxOrder = Math.Max(current.Order, newOrder);
        var affected = passports.Where(x => x.Id != passportId && x.Order >= minOrder && x.Order <= maxOrder);

        var orderShift = newOrder < current.Order ? 1 : -1;
        foreach (var p in affected)
        {
            // A passport removed concurrently since it was read has no order left to shift.
            var tracked = await _productPassportRepository.GetByIdAsync(unitOfWork, p.Id, cancellationToken);
            tracked?.SetOrder(tracked.Order + orderShift);
        }

        var entity = await _productPassportRepository.GetByIdAsync(unitOfWork, passportId, cancellationToken);
        if (entity is null)
        {
            return new NotFound();
        }

        entity.SetOrder(newOrder);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new Success();
    }
}
