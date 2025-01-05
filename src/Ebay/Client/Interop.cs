using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Versioning;

namespace Ebay.Client;

[SupportedOSPlatform("browser")]
public partial class Interop
{
    [JSImport("SetFocusByElementId", "interop")]
    internal static partial void SetFocusByElementId(string elementId);
}