using System.Diagnostics.Metrics;
using System.Net;
using AwesomeAssertions;
using Server.Platform;
using Tests.Shared;

namespace Tests.Integration.Tests;

[TestOf(typeof(PlatformExtensions))]
public class MetricsTests
{
    private const string ProductsPath = "/api/ebay/v1/products";
    private const string ProductsRoute = "ebay/v1/products";
    private const string RequestDurationMetric = "http.server.request.duration";
    private const string RuntimeMeterName = "System.Runtime";
    private const string GcCollectionsMetric = "dotnet.gc.collections";

    private static MetricCollector Metrics => IntegrationTestsSetupFixture.MetricCollector;

    [Test]
    [OpenSpecScenario("observability-metrics", "Incoming request metrics are recorded", "An API request is recorded in request metrics")]
    public async Task ApiRequest_IsRecordedInRequestDurationMetric()
    {
        using var client = await CreateAuthenticatedClientAsync();

        using var response = await client.GetAsync(ProductsPath);
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            Metrics.Collect().Should().Contain(static point =>
                point.Name == RequestDurationMetric
                && point.Tags.ContainsKey("http.route")
                && ((string?)point.Tags["http.route"] ?? string.Empty).Contains(ProductsRoute)
                && Equals(point.Tags.GetValueOrDefault("http.request.method"), "GET")
                && Equals(point.Tags.GetValueOrDefault("http.response.status_code"), (int)HttpStatusCode.OK));
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario("observability-metrics", "Incoming request metrics are recorded", "Request metrics contain no query strings")]
    public async Task RequestWithQueryString_DoesNotPutItIntoMetricLabels()
    {
        using var client = await CreateAuthenticatedClientAsync();
        var queryValue = Guid.NewGuid().ToString("N");

        using var response = await client.GetAsync($"{ProductsPath}?metricsQueryMarker={queryValue}");
        response.StatusCode.Should().Be(HttpStatusCode.OK);

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            var points = Metrics.Collect();
            points.Should().Contain(static point => point.Name == RequestDurationMetric, "the request has been measured");
            points.SelectMany(static point => point.Tags.Values)
                .Select(static value => value?.ToString() ?? string.Empty)
                .Should().NotContain(value => value.Contains(queryValue));
            return Task.CompletedTask;
        });
    }

    [Test]
    [OpenSpecScenario("observability-metrics", "Library and application meters are exported", "Measurements of every exported meter are recorded")]
    public async Task MeasurementsOfEveryExportedMeter_AreRecorded()
    {
        // The meters of the outgoing HTTP client, the database client, the message bus, the email client (SMTP and
        // sockets), the runtime and an application meter.
        string[] meterNames = ["System.Net.Http", "Npgsql", "MassTransit", "mailkit.net.smtp", "mailkit.net.socket", RuntimeMeterName, "Server.Tests.Integration.Metrics"];
        var instrumentNames = new Dictionary<string, string>();
        var meters = new List<Meter>();

        try
        {
            foreach (var meterName in meterNames)
            {
                var meter = new Meter(meterName);
                meters.Add(meter);
                var instrumentName = $"metrics_test_{Guid.NewGuid():N}";
                instrumentNames[meterName] = instrumentName;
                meter.CreateCounter<long>(instrumentName).Add(1);
            }

            await TestHelpers.RetryUntilValidationSuccessAsync(() =>
            {
                var points = Metrics.Collect();
                foreach (var (meterName, instrumentName) in instrumentNames)
                {
                    points.Should().Contain(point => point.Name == instrumentName && point.MeterName == meterName);
                }

                return Task.CompletedTask;
            });
        }
        finally
        {
            meters.ForEach(static meter => meter.Dispose());
        }
    }

    [Test]
    [OpenSpecScenario("observability-metrics", "Library and application meters are exported", "Runtime metrics are exported without application activity")]
    public async Task RuntimeMetrics_AreExported()
    {
        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            Metrics.Collect().Should().Contain(static point => point.MeterName == RuntimeMeterName && point.Name == GcCollectionsMetric);
            return Task.CompletedTask;
        });
    }

    private static async Task<HttpClient> CreateAuthenticatedClientAsync()
    {
        var client = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(client);
        return client;
    }
}
