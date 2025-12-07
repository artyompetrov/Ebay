using Server.Application.Abstractions.Queries;

namespace Server.Application.Abstractions.Services;

public interface ITubeWorkingPointService
{
    Task CreateTubeWorkingPoint(
        Guid tubeProductId,
        double anodeVoltage,
        double gridVoltage,
        double anodeVoltageHalfWidth,
        double gridVoltageHalfWidth,
        double nominalCurrent,
        CancellationToken cancellationToken);

    Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken);
}