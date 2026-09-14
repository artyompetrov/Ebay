using AwesomeAssertions;
using Bunit;
using Client;
using Client.Pages;
using Client.Clients.Generated;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using Tests.Shared;

namespace Tests.Frontend;

[TestFixture]
[TestOf(typeof(MeasurementPhotos))]
public sealed class MeasurementPhotosTests
{
    [Test]
    [OpenSpecScenario("measurement-photos", "Phone-based photo upload", "Upload blocked without a known measurement")]
    public async Task WithoutMeasurement_DisablesUpload_AndSendsNoRequest()
    {
        await using var context = new BunitContext();
        using var api = new PhotoApiHandler();
        Configure(context, api);
        var page = context.Render<MeasurementPhotos>();
        page.Find("input[type=file]").HasAttribute("disabled").Should().BeTrue();
        api.Requests.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Phone-based photo upload", "Upload after scanning a barcode")]
    public async Task ScanThenUpload_AssociatesEveryFile_AndRefreshesList()
    {
        await using var context = new BunitContext();
        using var api = new PhotoApiHandler();
        var scanner = Configure(context, api);
        var page = context.Render<MeasurementPhotos>();
        page.Find("button").Click();
        page.WaitForAssertion(() => page.Find("input[type=file]").HasAttribute("disabled").Should().BeFalse());
        scanner.Calls.Should().Be(1);
        page.FindComponent<InputFile>().UploadFiles(
            InputFileContent.CreateFromBinary([1, 2], "first.png", contentType: "image/png"),
            InputFileContent.CreateFromBinary([3, 4], "second.png", contentType: "image/png"));
        page.WaitForAssertion(() => page.FindAll(".measurement-photo-thumbnail").Count.Should().Be(2));
        api.Uploads.Select(static x => x.FileName).Should().Equal("first.png", "second.png");
        api.Uploads[0].File.Should().Equal(1, 2);
        api.Uploads[1].File.Should().Equal(3, 4);
        api.Requests.Where(static x => x.StartsWith("POST", StringComparison.Ordinal))
            .Should().OnlyContain(static x => x.Contains("/measurements/MEA1234/photos", StringComparison.Ordinal));
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Photo management from the internal office measurements page", "Open photo management for a specific measurement")]
    [OpenSpecScenario("measurement-photos", "Photo previews on the phone-oriented management page", "Photo list shows thumbnails")]
    public async Task MeasurementParameter_LoadsPhotosWithoutScanning()
    {
        await using var context = new BunitContext();
        using var api = new PhotoApiHandler();
        api.AddPhoto("first.png");
        var scanner = Configure(context, api);
        var page = context.Render<MeasurementPhotos>(p => p.Add(x => x.MeasurementId, "MEA1234"));
        page.WaitForAssertion(() => page.FindAll(".measurement-photo-thumbnail").Count.Should().Be(1));
        page.Find(".measurement-photo-thumbnail").GetAttribute("src").Should().EndWith("/thumbnail/content");
        scanner.Calls.Should().Be(0);
        page.Find("input[type=file]").HasAttribute("disabled").Should().BeFalse();
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Photo management from the internal office measurements page", "Delete a photo from the office view")]
    public async Task DeleteFromDirectMeasurementView_RefreshesPhotoList()
    {
        await using var context = new BunitContext();
        using var api = new PhotoApiHandler();
        var photoId = api.AddPhoto("first.png");
        Configure(context, api);
        var page = context.Render<MeasurementPhotos>(p => p.Add(x => x.MeasurementId, "MEA1234"));
        page.WaitForAssertion(() => page.FindAll("li").Count.Should().Be(1));
        page.Find("li button").Click();
        page.WaitForAssertion(() => page.FindAll("li").Count.Should().Be(0));
        api.Requests.Should().Contain($"DELETE /api/webapi/v1/measurements/MEA1234/photos/{photoId}");
        api.Photos.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Photo previews on the phone-oriented management page", "Hovering a thumbnail previews the full photo in place")]
    [OpenSpecScenario("measurement-photos", "Photo previews on the phone-oriented management page", "Moving away from a thumbnail hides the preview")]
    [OpenSpecScenario("measurement-photos", "Photo previews on the phone-oriented management page", "Tapping or clicking a thumbnail previews the full photo in place")]
    [OpenSpecScenario("measurement-photos", "Photo previews on the phone-oriented management page", "Tapping or clicking the backdrop closes the preview")]
    public async Task RenderedPhotoPreview_RespondsToBrowserHoverClickAndBackdrop()
    {
        await using var context = new BunitContext();
        using var api = new PhotoApiHandler();
        api.AddPhoto("first.png");
        api.AddPhoto("second.png");
        Configure(context, api);
        var page = context.Render<MeasurementPhotos>(p => p.Add(x => x.MeasurementId, "MEA1234"));
        page.WaitForAssertion(() => page.FindAll(".measurement-photo-thumbnail").Count.Should().Be(2));
        await PhotoPreviewBrowser.VerifyAsync(page.Markup, deferredFullImage: false);
    }

    [Test]
    [TestCase(true, "none")]
    [TestCase(false, "matrix(-1, 0, 0, 1, 0, 0)")]
    [OpenSpecScenario("measurement-photos", "Phone-based photo upload", "Rear-camera preview on a detected mobile client")]
    [OpenSpecScenario("measurement-photos", "Phone-based photo upload", "Scanner preview on a non-mobile client")]
    public async Task ScannerPreview_UsesClientSpecificOrientation(bool mobile, string expectedTransform)
    {
        await using var context = new BunitContext();
        using var api = new PhotoApiHandler();
        Configure(context, api);
        var component = context.Render<MeasurementPhotos>();
        using var playwright = await Microsoft.Playwright.Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new() { Headless = true });
        var page = await browser.NewPageAsync();
        await page.RouteAsync("**/*", static route => route.AbortAsync());
        await page.SetContentAsync(component.Markup);
        await page.EvaluateAsync("""
            mobile => {
                const reader = document.getElementById('reader');
                reader.classList.add(mobile ? 'qr-scanner-mobile' : 'qr-scanner-non-mobile');
                reader.appendChild(document.createElement('video'));
            }
            """, mobile);
        await Microsoft.Playwright.Assertions.Expect(page.Locator("#reader video")).ToHaveCSSAsync("transform", expectedTransform);
    }

    private static FakeBarcodeScanner Configure(BunitContext context, PhotoApiHandler api)
    {
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        context.Services.AddLogging();
        context.Services.AddSingleton(new WebApiClient(new HttpClient(api) { BaseAddress = new Uri("https://test.local/") })
        {
            BaseUrl = "https://test.local/api/webapi/v1/"
        });
        var scanner = new FakeBarcodeScanner();
        context.Services.AddSingleton<IBarcodeScanner>(scanner);
        return scanner;
    }

    private sealed class FakeBarcodeScanner : IBarcodeScanner
    {
        public int Calls { get; private set; }
        public Task<string> ScanAsync()
        {
            Calls++;
            return Task.FromResult("https://test.local/m/MEA1234");
        }
    }
}
