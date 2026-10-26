using System.Diagnostics;

namespace Client.Telemetry;

/// <summary>The span source of the frontend; only its spans are exported.</summary>
internal static class FrontendActivitySource
{
    public const string Name = "Client.Frontend";

    public static readonly ActivitySource Source = new(Name);
}
