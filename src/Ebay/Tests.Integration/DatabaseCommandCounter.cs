using System.Data.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Tests.Integration;

public sealed class DatabaseCommandCounter : DbCommandInterceptor
{
    private readonly Lock _lock = new();
    private IReadOnlyCollection<string> _trackedFragments = [];
    private long _count;

    public long Count => Interlocked.Read(ref _count);

    public void Reset(params string[] trackedFragments)
    {
        lock (_lock)
        {
            _trackedFragments = trackedFragments;
            Interlocked.Exchange(ref _count, 0);
        }
    }

    public override InterceptionResult<DbDataReader> ReaderExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result)
    {
        CountIfTracked(command);
        return result;
    }

    public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result,
        CancellationToken cancellationToken = default)
    {
        CountIfTracked(command);
        return ValueTask.FromResult(result);
    }

    private void CountIfTracked(DbCommand command)
    {
        IReadOnlyCollection<string> trackedFragments;
        lock (_lock)
        {
            trackedFragments = _trackedFragments;
        }

        if (trackedFragments.Any(fragment => command.CommandText.Contains(fragment, StringComparison.OrdinalIgnoreCase)))
        {
            Interlocked.Increment(ref _count);
        }
    }
}
