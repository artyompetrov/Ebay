using Microsoft.EntityFrameworkCore;
using Server.Application.New.Abstractions.Queries;
using Server.Application.New.Models;

namespace Sever.Adapters.EF.ReadModel.Queries;

internal sealed class TubeWorkingPointQueries : ITubeWorkingPointQueries
{
    private readonly ReadDbContext _context;

    public TubeWorkingPointQueries(ReadDbContext context)
    {
        _context = context;
    }

    public async Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken)
    {
        var tubeWorkingPoint = await _context.TubeWorkingPoints.SingleOrDefaultAsync(
            x => x.Id == productId,
            cancellationToken: cancellationToken);

        return tubeWorkingPoint == null
            ? null
            : new TubeWorkingPointInfo(
                tubeWorkingPoint.AnodeVoltage,
                tubeWorkingPoint.GridVoltage,
                tubeWorkingPoint.AnodeVoltageHalfWidth,
                tubeWorkingPoint.GridVoltageHalfWidth,
                tubeWorkingPoint.NominalCurrent);
    }
}
