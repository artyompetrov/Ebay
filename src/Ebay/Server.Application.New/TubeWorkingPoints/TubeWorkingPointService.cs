using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain.Measurements;

namespace Server.Application.New.TubeWorkingPoints;

public class TubeWorkingPointService
{
    private readonly IProductQueries _productQueries;
    private readonly IWriteModelUnitOfWork _unitOfWork;
    private readonly ITubeWorkingPointQueries _tubeWorkingPointQueries;
    private readonly ITubeWorkingPointsRepository _tubeWorkingPointsRepository;

    public TubeWorkingPointService(
        IProductQueries productQueries,
        IWriteModelUnitOfWork unitOfWork,
        ITubeWorkingPointQueries tubeWorkingPointQueries,
        ITubeWorkingPointsRepository tubeWorkingPointsRepository)
    {
        _productQueries = productQueries;
        _unitOfWork = unitOfWork;
        _tubeWorkingPointQueries = tubeWorkingPointQueries;
        _tubeWorkingPointsRepository = tubeWorkingPointsRepository;
    }

    /// <returns><see langword="false" /> если товар с указанным идентификатором не найден.</returns>
    public async Task<bool> CreateTubeWorkingPoint(
        Guid tubeProductId,
        double anodeVoltage,
        double gridVoltage,
        double anodeVoltageHalfWidth,
        double gridVoltageHalfWidth,
        double nominalCurrent,
        CancellationToken cancellationToken)
    {
        var product = await _productQueries.GetProductAsync(tubeProductId, cancellationToken);

        if (product is null)
        {
            return false;
        }

        var tubeWorkingPoint = await _tubeWorkingPointsRepository.GetByIdAsync(
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

            await _tubeWorkingPointsRepository.AddAsync(tubeWorkingPoint, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken) => _tubeWorkingPointQueries.GetWorkingPointInfo(productId, cancellationToken);
}
