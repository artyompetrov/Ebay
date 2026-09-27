using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Application.New;

/// <summary>
/// Сервис сценариев работы с агрегатом паспорта товара, включая порядок отображения.
/// </summary>
public class ProductPassportService
{
    private readonly IWriteModelUnitOfWork _unitOfWork;
    private readonly IProductPassportRepository _productPassportRepository;
    private readonly IPassportQueries _passportQueries;

    /// <summary>
    /// Создает сервис сценариев работы с паспортами товара.
    /// </summary>
    public ProductPassportService(
        IWriteModelUnitOfWork unitOfWork,
        IProductPassportRepository productPassportRepository,
        IPassportQueries passportQueries)
    {
        _unitOfWork = unitOfWork;
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

        await _productPassportRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Удаляет паспорт товара и сдвигает порядок оставшихся паспортов. Возвращает false, если паспорт
    /// с указанным идентификатором не найден среди паспортов товара.
    /// </summary>
    public async Task<bool> DeleteAsync(Guid productId, Guid passportId, CancellationToken cancellationToken)
    {
        var passports = await _passportQueries.GetPassports(productId, cancellationToken);
        var passport = passports.SingleOrDefault(x => x.Id == passportId);
        if (passport == null)
        {
            return false;
        }

        await _productPassportRepository.RemoveAsync(passportId, cancellationToken);

        var passportsToDecrement = passports.Where(x => x.Order > passport.Order);
        foreach (var p in passportsToDecrement)
        {
            var tracked = await _productPassportRepository.GetByIdAsync(p.Id, cancellationToken) ??
                          throw new InvalidOperationException($"ProductPassport {p.Id} not found");
            tracked.SetOrder(tracked.Order - 1);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    /// <summary>
    /// Изменяет порядок паспорта товара, сдвигая порядок остальных паспортов в диапазоне. Возвращает false,
    /// если паспорт с указанным идентификатором не найден среди паспортов товара.
    /// </summary>
    public async Task<bool> UpdateOrderAsync(Guid productId, Guid passportId, int newOrder, CancellationToken cancellationToken)
    {
        var passports = await _passportQueries.GetPassports(productId, cancellationToken);
        var current = passports.SingleOrDefault(x => x.Id == passportId);
        if (current == null)
        {
            return false;
        }

        if (current.Order == newOrder)
        {
            return true;
        }

        var minOrder = Math.Min(current.Order, newOrder);
        var maxOrder = Math.Max(current.Order, newOrder);
        var affected = passports.Where(x => x.Id != passportId && x.Order >= minOrder && x.Order <= maxOrder);

        var orderShift = newOrder < current.Order ? 1 : -1;
        foreach (var p in affected)
        {
            var tracked = await _productPassportRepository.GetByIdAsync(p.Id, cancellationToken) ??
                          throw new InvalidOperationException($"ProductPassport {p.Id} not found");
            tracked.SetOrder(tracked.Order + orderShift);
        }

        var entity = await _productPassportRepository.GetByIdAsync(passportId, cancellationToken) ??
                     throw new InvalidOperationException($"ProductPassport {passportId} not found");
        entity.SetOrder(newOrder);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
}
