namespace Server.Application.Abstractions.Queries;

public interface ILotQueries
{
    ICollection<LotInfoShort> GetLotsAsync(Guid productId, CancellationToken cancellationToken);
    
    Task<ICollection<LotState>> GetLotStatesAsync(IEnumerable<long> lotIds, CancellationToken cancellationToken);
    
    Task<ICollection<long>> GetIgnoredLotsAsync(Guid productId, CancellationToken cancellationToken);
    
    Task<LotInfoWithProductId?> GetLotInfoAsync(long lotId, CancellationToken cancellationToken);
    
    Task<bool> GetIsLotIgnoredForProductAsync(Guid productId, long lotId, CancellationToken cancellationToken);
    
    Task< ICollection<long>> GetLotIdsAsync(CancellationToken cancellationToken);
}