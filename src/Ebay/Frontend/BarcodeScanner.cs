using System.Runtime.Versioning;

namespace Client;

[SupportedOSPlatform("browser")]
internal sealed class BarcodeScanner : IBarcodeScanner
{
    private readonly Interop _interop;

    // The app runs only in the browser (Blazor WebAssembly); component tests replace this scanner with a fake.
    public BarcodeScanner(Interop interop)
    {
        _interop = interop;
    }

    public Task<string> ScanAsync() => _interop.StartQrScanner();
}
