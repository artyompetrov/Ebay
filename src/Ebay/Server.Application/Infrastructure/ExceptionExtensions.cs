namespace Server.Application.Infrastructure;

internal static class ExceptionExtensions
{
    public static bool IsNotIntendedCancellation(this Exception ex, CancellationToken token) => !(ex is OperationCanceledException && token.IsCancellationRequested);
}