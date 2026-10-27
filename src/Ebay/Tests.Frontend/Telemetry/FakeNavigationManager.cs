using Microsoft.AspNetCore.Components;

namespace Tests.Frontend.Telemetry;

internal sealed class FakeNavigationManager : NavigationManager
{
    public FakeNavigationManager()
    {
        Initialize(TelemetryTestHost.BaseAddress, TelemetryTestHost.BaseAddress);
    }

    public List<string> Navigations { get; } = [];

    protected override void NavigateToCore(string uri, NavigationOptions options) => Navigations.Add(uri);
}
