using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Npgsql;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class IgnoredLotRepository : IIgnoredLotRepository
{
    public async Task InsertMissingAsync(IWriteModelUnitOfWork unitOfWork, Guid productId, IReadOnlySet<long> lotIds, CancellationToken cancellationToken)
    {
        if (lotIds.Count == 0)
        {
            return;
        }

        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        // A single INSERT ... ON CONFLICT DO NOTHING instead of check-then-insert: a concurrent request ignoring
        // the same (ProductId, LotId) pair can't fail this one, and nothing is staged in the change tracker, so the
        // statement never flushes other work of the unit of work. Like the ExecuteDeleteAsync-based removals it runs
        // immediately and joins the unit of work's transaction when the caller opened one.
        var entityType = dbContext.Model.FindEntityType(typeof(IgnoredLot))
                         ?? throw new InvalidOperationException($"{nameof(IgnoredLot)} is not mapped.");
        var table = StoreObjectIdentifier.Table(
            entityType.GetTableName() ?? throw new InvalidOperationException($"{nameof(IgnoredLot)} has no table."),
            entityType.GetSchema());
        var sql = $"""
                   INSERT INTO {Quote(table.Schema)}.{Quote(table.Name)} ({Quote(ColumnName(entityType, nameof(IgnoredLot.ProductId), table))}, {Quote(ColumnName(entityType, nameof(IgnoredLot.LotId), table))})
                   SELECT @productId, lot_id FROM unnest(@lotIds) AS lot_id
                   ON CONFLICT DO NOTHING
                   """;

        await dbContext.Database.ExecuteSqlRawAsync(
            sql,
            [new NpgsqlParameter("productId", productId), new NpgsqlParameter("lotIds", lotIds.ToArray())],
            cancellationToken);
    }

    private static string ColumnName(IEntityType entityType, string propertyName, StoreObjectIdentifier table) =>
        entityType.FindProperty(propertyName)?.GetColumnName(table)
        ?? throw new InvalidOperationException($"{nameof(IgnoredLot)}.{propertyName} has no column.");

    private static string Quote(string? identifier) =>
        $"\"{identifier ?? throw new InvalidOperationException("Identifier is required.")}\"";

    public async Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, Guid productId, long lotId, CancellationToken cancellationToken)
    {
        var dbContext = WriteModelUnitOfWork.From(unitOfWork).DbContext;

        await dbContext.IgnoredLots
            .Where(x => x.ProductId == productId && x.LotId == lotId)
            .ExecuteDeleteAsync(cancellationToken);
    }
}
