using System.Reflection;
using Microsoft.AspNetCore.Components;

namespace Client.Telemetry;

/// <summary>
/// Wraps the routed view in <c>App.razor</c> and starts the root span of every navigation (including the initial
/// load, which <c>LocationChanged</c> does not report) when the page or its route values change. The span is named
/// after the route template, so it carries no ids.
/// </summary>
public sealed class NavigationTracer : ComponentBase
{
    private string? _routeKey;

    [Parameter]
    [EditorRequired]
    public RouteData RouteData { get; set; } = null!;

    [Parameter]
    public RenderFragment? ChildContent { get; set; }

    /// <summary>Set by Blazor (<c>[Inject]</c>) before any lifecycle method runs.</summary>
    [Inject]
    private FrontendTracer Tracer { get; set; } = null!;

    /// <inheritdoc />
    protected override void OnParametersSet()
    {
        var key = RouteData.PageType.FullName + "?" + string.Join("&",
            RouteData.RouteValues.OrderBy(static v => v.Key, StringComparer.Ordinal).Select(static v => v.Key + "=" + v.Value));
        if (key == _routeKey)
        {
            return;
        }

        _routeKey = key;
        Tracer.StartNavigation(RouteTemplate(RouteData), RouteData.PageType.Name);
    }

    /// <inheritdoc />
    protected override void BuildRenderTree(Microsoft.AspNetCore.Components.Rendering.RenderTreeBuilder builder) =>
        builder.AddContent(0, ChildContent);

    private static string RouteTemplate(RouteData routeData) =>
        routeData.Template
        ?? routeData.PageType.GetCustomAttributes<RouteAttribute>().FirstOrDefault()?.Template
        ?? routeData.PageType.Name;
}
