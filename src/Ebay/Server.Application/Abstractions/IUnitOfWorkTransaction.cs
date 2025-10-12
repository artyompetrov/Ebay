namespace Server.Application.Abstractions;

public interface IUnitOfWorkTransaction : IDisposable, IAsyncDisposable
{
    Task CommitAsync(CancellationToken cancellationToken);
}