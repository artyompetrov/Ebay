using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.Exceptions;
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

    /// <exception cref="NotFoundException">Товар с указанным идентификатором не найден.</exception>
    public async Task CreateTubeWorkingPoint(
        Guid tubeProductId,
        double anodeVoltage,
        double gridVoltage,
        double anodeVoltageHalfWidth,
        double gridVoltageHalfWidth,
        double nominalCurrent,
        CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        _ = await _productQueries.GetProductAsync(tubeProductId, cancellationToken) ??
            throw new NotFoundException("Product", tubeProductId);

        var tubeWorkingPoint = await _tubeWorkingPointsRepository.GetByIdAsync(
            unitOfWork,
            id: tubeProductId,
            cancellationToken: cancellationToken);

        if (tubeWorkingPoint != null)
        {
            tubeWorkingPoint.Update(
                anodeVoltage: anodeVoltage,
                gridVoltage: gridVoltage,
                anodeVoltageHalfWidth: anodeVoltageHalfWidth,
                gridVoltageHalfWidth: gridVoltageHalfWidth,
                nominalCurrent: nominalCurrent);
        }
        else
        {
            tubeWorkingPoint = TubeWorkingPoint.Create(
                productId: tubeProductId,
                anodeVoltage: anodeVoltage,
                gridVoltage: gridVoltage,
                anodeVoltageHalfWidth: anodeVoltageHalfWidth,
                gridVoltageHalfWidth: gridVoltageHalfWidth,
                nominalCurrent: nominalCurrent);

            await _tubeWorkingPointsRepository.AddAsync(unitOfWork, tubeWorkingPoint, cancellationToken);
        }

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    /// <exception cref="NotFoundException">Рабочая точка товара не задана.</exception>
    public async Task<TubeWorkingPointInfo> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken) =>
        await _tubeWorkingPointQueries.GetWorkingPointInfo(productId, cancellationToken) ??
        throw new NotFoundException(nameof(TubeWorkingPoint), productId);
}
