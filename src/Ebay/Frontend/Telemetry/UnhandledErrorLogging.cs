using Microsoft.Extensions.Logging;

namespace Client.Telemetry;

/// <summary>Logs errors nothing else caught: unhandled .NET exceptions, unobserved tasks and uncaught JS errors.</summary>
internal static class UnhandledErrorLogging
{
    /// <summary>Outside <c>Client.Telemetry</c>, which is never exported.</summary>
    public const string Category = "Client.UnhandledErrors";

    private const string JavaScriptErrorFormat = "Unhandled JavaScript error";

    public static void Subscribe(ILoggerFactory loggerFactory)
    {
        var logger = loggerFactory.CreateLogger(Category);
        AppDomain.CurrentDomain.UnhandledException += (_, args) =>
            logger.LogError(args.ExceptionObject as Exception, "Unhandled exception");
        TaskScheduler.UnobservedTaskException += (_, args) =>
        {
            logger.LogError(args.Exception, "Unobserved task exception");
            args.SetObserved();
        };
    }

    public static void LogJavaScriptError(ILogger logger, BrowserError error)
    {
        IReadOnlyList<KeyValuePair<string, object?>> state =
        [
            new("exception.type", error.Type),
            new("exception.message", error.Message),
            new("exception.stacktrace", error.Stack),
            new("{OriginalFormat}", JavaScriptErrorFormat)
        ];
        logger.Log(LogLevel.Error, default, state, null, (_, _) => $"{JavaScriptErrorFormat} {error.Type}: {error.Message}");
    }
}
