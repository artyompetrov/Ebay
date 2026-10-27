using System.Collections.Concurrent;
using AwesomeAssertions;
using Client.Telemetry;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NUnit.Framework;
using Tests.Shared;

namespace Tests.Frontend.Telemetry;

[TestFixture]
[TestOf(typeof(TelemetryLoggerProvider))]
public sealed class TelemetryLoggerProviderTests
{
    [Test]
    [OpenSpecScenario("client-telemetry", "Client logs are exported at the served level", "A frontend logger record is exported")]
    public async Task WarningDuringNavigation_IsExportedWithWarningSeverityAndTheNavigationTraceId()
    {
        using var host = new TelemetryTestHost();
        var navigation = host.Tracer.StartNavigation("/", "Products")!;

        host.LoggerFactory.CreateLogger("Client.Pages.Products").LogWarning("Price of {Product} is stale", "6N2P");
        navigation.Stop();
        host.KeepOnly(navigation.TraceId);
        await host.Exporter.ExportAsync(CancellationToken.None);

        var record = host.Relay.Posts.Where(static p => p.Signal == "logs").SelectMany(static p => OtlpJson.Logs(p.Body)).Single();
        record.SeverityNumber.Should().Be(13);
        record.Body.Should().Be("Price of 6N2P is stale");
        record.Attributes["Product"].Should().Be("6N2P");
        record.TraceId.Should().Be(navigation.TraceId.ToHexString());
        record.Scope.Should().Be("Client.Pages.Products");
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Client logs are exported at the served level", "Records below the served level are not exported")]
    public void RecordBelowTheServedLevel_ReachesTheConsoleButIsNotRecorded()
    {
        var console = new RecordingProvider();
        using var host = new TelemetryTestHost(services => services.AddSingleton<ILoggerProvider>(console));
        host.Level.Set(LogLevel.Information);
        var navigation = host.Tracer.StartNavigation("/", "Products")!;

        host.LoggerFactory.CreateLogger("Client.Pages.Products").LogDebug("Loaded {Count} products", 3);
        navigation.Stop();

        console.Messages.Should().Contain("Loaded 3 products");
        host.KeepOnly(navigation.TraceId).Logs.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("client-telemetry", "Client logs are exported at the served level", "Export activity produces no exported log records")]
    public async Task RecordsWrittenDuringAnExport_AreNotRecorded()
    {
        using var host = new TelemetryTestHost();
        var navigation = host.Tracer.StartNavigation("/", "Products")!;
        var httpLogger = host.LoggerFactory.CreateLogger("System.Net.Http.HttpClient.ServerAPI.ClientHandler");
        var handlerLogger = host.LoggerFactory.CreateLogger("Microsoft.AspNetCore.Components.WebAssembly.Authentication");
        host.Relay.OnRequest = () => handlerLogger.LogWarning("Written while exporting");
        host.LoggerFactory.CreateLogger("Client.Pages.Products").LogInformation("Before the export");
        httpLogger.LogInformation("Sending HTTP request GET https://test.local/api/ebay/v1/products/?id=1");

        await host.Exporter.ExportAsync(CancellationToken.None);
        navigation.Stop();

        var pending = host.KeepOnly(navigation.TraceId);
        pending.Logs.Should().BeEmpty();
        host.Relay.Posts.Where(static p => p.Signal == "logs").SelectMany(static p => OtlpJson.Logs(p.Body))
            .Select(static l => l.Body).Should().NotContain(["Written while exporting", "Sending HTTP request GET https://test.local/api/ebay/v1/products/"]);
    }

    [Test]
    public void Exception_IsRecordedWithItsTypeMessageAndStackTrace()
    {
        using var host = new TelemetryTestHost();
        var navigation = host.Tracer.StartNavigation("/", "Products")!;

        host.LoggerFactory.CreateLogger("Client.Pages.Products").LogError(new InvalidOperationException("boom"), "Loading failed");
        navigation.Stop();

        var record = host.KeepOnly(navigation.TraceId).Logs.Single();
        record.Level.Should().Be(LogLevel.Error);
        record.Attributes.Should().Contain(new KeyValuePair<string, object?>("exception.type", typeof(InvalidOperationException).FullName));
        record.Attributes.Should().Contain(new KeyValuePair<string, object?>("exception.message", "boom"));
        record.Attributes.Select(static a => a.Key).Should().Contain("exception.stacktrace");
    }

    private sealed class RecordingProvider : ILoggerProvider
    {
        public ConcurrentQueue<string> Messages { get; } = new();

        public ILogger CreateLogger(string categoryName) => new RecordingLogger(Messages);

        public void Dispose()
        {
        }

        private sealed class RecordingLogger(ConcurrentQueue<string> messages) : ILogger
        {
            public IDisposable? BeginScope<TState>(TState state)
                where TState : notnull => null;

            public bool IsEnabled(LogLevel logLevel) => true;

            public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) =>
                messages.Enqueue(formatter(state, exception));
        }
    }
}
