using AwesomeAssertions;
using Bunit;
using Client;
using Client.Clients.Generated;
using Client.Pages;
using Client.Telemetry;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NUnit.Framework;
using Tests.Frontend.Telemetry;
using Tests.Shared;

namespace Tests.Frontend;

[TestFixture]
[TestOf(typeof(Measurements))]
public sealed class MeasurementsTests
{
    [Test]
    [OpenSpecScenario("measurement-photos", "Photo management from the internal office measurements page", "Photo indicator on measurement row")]
    [OpenSpecScenario("measurement-photos", "Photo management from the internal office measurements page", "Delete a photo from the office view")]
    public async Task PhotoIndicators_ShowCountsAndMeasurementSpecificNavigation_AndReloadAfterDeletion()
    {
        await using var context = new BunitContext();
        TelemetryTestHost.AddTelemetry(context.Services, new FakeBrowserTelemetry(), TimeProvider.System);
        context.Services.AddSingleton<IBarcodeScanner>(new UnusedBarcodeScanner());
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        using var api = new OfficeApiHandler();
        using var http = new HttpClient(api) { BaseAddress = new Uri("https://test.local/") };
        context.Services.AddSingleton(new WebApiClient(http) { BaseUrl = "https://test.local/api/" });
        var product = new ProductWithId { Id = Guid.NewGuid(), Name = "Test tube" };
        var page = context.Render<Measurements>(p => p.Add(x => x.Product, product));
        page.WaitForAssertion(() => page.Find("a[href='measurement-photos/MEA1234']").TextContent.Should().Contain("2"));
        page.Find("a[href='measurement-photos/MEA5678']").TextContent.Should().Contain("0");
        page.Find("a[href='measurement-photos/MEA1234']").HasAttribute("target").Should().BeFalse();
        // Navigation to photo management disposes this page. Returning creates it afresh.
        page.Dispose();
        api.PhotoCount = 1;
        var returned = context.Render<Measurements>(p => p.Add(x => x.Product, product));
        returned.WaitForAssertion(() => returned.Find("a[href='measurement-photos/MEA1234']").TextContent.Should().Contain("1"));
    }

    [Test]
    public async Task UploadWhoseScanFails_ShowsTheErrorAndExportsItAsAnErrorRecord()
    {
        await using var context = new BunitContext();
        TelemetryTestHost.AddTelemetry(context.Services, new FakeBrowserTelemetry(), TimeProvider.System);
        context.Services.AddSingleton<IBarcodeScanner>(new FailingBarcodeScanner());
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        using var api = new OfficeApiHandler();
        using var http = new HttpClient(api) { BaseAddress = new Uri("https://test.local/") };
        context.Services.AddSingleton(new WebApiClient(http) { BaseUrl = "https://test.local/api/" });
        var product = new ProductWithId { Id = Guid.NewGuid(), Name = "Test tube" };
        var page = context.Render<Measurements>(p => p.Add(x => x.Product, product));
        page.WaitForAssertion(() => page.Find("a[href='measurement-photos/MEA1234']"));

        page.Find("#typeSelect").Change(Enum.GetValues<LotForSaleProductState>()[0].ToString());
        page.FindComponent<InputFile>().UploadFiles(
            InputFileContent.CreateFromBinary([1, 2], "measurement.zip", contentType: "application/zip"));

        page.WaitForAssertion(() => page.Markup.Should().Contain(FailingBarcodeScanner.Message));
        var record = context.Services.GetRequiredService<TelemetryBuffer>().Drain().Logs
            .Single(static l => l.Category == typeof(Measurements).FullName && l.Level >= LogLevel.Error);
        record.Message.Should().Contain(product.Id.ToString());
        record.Attributes.Should().Contain(new KeyValuePair<string, object?>("exception.type", typeof(InvalidOperationException).FullName));
        record.Attributes.Should().Contain(new KeyValuePair<string, object?>("exception.message", FailingBarcodeScanner.Message));
    }

    private sealed class UnusedBarcodeScanner : IBarcodeScanner
    {
        public Task<string> ScanAsync() => throw new InvalidOperationException("The test does not scan.");
    }

    private sealed class FailingBarcodeScanner : IBarcodeScanner
    {
        public const string Message = "Failed to load html5-qrcode";

        public Task<string> ScanAsync() => throw new InvalidOperationException(Message);
    }
}
