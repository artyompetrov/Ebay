using Microsoft.EntityFrameworkCore;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.EF.ReadModel.Queries;

internal sealed class TubeWorkingPointQueries : ITubeWorkingPointQueries
{
    private readonly IDbContextFactory<ReadDbContext> _dbContextFactory;

    public TubeWorkingPointQueries(IDbContextFactory<ReadDbContext> dbContextFactory)
    {
        _dbContextFactory = dbContextFactory;
    }

    public async Task<TubeWorkingPointInfo?> GetWorkingPointInfo(Guid productId, CancellationToken cancellationToken)
    {
        await using var dbContext = await _dbContextFactory.CreateDbContextAsync(cancellationToken);

        var tubeWorkingPoint = await dbContext.TubeWorkingPoints.SingleOrDefaultAsync(
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