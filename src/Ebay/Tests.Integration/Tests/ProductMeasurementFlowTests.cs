using System.IO.Compression;
using System.Net;
using Client.Clients.Generated;

namespace Tests.Integration.Tests;

public class ProductMeasurementFlowTests
{
    [Test]
    public async Task MainMeasurementPageEndpoints_Work()
    {
        using var context = await CreateMeasurementContextAsync();

        await AssertMeasurementPageEndpointsAsync(context.HttpClient, context.MeasurementId);
    }

    [Test]
    public async Task EbayCurves_WithInternalReferrer_DoesNotMarkMeasurementAsPublished()
    {
        using var context = await CreateMeasurementContextAsync();

        using var internalRequest = new HttpRequestMessage(HttpMethod.Get, $"/m/{context.MeasurementId}/ebay_curves");
        internalRequest.Headers.Referrer = new Uri(context.HttpClient.BaseAddress!, "/ebay_description/internal-preview");

        await AssertSvgResponseAsync(context.HttpClient, internalRequest);
        await AssertMeasurementPublishedStateAsync(context.EbayClient, context.ProductId, context.MeasurementId, expectedIsPublished: false);
    }

    [Test]
    public async Task EbayCurves_WithoutInternalReferrer_MarksMeasurementAsPublished()
    {
        using var context = await CreateMeasurementContextAsync();

        await TestHelpers.RetryUntilValidationSuccessAsync(async () =>
        {
            await AssertSvgResponseAsync(context.HttpClient, $"/m/{context.MeasurementId}/ebay_curves");
            await AssertMeasurementPublishedStateAsync(context.EbayClient, context.ProductId, context.MeasurementId, expectedIsPublished: true);
        });
    }

    private static async Task<MeasurementContext> CreateMeasurementContextAsync()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);

        var ebayClient = TestHelpers.CreateEbayClient(httpClient);
        var productId = await TestHelpers.CreateProductAsync(ebayClient);

        var randomSeed = Random.Shared.Next(1000, 9999);
        var measurementId = $"MEA{randomSeed}";
        await ebayClient.UploadMeasurementAsync(
            new MeasurementDataToUpload
            {
                MeasurementId = measurementId,
                ManufactureCode = "2026-02",
                ProductState = ProductState.New,
                File = TestHelpers.CreateValidMeasurementArchive(randomSeed)
            },
            productId);

        var measurements = await ebayClient.GetMeasurementsAsync(measurementState: null, productId: productId);

        Assert.That(measurements, Has.Count.EqualTo(1));

        var measurement = measurements.Single();
        using (Assert.EnterMultipleScope())
        {
            Assert.That(measurement.MeasurementId, Is.EqualTo(measurementId));
            Assert.That(measurement.ManufactureCode, Is.EqualTo("2026-02"));
            Assert.That(measurement.ProductState, Is.EqualTo(ProductState.New));
            Assert.That(measurement.MeasurementState, Is.EqualTo(MeasurementState.Created));
            Assert.That(measurement.IsPublishedOnEbay, Is.False);
        }

        return new MeasurementContext(httpClient, ebayClient, productId, measurementId);
    }

    private static async Task AssertMeasurementPublishedStateAsync(
        EbayClient ebayClient,
        Guid productId,
        string measurementId,
        bool expectedIsPublished)
    {
        var updatedMeasurements = await ebayClient.GetMeasurementsAsync(measurementState: null, productId: productId);
        var updatedMeasurement = updatedMeasurements.SingleOrDefault(x => x.MeasurementId == measurementId);

        if (updatedMeasurement == null)
        {
            throw new AssertionException($"Measurement '{measurementId}' was not found.");
        }

        if (updatedMeasurement.IsPublishedOnEbay != expectedIsPublished)
        {
            throw new AssertionException(
                $"Expected IsPublishedOnEbay={expectedIsPublished} for measurement '{measurementId}', but was {updatedMeasurement.IsPublishedOnEbay}.");
        }
    }

    private static async Task AssertMeasurementPageEndpointsAsync(HttpClient httpClient, string measurementId)
    {
        await AssertDownloadZipAsync(httpClient, measurementId);
        await AssertSvgResponseAsync(httpClient, $"/m/{measurementId}/ebay_tube_description");
        await AssertSvgResponseAsync(httpClient, "/m/sold");
        await AssertSvgResponseAsync(httpClient, $"/m/{measurementId}/curves");
        await AssertSvgResponseAsync(httpClient, "/empty_picture?product=test-product&lotId=test-lot");
    }

    private static async Task AssertDownloadZipAsync(HttpClient httpClient, string measurementId)
    {
        using var response = await httpClient.GetAsync($"/m/{measurementId}/download");
        using (Assert.EnterMultipleScope())
        {
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(response.Content.Headers.ContentType?.MediaType, Is.EqualTo("application/zip"));
            Assert.That(response.Content.Headers.ContentDisposition?.FileName, Is.EqualTo($"{measurementId}.zip"));
        }

        var zipContent = await response.Content.ReadAsByteArrayAsync();
        using var zipStream = new MemoryStream(zipContent);
        using var archive = new ZipArchive(zipStream, ZipArchiveMode.Read);
        Assert.That(archive.Entries, Is.Not.Empty);
    }

    private static async Task AssertSvgResponseAsync(HttpClient httpClient, string url)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        await AssertSvgResponseAsync(httpClient, request);
    }

    private static async Task AssertSvgResponseAsync(HttpClient httpClient, HttpRequestMessage request)
    {
        using var response = await httpClient.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();

        using (Assert.EnterMultipleScope())
        {
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), content);
            Assert.That(response.Content.Headers.ContentType?.MediaType, Is.EqualTo("image/svg+xml"));
            Assert.That(content, Does.Contain("<svg"));
        }
    }

    private sealed record MeasurementContext(
        HttpClient HttpClient,
        EbayClient EbayClient,
        Guid ProductId,
        string MeasurementId) : IDisposable
    {
        public void Dispose() => HttpClient.Dispose();
    }
}