using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Server.Adapters.Driving.BackgroundTasks.Infrastructure;

public class BackgroundTaskRunner<TService> : BackgroundTask
    where TService : class
{
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private readonly Func<TService, CancellationToken, Task> _taskAction;

    public BackgroundTaskRunner(
        ILogger<BackgroundTaskRunner<TService>> logger,
        IServiceScopeFactory serviceScopeFactory,
        TimeSpan updateTime,
        TimeSpan errorDelay,
        Func<TService, CancellationToken, Task> taskAction)
        : base(logger)
    {
        _serviceScopeFactory = serviceScopeFactory;
        _taskAction = taskAction;
        UpdateTime = updateTime;
        ErrorDelay = errorDelay;
    }

    public override TimeSpan UpdateTime { get; }

    public override TimeSpan ErrorDelay { get; }

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var service = scope.ServiceProvider.GetRequiredService<TService>();
        await _taskAction(service, cancellationToken);
    }
}
