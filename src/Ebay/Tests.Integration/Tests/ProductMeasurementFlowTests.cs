using System.IO.Compression;
using System.Net;
using Client.Clients.Generated;

namespace Tests.Integration.Tests;

public class ProductMeasurementFlowTests
{
    [Test]
    public async Task ProductCreation_AndMeasurementRegistration_MainFlow_Works()
    {
        using var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);

        var ebayClient = TestHelpers.CreateEbayClient(httpClient);
        var productId = await CreateProductAsync(ebayClient);

        var measurementId = "MEAS001";
        await ebayClient.UploadMeasurementAsync(
            new MeasurementDataToUpload
            {
                MeasurementId = measurementId,
                ManufactureCode = "2026-02",
                ProductState = ProductState.New,
                File = CreateValidMeasurementArchive()
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

        using (var internalRequest = new HttpRequestMessage(HttpMethod.Get, $"/m/{measurementId}/ebay_curves"))
        {
            internalRequest.Headers.Referrer = new Uri(httpClient.BaseAddress!, "/ebay_description/internal-preview");

            using var internalResponse = await httpClient.SendAsync(internalRequest);
            var internalContent = await internalResponse.Content.ReadAsStringAsync();

            using (Assert.EnterMultipleScope())
            {
                Assert.That(internalResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK), internalContent);
                Assert.That(internalContent, Does.Contain("<svg"));
            }
        }

        var measurementsAfterInternalView = await ebayClient.GetMeasurementsAsync(measurementState: null, productId: productId);
        var measurementAfterInternalView = measurementsAfterInternalView.Single();
        Assert.That(
            measurementAfterInternalView.IsPublishedOnEbay,
            Is.False,
            "Measurement should not be marked as published after same-host referer view.");

        await TestHelpers.RetryUntilValidationSuccessAsync(async () =>
        {
            using var ebayCurvesResponse = await httpClient.GetAsync($"/m/{measurementId}/ebay_curves");
            var ebayCurvesContent = await ebayCurvesResponse.Content.ReadAsStringAsync();

            using (Assert.EnterMultipleScope())
            {
                Assert.That(ebayCurvesResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK), ebayCurvesContent);
                Assert.That(ebayCurvesContent, Does.Contain("<svg"));
            }

            var updatedMeasurements = await ebayClient.GetMeasurementsAsync(measurementState: null, productId: productId);
            var updatedMeasurement = updatedMeasurements.SingleOrDefault(x => x.MeasurementId == measurementId);

            if (updatedMeasurement?.IsPublishedOnEbay != true)
            {
                throw new AssertionException("Measurement was not marked as published on eBay yet.");
            }
        });

        await AssertMeasurementPageEndpointsAsync(httpClient, measurementId);
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
        using var response = await httpClient.GetAsync(url);
        var content = await response.Content.ReadAsStringAsync();

        using (Assert.EnterMultipleScope())
        {
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), content);
            Assert.That(response.Content.Headers.ContentType?.MediaType, Is.EqualTo("image/svg+xml"));
            Assert.That(content, Does.Contain("<svg"));
        }
    }

    private static async Task<Guid> CreateProductAsync(EbayClient ebayClient)
    {
        var product = new ProductWithoutId
        {
            Name = $"integration-product-{Guid.NewGuid():N}",
            Weight = 100,
            SearchQueries =
            [
                new SearchQuery
                {
                    Id = Guid.NewGuid(),
                    Query = "integration product"
                }
            ],
            RuSearchQueries = []
        };

        return await ebayClient.CreateProductAsync(product);
    }

    private static byte[] CreateValidMeasurementArchive()
    {
        var config = string.Join('\n',
        [
            "9 number of stepping variables",
            "30 Variable 1 number of intervals",
            "4 measurement type",
            "0 Y2 axis variable",
            "12000 Pmax"
        ]);

        var data = string.Join('\n',
        [
            "Curve  Ia (mA)  Is (mA)  Vg (V)  Va (V)  Vs (V)  Vf (V)",
            "1  1.2  0.0  -1.0  100.0  100.0  6.3",
            "1  2.1  0.0  -0.5  150.0  150.0  6.3",
            "1  2.8  0.0  0.0  200.0  200.0  6.3"
        ]);

        using var stream = new MemoryStream();
        using (var archive = new ZipArchive(stream, ZipArchiveMode.Create, leaveOpen: true))
        {
            var configEntry = archive.CreateEntry("anode_curves.uts");
            using (var writer = new StreamWriter(configEntry.Open()))
            {
                writer.Write(config);
            }

            var dataEntry = archive.CreateEntry("anode_curves.uts.utd");
            using (var writer = new StreamWriter(dataEntry.Open()))
            {
                writer.Write(data);
            }
        }

        return stream.ToArray();
    }
}