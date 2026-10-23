using System.Runtime.Versioning;

namespace Client;

[SupportedOSPlatform("browser")]
internal sealed class BarcodeScanner : IBarcodeScanner
{
    // The app runs only in the browser (Blazor WebAssembly); component tests replace this scanner with a fake.
    public Task<string> ScanAsync() => Interop.StartQrScanner();
}
