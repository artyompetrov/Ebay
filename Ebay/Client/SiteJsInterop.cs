using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;

namespace Ebay.Client;

[SupportedOSPlatform("browser")]
public partial class SiteJsInterop
{
    [JSImport("SetFocusByElementId", "interop")]
    internal static partial bool SetFocusByElementId(string elementId);
}