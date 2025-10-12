using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Queries;

namespace Sever.Adapters.EF.ReadModel.Queries;

internal class TubeWorkingPointQueries : ITubeWorkingPointQueries
{
    private readonly ReadDbContext _context;

    public TubeWorkingPointQueries(ReadDbContext context)
    {
        _context = context;
    }

    public async Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken)
    {
        var tubeWorkingPoint = await _context.TubeWorkingPoints.SingleOrDefaultAsync(
            x => x.ProductId == productId,
            cancellationToken: cancellationToken);

        if (tubeWorkingPoint == null)
        {
            return null;
        }

        return new TubeWorkingPointInfo(
            AnodeVoltage: tubeWorkingPoint.AnodeVoltage,
            GridVoltage: tubeWorkingPoint.GridVoltage,
            AnodeVoltageHalfWidth: tubeWorkingPoint.AnodeVoltageHalfWidth,
            GridVoltageHalfWidth: tubeWorkingPoint.GridVoltageHalfWidth,
            NominalCurrent: tubeWorkingPoint.NominalCurrent);
    }
}