namespace Server.Application
{
    public sealed class DatabaseConcurrentAccessSemaphore(int maxConcurrent) : IDisposable
    {
        public SemaphoreSlim Semaphore { get; } = new SemaphoreSlim(maxConcurrent, maxConcurrent);

        public void Dispose()
        {
            Semaphore.Dispose();
        }
    }
}