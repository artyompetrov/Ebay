using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;

namespace Client;

[SupportedOSPlatform("browser")]
public partial class Interop
{
    [JSImport(functionName: "SetFocusByElementId", moduleName: "interop")]
    internal static partial void SetFocusByElementId(string elementId);
}