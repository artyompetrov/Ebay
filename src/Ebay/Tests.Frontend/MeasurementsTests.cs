using AwesomeAssertions;
using Bunit;
using Client.Clients.Generated;
using Client.Pages;
using Microsoft.Extensions.DependencyInjection;
using NUnit.Framework;
using Tests.Shared;

namespace Tests.Frontend;

[TestFixture]
[TestOf(typeof(Measurements))]
public sealed class MeasurementsTests
{
    [Test]
    [OpenSpecScenario("measurement-photos", "Photo management from the internal office measurements page", "Photo indicator on measurement row")]
    public async Task PhotoIndicators_ShowCountsAndMeasurementSpecificNavigation_AndReloadAfterDeletion()
    {
        await using var context = new BunitContext();
        context.Services.AddLogging();
        context.JSInterop.Mode = JSRuntimeMode.Loose;
        using var api = new OfficeApiHandler();
        using var http = new HttpClient(api) { BaseAddress = new Uri("https://test.local/") };
        context.Services.AddSingleton(new EbayClient(http) { BaseUrl = "https://test.local/" });
        context.Services.AddSingleton(new WebApiClient(http) { BaseUrl = "https://test.local/api/webapi/v1/" });
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
}
