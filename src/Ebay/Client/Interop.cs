using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;
using Client.Pages;
using Microsoft.JSInterop;

namespace Client;

[SupportedOSPlatform("browser")]
public partial class Interop
{
    [JSImport(functionName: "SetFocusByElementId", moduleName: "interop")]
    internal static partial void SetFocusByElementId(string elementId);

    [JSImport(functionName: "StartQrScanner", moduleName: "interop")]
    public static partial Task<string> StartQrScanner();
}