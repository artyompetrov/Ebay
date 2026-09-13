namespace Client;

public interface IBarcodeScanner
{
    Task<string> ScanAsync();
}
