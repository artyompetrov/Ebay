using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain.Errors;
using Server.Domain.Measurements;

namespace Server.Application.TubeWorkingPoints;

public class TubeWorkingPointService
{
    private readonly IProductQueries _productQueries;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;
    private readonly ITubeWorkingPointQueries _tubeWorkingPointQueries;
    private readonly ITubeWorkingPointsRepository _tubeWorkingPointsRepository;

    public TubeWorkingPointService(
        IProductQueries productQueries,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory,
        ITubeWorkingPointQueries tubeWorkingPointQueries,
        ITubeWorkingPointsRepository tubeWorkingPointsRepository)
    {
        _productQueries = productQueries;
        _unitOfWorkFactory = unitOfWorkFactory;
        _tubeWorkingPointQueries = tubeWorkingPointQueries;
        _tubeWorkingPointsRepository = tubeWorkingPointsRepository;
    }

    /// <summary>
    /// Создает или обновляет рабочую точку лампы.
    /// </summary>
    /// <returns><see cref="NotFound"/>, если товар не найден; <see cref="DomainError"/>, если рабочая точка некорректна.</returns>
    public async Task<OneOf<Success, NotFound, DomainError>> CreateTubeWorkingPoint(
        Guid tubeProductId,
        double anodeVoltage,
        double gridVoltage,
        double anodeVoltageHalfWidth,
        double gridVoltageHalfWidth,
        double nominalCurrent,
        CancellationToken cancellationToken)
    {
        if (await _productQueries.GetProductAsync(tubeProductId, cancellationToken) is null)
        {
            return new NotFound();
        }

        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        var tubeWorkingPoint = await _tubeWorkingPointsRepository.GetByIdAsync(
            unitOfWork,
            id: tubeProductId,
            cancellationToken: cancellationToken);

        if (tubeWorkingPoint != null)
        {
            var updated = tubeWorkingPoint.Update(
                anodeVoltage: anodeVoltage,
                gridVoltage: gridVoltage,
                anodeVoltageHalfWidth: anodeVoltageHalfWidth,
                gridVoltageHalfWidth: gridVoltageHalfWidth,
                nominalCurrent: nominalCurrent);

            if (updated.TryPickT1(out var updateError, out _))
            {
                return updateError;
            }
        }
        else
        {
            var created = TubeWorkingPoint.Create(
                productId: tubeProductId,
                anodeVoltage: anodeVoltage,
                gridVoltage: gridVoltage,
                anodeVoltageHalfWidth: anodeVoltageHalfWidth,
                gridVoltageHalfWidth: gridVoltageHalfWidth,
                nominalCurrent: nominalCurrent);

            if (created.TryPickT1(out var createError, out var newTubeWorkingPoint))
            {
                return createError;
            }

            await _tubeWorkingPointsRepository.AddAsync(unitOfWork, newTubeWorkingPoint, cancellationToken);
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return new Success();
    }

    /// <summary>
    /// Возвращает рабочую точку лампы.
    /// </summary>
    /// <returns><see cref="NotFound"/>, если рабочая точка товара не задана.</returns>
    public async Task<OneOf<TubeWorkingPointInfo, NotFound>> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken) =>
        await _tubeWorkingPointQueries.GetWorkingPointInfo(productId, cancellationToken) is { } workingPoint
            ? workingPoint
            : new NotFound();
}
