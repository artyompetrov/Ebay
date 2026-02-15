using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Abstractions.Queries;
using Server.Application.Abstractions.Repositories;
using Server.Application.Controllers;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Application.Services;

public class TubeWorkingPointService
{
    private readonly ApplicationDbContext _applicationDbContext;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITubeWorkingPointQueries _tubeWorkingPointQueries;
    private readonly ITubeWorkingPointsRepository _tubeWorkingPointsRepository;

    public TubeWorkingPointService(
        ApplicationDbContext applicationDbContext,
        IUnitOfWork unitOfWork,
        ITubeWorkingPointQueries tubeWorkingPointQueries,
        ITubeWorkingPointsRepository tubeWorkingPointsRepository)
    {
        _applicationDbContext = applicationDbContext;
        _unitOfWork = unitOfWork;
        _tubeWorkingPointQueries = tubeWorkingPointQueries;
        _tubeWorkingPointsRepository = tubeWorkingPointsRepository;
    }

    public async Task CreateTubeWorkingPoint(
        Guid tubeProductId,
        double anodeVoltage,
        double gridVoltage,
        double anodeVoltageHalfWidth,
        double gridVoltageHalfWidth,
        double nominalCurrent,
        CancellationToken cancellationToken)
    {
        //todo нужно переделать на запрос в репозиторий
        var productExists = await _applicationDbContext.Products
            .AnyAsync(x => x.Id == tubeProductId, cancellationToken: cancellationToken);

        if (!productExists)
        {
            throw NonOkHttpAnswerException.NotFound400();
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

            await _tubeWorkingPointsRepository.SaveAsync(tubeWorkingPoint, cancellationToken);
        }

        _ = await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken) => _tubeWorkingPointQueries.GetWorkingPointInfo(productId, cancellationToken);
}