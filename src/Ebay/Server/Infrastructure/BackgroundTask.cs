namespace Server.Infrastructure;

internal abstract class BackgroundTask : IHostedService, IDisposable
{
    protected BackgroundTask(ILogger logger)
    {
        _logger = logger;
    }
    
    private State? _state;
    private readonly ILogger _logger;

    private record struct State(Task Task, CancellationTokenSource Cts);

    public Task StartAsync(CancellationToken cancellationToken)
    {
        var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);

        var backgroundTask = Task.Run(
            async () =>
            {
                try
                {
                    await RunTaskForever(cts.Token);
                }
                catch (Exception e) when (e.IsNotIntendedCancellation(cts.Token))
                {
                    _logger.LogError(exception: e, message: $"{GetType().Name} {nameof(BackgroundService)} finished with error");
                }
                finally
                {
                    _logger.LogInformation(message: $"{GetType().Name} {nameof(BackgroundService)} stopped working");
                }
            },
            cancellationToken: cts.Token);

        _state = new State(Task: backgroundTask, Cts: cts);

        return Task.CompletedTask;
    }

    private async Task RunTaskForever(CancellationToken cancellationToken)
    {
        while (!cancellationToken.IsCancellationRequested)
        {
            try
            {
                await BackgroundTaskImplementation(cancellationToken);

                await Task.Delay(delay: WellKnown.CurrencyRate.UpdateTime, cancellationToken: cancellationToken);
            }
            catch (Exception e) when (e.IsNotIntendedCancellation(cancellationToken))
            {
                _logger.LogError(exception: e, message: "Error in {taskName}", nameof(BackgroundTaskImplementation));

                await Task.Delay(delay: WellKnown.CurrencyRate.ErrorDelay, cancellationToken: cancellationToken);
            }
        }
    }

    protected abstract Task BackgroundTaskImplementation(CancellationToken cancellationToken);

    public Task StopAsync(CancellationToken cancellationToken)
    {
        StopTaskAndDispose();
        _logger.LogInformation(message: $"{nameof(BackgroundTask)} stopped working");
        return Task.CompletedTask;
    }

    private void StopTaskAndDispose()
    {
        if (_state == null) return;

        _state.Value.Cts.Cancel();

        try
        {
            _state.Value.Task.GetAwaiter().GetResult();
        }
        catch (Exception e) when (e.IsNotIntendedCancellation(_state.Value.Cts.Token))
        {
            _logger.LogError(exception: e, message: "Error while stopping background service");
        }

        _state.Value.Cts.Dispose();
        _state.Value.Task.Dispose();

        _state = null;
    }
    
    public void Dispose()
    {
        StopTaskAndDispose();
    }
}