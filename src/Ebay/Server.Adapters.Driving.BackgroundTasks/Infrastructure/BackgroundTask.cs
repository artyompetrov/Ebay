using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Server.Adapters.Driving.BackgroundTasks.Infrastructure;

public abstract class BackgroundTask : IHostedService, IDisposable
{
    private readonly ILogger _logger;
    private (CancellationTokenSource Cts, Task Task)? _state;

    protected BackgroundTask(ILogger logger)
    {
        _logger = logger;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        StopTaskAndDispose();

        var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        var token = cts.Token;

        var task = Task.Run(async () =>
        {
            try
            {
                await BackgroundTaskWork(token);
                _logger.LogInformation("{ChildClassName} {ParentClassName} finished", GetType().Name, nameof(BackgroundTask));
            }
            catch (Exception e) when (IsNotIntendedCancellation(e, token))
            {
                _logger.LogError(e, "{ChildClassName} {ParentClassName} finished with error", GetType().Name, nameof(BackgroundTask));
            }
            finally
            {
                _state = null;
                _logger.LogInformation("{Type} {Task} stopped working", GetType().Name, nameof(BackgroundTask));
            }
        }, token);

        _state = (cts, task);

        return Task.CompletedTask;
    }

    private async Task BackgroundTaskWork(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                await BackgroundTaskImplementation(cancellationToken);
                await Task.Delay(UpdateTime, cancellationToken);
            }
            catch (Exception e) when (IsNotIntendedCancellation(e, cancellationToken))
            {
                _logger.LogError(e, "Error in {TaskName}", nameof(BackgroundTaskImplementation));
                await Task.Delay(ErrorDelay, cancellationToken);
            }
        }
    }

    private static bool IsNotIntendedCancellation(Exception ex, CancellationToken token) =>
        !(ex is OperationCanceledException && token.IsCancellationRequested);

    public abstract TimeSpan UpdateTime { get; }

    public abstract TimeSpan ErrorDelay { get; }

    protected abstract Task BackgroundTaskImplementation(CancellationToken cancellationToken);

    public Task StopAsync(CancellationToken cancellationToken)
    {
        StopTaskAndDispose();
        _logger.LogInformation("{BackgroundTask} stopped working", nameof(BackgroundTask));
        return Task.CompletedTask;
    }

    private void StopTaskAndDispose()
    {
        if (_state == null)
        {
            return;
        }

        _state.Value.Cts.Cancel();

        try
        {
            _state.Value.Task.GetAwaiter().GetResult();
        }
        catch (Exception e) when (IsNotIntendedCancellation(e, _state.Value.Cts.Token))
        {
            _logger.LogError(e, "Error while stopping background service");
        }

        _state.Value.Cts.Dispose();
        _state.Value.Task.Dispose();

        _state = null;
    }

    public void Dispose()
    {
        StopTaskAndDispose();
        GC.SuppressFinalize(this);
    }
}
