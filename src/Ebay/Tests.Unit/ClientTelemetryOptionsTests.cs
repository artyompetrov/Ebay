using AwesomeAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Adapters.Driving.WebApi;
using Tests.Shared;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ClientTelemetryOptions))]
public sealed class ClientTelemetryOptionsTests
{
    [Test]
    [OpenSpecScenario("client-telemetry", "Backend serves the client telemetry level", "A configured level is served")]
    public void ConfiguredLevel_IsServedToClients()
    {
        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { ["ClientTelemetry:MinLevel"] = "Trace" })
            .Build();
        var services = new ServiceCollection();
        services.AddSingleton<IConfiguration>(configuration);
        services.AddWebApiAdapter();
        using var provider = services.BuildServiceProvider();

        var settings = provider.GetRequiredService<IOptions<ClientTelemetryOptions>>().Value.ToSettings();

        settings.MinLevel.Should().Be("Trace");
    }
}
