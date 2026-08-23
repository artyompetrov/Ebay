using System.Net;
using AwesomeAssertions;
using Client.Clients.Generated;

namespace Tests.Integration.Tests;

public class MeasurementPhotosFlowTests
{
    [Test]
    public async Task GetMeasurementPhotoThumbnailContent_ReturnsJpegThumbnail_ForUploadedPhoto()
    {
        using var context = await CreateMeasurementContextAsync();

        await context.WebApiClient.UploadMeasurementPhotoAsync(
            context.MeasurementId,
            new MeasurementPhotoUploadRequest
            {
                FileName = "tube.jpg",
                ContentType = "image/jpeg",
                File = TestHelpers.CreateValidPhotoBytes()
            });
        var photo = (await context.WebApiClient.GetMeasurementPhotosAsync(context.MeasurementId)).Single();

        using var response = await context.HttpClient.GetAsync(
            $"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{photo.Id}/thumbnail/content");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        response.Content.Headers.ContentType!.MediaType.Should().Be("image/jpeg");

        var thumbnailBytes = await response.Content.ReadAsByteArrayAsync();
        thumbnailBytes.Should().NotBeEmpty();
    }

    [Test]
    public async Task GetMeasurementPhotoThumbnailContent_ReturnsNotFound_WhenPhotoDoesNotExist()
    {
        using var context = await CreateMeasurementContextAsync();

        using var response = await context.HttpClient.GetAsync(
            $"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{Guid.NewGuid()}/thumbnail/content");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Test]
    public async Task UploadListDeleteAndCount_Work()
    {
        using var context = await CreateMeasurementContextAsync();

        var firstPhotoContent = TestHelpers.CreateValidPhotoBytes(colorSeed: 10);
        var secondPhotoContent = TestHelpers.CreateValidPhotoBytes(colorSeed: 20);

        await context.WebApiClient.UploadMeasurementPhotoAsync(
            context.MeasurementId,
            new MeasurementPhotoUploadRequest
            {
                FileName = "first.jpg",
                ContentType = "image/jpeg",
                File = firstPhotoContent
            });
        await context.WebApiClient.UploadMeasurementPhotoAsync(
            context.MeasurementId,
            new MeasurementPhotoUploadRequest
            {
                FileName = "second.jpg",
                ContentType = "image/jpeg",
                File = secondPhotoContent
            });

        var photos = (await context.WebApiClient.GetMeasurementPhotosAsync(context.MeasurementId))
            .OrderBy(x => x.Order)
            .ToList();

        using (Assert.EnterMultipleScope())
        {
            Assert.That(photos, Has.Count.EqualTo(2));
            Assert.That(photos[0].FileName, Is.EqualTo("first.jpg"));
            Assert.That(photos[0].Order, Is.Zero);
            Assert.That(photos[1].FileName, Is.EqualTo("second.jpg"));
            Assert.That(photos[1].Order, Is.EqualTo(1));
        }

        await AssertPhotoContentAsync(context.HttpClient, context.MeasurementId, photos[0].Id, firstPhotoContent);

        var otherMeasurementId = await CreateBareMeasurementIdAsync(context);

        var counts = await context.WebApiClient.GetMeasurementPhotoCountsAsync(
            [context.MeasurementId, otherMeasurementId]);

        using (Assert.EnterMultipleScope())
        {
            Assert.That(counts.Single(x => x.MeasurementId == context.MeasurementId).PhotoCount, Is.EqualTo(2));
            Assert.That(counts.SingleOrDefault(x => x.MeasurementId == otherMeasurementId), Is.Null);
        }

        await context.WebApiClient.DeleteMeasurementPhotoAsync(context.MeasurementId, photos[0].Id);

        var remainingPhotos = (await context.WebApiClient.GetMeasurementPhotosAsync(context.MeasurementId))
            .OrderBy(x => x.Order)
            .ToList();

        using (Assert.EnterMultipleScope())
        {
            Assert.That(remainingPhotos, Has.Count.EqualTo(1));
            Assert.That(remainingPhotos[0].FileName, Is.EqualTo("second.jpg"));
            Assert.That(remainingPhotos[0].Order, Is.Zero);
        }

        var countsAfterDelete = await context.WebApiClient.GetMeasurementPhotoCountsAsync([context.MeasurementId]);
        Assert.That(countsAfterDelete.Single().PhotoCount, Is.EqualTo(1));
    }

