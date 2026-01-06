using Server.Domain;

namespace Server.Application.Abstractions.Services;

public interface ILotsService
{
    Task UpsertLotInfoAsync(Lot lot, CancellationToken cancellationToken);

    Task IgnoreLotsAsync(IEnumerable<long> ignoredLots, Guid productId, CancellationToken cancellationToken);
    
    Task DeleteLotInfoAsync(long lotId, CancellationToken cancellationToken);
}