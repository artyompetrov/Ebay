namespace Ebay.Server.Infrastructure;

public static class ExceptionExtensions
{
    public static bool IsIntendedOperationCanceledException(this Exception ex, CancellationToken token) =>
        ex is OperationCanceledException && token.IsCancellationRequested;
}