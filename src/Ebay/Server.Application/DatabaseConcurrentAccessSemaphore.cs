namespace Server.Application;

public sealed class DatabaseConcurrentAccessSemaphore : IDisposable
{
    public SemaphoreSlim Semaphore { get; }

    public DatabaseConcurrentAccessSemaphore(int maxConcurrent)
    {
        Semaphore = new SemaphoreSlim(maxConcurrent, maxConcurrent);
    }

    public void Dispose()
    {
        Semaphore.Dispose();
    }
}