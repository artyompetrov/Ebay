using Client.Telemetry;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace Tests.Frontend.Telemetry;

/// <summary>A component (not a page) whose initialization takes <see cref="InitializationTime"/>.</summary>
public sealed class TracedTestComponent : TracedComponentBase
{
    [Parameter]
    public TimeSpan InitializationTime { get; set; }

    protected override async Task OnInitializedAsync() => await Task.Delay(InitializationTime);

    protected override void BuildRenderTree(RenderTreeBuilder builder) => builder.AddContent(0, "component");
}
