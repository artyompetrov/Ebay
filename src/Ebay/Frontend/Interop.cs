using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using Client.Telemetry;

namespace Client;

/// <summary>
/// The JS functions of <c>interop.js</c>. Every public method is a span named after its function
/// (openspec/specs/client-telemetry); the <c>[JSImport]</c> members stay private.
/// </summary>
[SupportedOSPlatform("browser")]
internal sealed partial class Interop
{
    private readonly FrontendTracer _tracer;

    public Interop(FrontendTracer tracer)
    {
        _tracer = tracer;
    }

    public void SetFocusByElementId(string elementId) =>
        _tracer.TraceInterop(nameof(SetFocusByElementId), () => SetFocusByElementIdJs(elementId));

    public Task<string> StartQrScanner() =>
        _tracer.TraceInteropAsync(nameof(StartQrScanner), StartQrScannerJs);

    public Task InitProductDescriptionEditor(string elementId, string initialHtml) =>
        _tracer.TraceInteropAsync(nameof(InitProductDescriptionEditor), () => InitProductDescriptionEditorJs(elementId, initialHtml));

    public string GetProductDescriptionEditorHtml(string elementId) =>
        _tracer.TraceInterop(nameof(GetProductDescriptionEditorHtml), () => GetProductDescriptionEditorHtmlJs(elementId));

    [JSImport(functionName: "SetFocusByElementId", moduleName: "interop")]
    private static partial void SetFocusByElementIdJs(string elementId);

    [JSImport(functionName: "StartQrScanner", moduleName: "interop")]
    private static partial Task<string> StartQrScannerJs();

    [JSImport(functionName: "InitProductDescriptionEditor", moduleName: "interop")]
    private static partial Task InitProductDescriptionEditorJs(string elementId, string initialHtml);

    [JSImport(functionName: "GetProductDescriptionEditorHtml", moduleName: "interop")]
    private static partial string GetProductDescriptionEditorHtmlJs(string elementId);
}
