using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions;
using Server.Application.Abstractions.Queries;
using Server.Application.Abstractions.Repositories;
using Server.Application.Controllers;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Application.Services
{
    public class TubeWorkingPointService(
        ApplicationDbContext applicationDbContext,
        IUnitOfWork unitOfWork,
        ITubeWorkingPointQueries tubeWorkingPointQueries,
        ITubeWorkingPointsRepository tubeWorkingPointsRepository)
    {
        private readonly ApplicationDbContext _applicationDbContext = applicationDbContext;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly ITubeWorkingPointQueries _tubeWorkingPointQueries = tubeWorkingPointQueries;
        private readonly ITubeWorkingPointsRepository _tubeWorkingPointsRepository = tubeWorkingPointsRepository;

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

        public Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken)
        {
            return _tubeWorkingPointQueries.GetWorkingPointInfo(productId, cancellationToken);
        }
    }
}