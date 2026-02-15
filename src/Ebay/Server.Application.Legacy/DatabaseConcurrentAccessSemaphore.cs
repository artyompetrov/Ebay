namespace Server.Application;

public sealed class DatabaseConcurrentAccessSemaphore : IDisposable
{
    public DatabaseConcurrentAccessSemaphore(int maxConcurrent)
    {
        Semaphore = new SemaphoreSlim(maxConcurrent, maxConcurrent);
    }

    public SemaphoreSlim Semaphore { get; }

    public void Dispose() => Semaphore.Dispose();
}