using System.Net;
using AwesomeAssertions;
using Client.Clients.Generated;

namespace Tests.Integration.Tests;

public class MeasurementInventoryCheckFlowTests
{
    [Test]
    public async Task MarkMeasurementInventoryChecked_SetsLastInventoryCheckDate_ForExistingMeasurement()
    {
        using var context = await CreateMeasurementContextAsync();
        var beforeCheck = DateTimeOffset.UtcNow;

        var result = await context.WebApiClient.MarkMeasurementInventoryCheckedAsync(context.MeasurementId);

        result.MeasurementId.Should().Be(context.MeasurementId);
        result.LastInventoryCheckAt.Should().BeOnOrAfter(beforeCheck);
    }

    [Test]
    public async Task MarkMeasurementInventoryChecked_ForUnknownMeasurement_ReturnsNotFound()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var webApiClient = TestHelpers.CreateWebApiClient(httpClient);

        var exception = Assert.ThrowsAsync<ApiException>(() => webApiClient.MarkMeasurementInventoryCheckedAsync("unknown-measurement"));

        Assert.That(exception!.StatusCode, Is.EqualTo((int)HttpStatusCode.NotFound));
    }

    private static async Task<MeasurementContext> CreateMeasurementContextAsync()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);

        var ebayClient = TestHelpers.CreateEbayClient(httpClient);
        var webApiClient = TestHelpers.CreateWebApiClient(httpClient);
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

        return new MeasurementContext(httpClient, webApiClient, measurementId);
    }

    private sealed record MeasurementContext(
        HttpClient HttpClient,
        WebApiClient WebApiClient,
        string MeasurementId) : IDisposable
    {
        public void Dispose() => HttpClient.Dispose();
    }
}