    [Test]
    public async Task EbayDescriptionPage_ShowsPhotosForMeasurementsThatHaveThem()
    {
        using var context = await CreateMeasurementContextAsync();

        await context.WebApiClient.UploadMeasurementPhotoAsync(
            context.MeasurementId,
            new MeasurementPhotoUploadRequest
            {
                FileName = "tube.jpg",
                ContentType = "image/jpeg",
                File = TestHelpers.CreateValidPhotoBytes()
            });
        var photo = (await context.WebApiClient.GetMeasurementPhotosAsync(context.MeasurementId)).Single();

        var otherMeasurementId = await CreateBareMeasurementIdAsync(context);

        var descriptionUrl = $"/ebay_description/{context.ProductId}?measurementState=Created&state=New";
        using var response = await context.HttpClient.GetAsync(descriptionUrl);
        var html = await response.Content.ReadAsStringAsync();

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), html);

        using (Assert.EnterMultipleScope())
        {
            Assert.That(html, Does.Contain($"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{photo.Id}/content"));
            Assert.That(html, Does.Not.Contain($"/measurements/{otherMeasurementId}/photos/"));
        }

        var imgTagStart = html.IndexOf($"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{photo.Id}/content", StringComparison.Ordinal);
        var photoContentUrl = ExtractImgSrc(html, imgTagStart);
        using var photoResponse = await context.HttpClient.GetAsync(photoContentUrl);
        Assert.That(photoResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));
    }

    private static string ExtractImgSrc(string html, int urlStartIndex)
    {
        var srcAttributeStart = html.LastIndexOf("src=\"", urlStartIndex, StringComparison.Ordinal) + "src=\"".Length;
        var srcAttributeEnd = html.IndexOf('"', srcAttributeStart);
        return html[srcAttributeStart..srcAttributeEnd];
    }

    [Test]
    public async Task UploadMeasurementPhoto_ForUnknownMeasurement_ReturnsNotFound()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var webApiClient = TestHelpers.CreateWebApiClient(httpClient);

        var exception = Assert.ThrowsAsync<ApiException>(() => webApiClient.UploadMeasurementPhotoAsync(
            "unknown-measurement",
            new MeasurementPhotoUploadRequest
            {
                FileName = "photo.jpg",
                ContentType = "image/jpeg",
                File = [1]
            }));

        Assert.That(exception!.StatusCode, Is.EqualTo((int)HttpStatusCode.NotFound));
    }

    private static async Task AssertPhotoContentAsync(
        HttpClient httpClient,
        string measurementId,
        Guid photoId,
        byte[] expectedContent)
    {
        using var response = await httpClient.GetAsync($"/api/webapi/v1/measurements/{measurementId}/photos/{photoId}/content");
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        var content = await response.Content.ReadAsByteArrayAsync();
        Assert.That(content, Is.EqualTo(expectedContent));
    }

    private static async Task<string> CreateBareMeasurementIdAsync(MeasurementContext existingContext)
    {
        var randomSeed = Random.Shared.Next(1000, 9999);
        var measurementId = $"MEA{randomSeed}";

        await existingContext.EbayClient.UploadMeasurementAsync(
            new MeasurementDataToUpload
            {
                MeasurementId = measurementId,
                ManufactureCode = "2026-02",
                ProductState = ProductState.New,
                File = TestHelpers.CreateValidMeasurementArchive(randomSeed)
            },
            existingContext.ProductId);

        return measurementId;
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

        return new MeasurementContext(httpClient, ebayClient, webApiClient, productId, measurementId);
    }

    private sealed record MeasurementContext(
        HttpClient HttpClient,
        EbayClient EbayClient,
        WebApiClient WebApiClient,
        Guid ProductId,
        string MeasurementId) : IDisposable
    {
        public void Dispose() => HttpClient.Dispose();
    }
}