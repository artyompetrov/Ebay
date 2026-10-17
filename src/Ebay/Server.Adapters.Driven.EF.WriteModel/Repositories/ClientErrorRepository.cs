using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Adapters.Driven.EF.WriteModel.Repositories;

internal sealed class ClientErrorRepository : IClientErrorRepository
{
    public async Task AddAsync(IWriteModelUnitOfWork unitOfWork, ClientError error, CancellationToken cancellationToken) => await WriteModelUnitOfWork.From(unitOfWork).DbContext.ClientErrors.AddAsync(error, cancellationToken);
}
