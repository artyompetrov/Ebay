namespace Server.Application.New.Abstractions;

/// <summary>
/// контракт.
/// </summary>
public interface IUnitOfWorkTransaction : IDisposable, IAsyncDisposable
{
    /// <summary>
    /// Операция контракта приложения.
    /// </summary>
    Task CommitAsync(CancellationToken cancellationToken);
}
