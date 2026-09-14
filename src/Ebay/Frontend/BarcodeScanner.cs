namespace Client;

internal sealed class BarcodeScanner : IBarcodeScanner
{
    public Task<string> ScanAsync()
    {
        if (!OperatingSystem.IsBrowser())
        {
            throw new PlatformNotSupportedException("Barcode scanning requires a browser.");
        }
        return Interop.StartQrScanner();
    }
}
