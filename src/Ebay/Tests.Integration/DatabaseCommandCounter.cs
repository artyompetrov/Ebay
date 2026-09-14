using System.Data.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Tests.Integration;

public sealed class DatabaseCommandCounter : DbCommandInterceptor
{
    private readonly AsyncLocal<DatabaseCommandCounterScope?> _currentScope = new();

    public DatabaseCommandCounterScope BeginScope(params string[] trackedFragments)
    {
        var parentScope = _currentScope.Value;
        var scope = new DatabaseCommandCounterScope(
            trackedFragments,
            onDispose: () => _currentScope.Value = parentScope);
        _currentScope.Value = scope;
        return scope;
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
        var scope = _currentScope.Value;

        if (scope is not null && scope.Tracks(command.CommandText))
        {
            scope.Increment(command.CommandText);
        }
    }
}
