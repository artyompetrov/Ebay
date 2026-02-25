using System.IO.Compression;
using System.Net;
using Client.Clients.Generated;

namespace Tests.Integration.Tests;

[Parallelizable(ParallelScope.Self)]
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

        using var ebayCurvesResponse = await httpClient.GetAsync($"/m/{measurementId}/ebay_curves");
        var ebayCurvesContent = await ebayCurvesResponse.Content.ReadAsStringAsync();

        using (Assert.EnterMultipleScope())
        {
            Assert.That(ebayCurvesResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK), ebayCurvesContent);
            Assert.That(ebayCurvesContent, Does.Contain("<svg"));
        }

        var isPublishedOnEbay = false;
        var startedAt = DateTime.UtcNow;

        while (!isPublishedOnEbay && DateTime.UtcNow - startedAt < TimeSpan.FromSeconds(20))
        {
            var updatedMeasurements = await ebayClient.GetMeasurementsAsync(measurementState: null, productId: productId);
            var updatedMeasurement = updatedMeasurements.SingleOrDefault(x => x.MeasurementId == measurementId);
            isPublishedOnEbay = updatedMeasurement?.IsPublishedOnEbay == true;

            if (!isPublishedOnEbay)
            {
                await Task.Delay(250);
            }
        }

        Assert.That(isPublishedOnEbay, Is.True);
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
