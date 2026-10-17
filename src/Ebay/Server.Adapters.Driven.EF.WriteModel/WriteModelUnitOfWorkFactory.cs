using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.EF.WriteModel;

internal sealed class WriteModelUnitOfWorkFactory : IWriteModelUnitOfWorkFactory
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public WriteModelUnitOfWorkFactory(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task<IWriteModelUnitOfWork> BeginAsync(CancellationToken cancellationToken)
    {
        var scope = _serviceScopeFactory.CreateAsyncScope();
        try
        {
            return new WriteModelUnitOfWork(scope);
        }
        catch
        {
            // The unit of work owns the scope only once it is constructed.
            await scope.DisposeAsync();
            throw;
        }
    }
}
