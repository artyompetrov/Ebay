namespace Server.Application.Abstractions.Services;

public interface ILotsService
{
    ICollection<LotInfoShort> GetLotsAsync(Guid productId, CancellationToken cancellationToken);
    Task UpsertLotInfoAsync(LotInfo lotInfo, Guid productId, CancellationToken cancellationToken);
    Task<ICollection<long>> GetIgnoredLotsAsync(Guid productId, CancellationToken cancellationToken);
    Task IgnoreLotsAsync(IEnumerable<long> ignoredLots, Guid productId, CancellationToken cancellationToken);
    Task< LotInfoWithProductId?> GetLotInfoAsync(long lotId, CancellationToken cancellationToken);
    Task<bool> GetIsLotIgnoredForProductAsync(Guid productId, long lotId, CancellationToken cancellationToken);
    Task< ICollection<long>> GetLotIdsAsync(CancellationToken cancellationToken);
    Task DeleteLotInfoAsync(long lotId, CancellationToken cancellationToken);
    Task<ICollection<LotState>> GetLotStatesAsync(IEnumerable<long> lotIds, CancellationToken cancellationToken);
}