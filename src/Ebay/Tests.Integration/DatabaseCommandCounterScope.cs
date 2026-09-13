using System.Collections.Concurrent;

namespace Tests.Integration;

public sealed class DatabaseCommandCounterScope : IDisposable
{
    private readonly IReadOnlyCollection<string> _trackedFragments;
    private readonly Action _onDispose;
    private readonly ConcurrentQueue<string> _commands = new();
    private long _count;
    private bool _disposed;

    internal DatabaseCommandCounterScope(
        IReadOnlyCollection<string> trackedFragments,
        Action onDispose)
    {
        _trackedFragments = trackedFragments;
        _onDispose = onDispose;
    }

    public string[] Commands => _commands.ToArray();

    public long Count => Interlocked.Read(ref _count);

    internal bool Tracks(string commandText) =>
        _trackedFragments.Any(fragment => commandText.Contains(fragment, StringComparison.OrdinalIgnoreCase));

    internal void Increment(string commandText)
    {
        _commands.Enqueue(commandText);
        Interlocked.Increment(ref _count);
    }

    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        _disposed = true;
        _onDispose();
    }
}
