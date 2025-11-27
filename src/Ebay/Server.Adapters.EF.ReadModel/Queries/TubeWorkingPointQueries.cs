using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Queries;

namespace Sever.Adapters.EF.ReadModel.Queries;

internal sealed class TubeWorkingPointQueries(ReadDbContext context) : ITubeWorkingPointQueries
{
    private readonly ReadDbContext _context = context;

    public async Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken)
    {
        var tubeWorkingPoint = await _context.TubeWorkingPoints.SingleOrDefaultAsync(
            x => x.Id == productId,
            cancellationToken: cancellationToken);

        return tubeWorkingPoint == null
            ? null
            : new TubeWorkingPointInfo(
            AnodeVoltage: tubeWorkingPoint.AnodeVoltage,
            GridVoltage: tubeWorkingPoint.GridVoltage,
            AnodeVoltageHalfWidth: tubeWorkingPoint.AnodeVoltageHalfWidth,
            GridVoltageHalfWidth: tubeWorkingPoint.GridVoltageHalfWidth,
            NominalCurrent: tubeWorkingPoint.NominalCurrent);
    }
}