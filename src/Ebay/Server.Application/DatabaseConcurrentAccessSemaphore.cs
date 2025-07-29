namespace Server.Application;

public class DatabaseConcurrentAccessSemaphore
{
    public SemaphoreSlim Semaphore { get; }

    public DatabaseConcurrentAccessSemaphore(int maxConcurrent)
    {
        Semaphore = new SemaphoreSlim(maxConcurrent, maxConcurrent);
    }
}