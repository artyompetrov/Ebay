namespace Server.Adapters.Driving.BackgroundTasks;

internal static class ExceptionExtensions
{
    public static bool IsNotIntendedCancellation(this Exception ex, CancellationToken token) => !(ex is OperationCanceledException && token.IsCancellationRequested);
}
