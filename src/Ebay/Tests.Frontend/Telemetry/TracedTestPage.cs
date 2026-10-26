using Client.Telemetry;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace Tests.Frontend.Telemetry;

/// <summary>A routed page that loads data from the backend while it initializes.</summary>
[Route("/Product/{ProductId:guid}/{Tab?}")]
public sealed class TracedTestPage : TracedPageBase
{
    private string? _loaded;

    [Parameter]
    public Guid ProductId { get; set; }

    [Parameter]
    public string? Tab { get; set; }

    [Inject]
    private HttpClient Backend { get; set; } = null!;

    protected override async Task OnParametersSetAsync() =>
        _loaded = await Backend.GetStringAsync($"api/ebay/v1/products/{ProductId}");

    protected override void BuildRenderTree(RenderTreeBuilder builder) =>
        builder.AddContent(0, _loaded is null ? "loading" : "loaded " + Tab);
}
