using Tests.Shared;
using System.Net;
using AwesomeAssertions;
using Client.Clients.Generated;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.New.HostedServices;
using SkiaSharp;

namespace Tests.Integration.Tests;

public class MeasurementPhotosFlowTests
{
    [Test]
    [OpenSpecScenario("measurement-photos", "Photo thumbnail retrieval", "Fetch thumbnail for an uploaded photo")]
    public async Task GetMeasurementPhotoThumbnailContent_ReturnsJpegThumbnail_ForUploadedPhoto()
    {
        using var context = await CreateMeasurementContextAsync();

        await context.WebApiClient.UploadMeasurementPhotoAsync(
            context.MeasurementId,
            new MeasurementPhotoUploadRequest
            {
                FileName = "tube.jpg",
                ContentType = "image/png",
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
    [OpenSpecScenario("measurement-photos", "Photo thumbnail retrieval", "Fetch missing photo's thumbnail")]
    public async Task GetMeasurementPhotoThumbnailContent_ReturnsNotFound_WhenPhotoDoesNotExist()
    {
        using var context = await CreateMeasurementContextAsync();

        using var response = await context.HttpClient.GetAsync(
            $"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{Guid.NewGuid()}/thumbnail/content");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Photo binary retrieval", "Fetch existing photo content")]
    [OpenSpecScenario("measurement-photos", "Photo deletion re-orders remaining photos", "Delete a photo that is not last in order")]
    [OpenSpecScenario("measurement-photos", "Photo management from the internal office measurements page", "Delete a photo from the office view")]
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
                ContentType = "image/png",
                File = firstPhotoContent
            });
        await context.WebApiClient.UploadMeasurementPhotoAsync(
            context.MeasurementId,
            new MeasurementPhotoUploadRequest
            {
                FileName = "second.jpg",
                ContentType = "image/png",
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
        await AssertPhotoContentStatusAsync(context.HttpClient, context.MeasurementId, photos[0].Id, HttpStatusCode.NotFound);
        await AssertPhotoThumbnailStatusAsync(context.HttpClient, context.MeasurementId, photos[0].Id, HttpStatusCode.NotFound);
        var listing = await context.HttpClient.GetStringAsync($"/ebay_description/{context.ProductId}?measurementState=Created&state=New");
        listing.Should().NotContain(photos[0].Id.ToString());
        listing.Should().Contain(photos[1].Id.ToString());
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Photos shown on the eBay listing description page", "Measurement with photos")]
    [OpenSpecScenario("measurement-photos", "Photos shown on the eBay listing description page", "Measurement with no photos")]
    [OpenSpecScenario("measurement-photos", "Photos shown on the eBay listing description page", "Hovering a thumbnail previews the full photo in place")]
    [OpenSpecScenario("measurement-photos", "Photos shown on the eBay listing description page", "Tapping or clicking a thumbnail previews the full photo in place (mobile-friendly)")]
    [OpenSpecScenario("measurement-photos", "Photos shown on the eBay listing description page", "Tapping or clicking the backdrop closes the preview")]
    [OpenSpecScenario("measurement-photos", "Photos shown on the eBay listing description page", "Thumbnail is not a clickable link")]
    [OpenSpecScenario("measurement-photos", "Photos shown on the eBay listing description page", "Instruction shown when the lot has photos")]
    [OpenSpecScenario("measurement-photos", "Deferred loading of the full-size preview image on the eBay listing description page", "Full-size image not requested on page load")]
    [OpenSpecScenario("measurement-photos", "Deferred loading of the full-size preview image on the eBay listing description page", "Full-size image requested only on interaction")]
    public async Task EbayDescriptionPage_ShowsPhotosForMeasurementsThatHaveThem()
    {
        using var context = await CreateMeasurementContextAsync();

        await context.WebApiClient.UploadMeasurementPhotoAsync(
            context.MeasurementId,
            new MeasurementPhotoUploadRequest
            {
                FileName = "tube.jpg",
                ContentType = "image/png",
                File = TestHelpers.CreateValidPhotoBytes()
            });
        await context.WebApiClient.UploadMeasurementPhotoAsync(context.MeasurementId,
            new MeasurementPhotoUploadRequest { FileName = "second.png", ContentType = "image/png", File = TestHelpers.CreateValidPhotoBytes(colorSeed: 20) });
        var photo = (await context.WebApiClient.GetMeasurementPhotosAsync(context.MeasurementId)).OrderBy(static x => x.Order).First();

        var otherMeasurementId = await CreateBareMeasurementIdAsync(context);

        var descriptionUrl = $"/ebay_description/{context.ProductId}?measurementState=Created&state=New";
        using var response = await context.HttpClient.GetAsync(descriptionUrl);
        var html = await response.Content.ReadAsStringAsync();

        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK), html);

        var baseUrl = context.HttpClient.BaseAddress!.GetLeftPart(UriPartial.Authority);
        var thumbnailPath = $"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{photo.Id}/thumbnail/content";
        var fullContentPath = $"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{photo.Id}/content";

        using (Assert.EnterMultipleScope())
        {
            // Thumbnail stays a real, eagerly-loaded <img>.
            Assert.That(html, Does.Contain($"src=\"{baseUrl}{thumbnailPath}\""));
            // The full-size image URL must be present (referenced from a CSS rule)...
            Assert.That(html, Does.Contain(fullContentPath));
            // ...but never as an eagerly-loaded <img src>, only inside a CSS background-image rule.
            Assert.That(html, Does.Not.Contain($"src=\"{baseUrl}{fullContentPath}\""));
            Assert.That(html, Does.Contain($"url(\"{baseUrl}{fullContentPath}\")"));
            Assert.That(html, Does.Not.Contain($"/measurements/{otherMeasurementId}/photos/"));
        }

        html.Should().Contain("Hover over (or tap, on mobile)");
        await PhotoPreviewBrowser.VerifyAsync(html, deferredFullImage: true);

        using var thumbnailResponse = await context.HttpClient.GetAsync(thumbnailPath);
        Assert.That(thumbnailResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        using var fullContentResponse = await context.HttpClient.GetAsync(fullContentPath);
        Assert.That(fullContentResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Photo binary retrieval", "Fetch photo content for a sold measurement")]
    [OpenSpecScenario("measurement-photos", "Photo thumbnail retrieval", "Fetch thumbnail for a sold measurement")]
    public async Task GetMeasurementPhotoContentAndThumbnail_ReturnPlaceholder_ForSoldMeasurement()
    {
        using var context = await CreateMeasurementContextAsync();

        await context.WebApiClient.UploadMeasurementPhotoAsync(
            context.MeasurementId,
            new MeasurementPhotoUploadRequest
            {
                FileName = "tube.jpg",
                ContentType = "image/png",
                File = TestHelpers.CreateValidPhotoBytes()
            });
        var photo = (await context.WebApiClient.GetMeasurementPhotosAsync(context.MeasurementId)).Single();

        await AssertPhotoContentAsync(context.HttpClient, context.MeasurementId, photo.Id, TestHelpers.CreateValidPhotoBytes());
        await AssertPhotoThumbnailStatusAsync(context.HttpClient, context.MeasurementId, photo.Id, HttpStatusCode.OK);

        await context.EbayClient.UpdateMeasurementStateAsync(MeasurementState.Sold, context.ProductId, context.MeasurementId);

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
            AssertPhotoPlaceholdersAsync(context.HttpClient, context.MeasurementId, photo.Id));
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Photos shown on the eBay listing description page", "A sold measurement's photo no longer reveals the real photo")]
    public async Task SoldPhoto_InRenderedListing_ShowsDisplayablePlaceholders_OnHoverAndTap()
    {
        using var context = await CreateMeasurementContextAsync();
        var original = TestHelpers.CreateValidPhotoBytes(colorSeed: 30);
        await context.WebApiClient.UploadMeasurementPhotoAsync(context.MeasurementId,
            new MeasurementPhotoUploadRequest { FileName = "sold.png", ContentType = "image/png", File = original });
        var photo = (await context.WebApiClient.GetMeasurementPhotosAsync(context.MeasurementId)).Single();

        // eBay keeps the description HTML published before the sale.
        var html = await context.HttpClient.GetStringAsync(
            $"/ebay_description/{context.ProductId}?measurementState=Created&state=New");
        await AssertPhotoContentAsync(context.HttpClient, context.MeasurementId, photo.Id, original);
        await AssertPhotoThumbnailStatusAsync(context.HttpClient, context.MeasurementId, photo.Id, HttpStatusCode.OK);
        await context.EbayClient.UpdateMeasurementStateAsync(MeasurementState.Sold, context.ProductId, context.MeasurementId);
        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
            AssertPhotoPlaceholdersAsync(context.HttpClient, context.MeasurementId, photo.Id));

        await SoldPhotoPreviewBrowser.VerifyAsync(context.HttpClient, html, context.MeasurementId, photo.Id, original);
    }

    [Test]
    public async Task GetMeasurementPhotoContentAndThumbnail_ReturnNotFound_ForSoldMeasurement_WhenPhotoIdIsUnknown()
    {
        using var context = await CreateMeasurementContextAsync();
        await context.EbayClient.UpdateMeasurementStateAsync(MeasurementState.Sold, context.ProductId, context.MeasurementId);

        await TestHelpers.RetryUntilValidationSuccessAsync(async () =>
        {
            using var contentResponse = await context.HttpClient.GetAsync(
                $"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{Guid.NewGuid()}/content");
            using var thumbnailResponse = await context.HttpClient.GetAsync(
                $"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{Guid.NewGuid()}/thumbnail/content");

            using (Assert.EnterMultipleScope())
            {
                Assert.That(contentResponse.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
                Assert.That(thumbnailResponse.StatusCode, Is.EqualTo(HttpStatusCode.NotFound));
            }
        });
    }

    [Test]
    [NonParallelizable]
    public async Task GetMeasurementPhotoContentAndThumbnail_DoesNotQueryDatabase_OnSecondNotSoldRequest()
    {
        using var context = await CreateMeasurementContextAsync();

        await context.WebApiClient.UploadMeasurementPhotoAsync(
            context.MeasurementId,
            new MeasurementPhotoUploadRequest
            {
                FileName = "tube.jpg",
                ContentType = "image/png",
                File = TestHelpers.CreateValidPhotoBytes()
            });
        var photo = (await context.WebApiClient.GetMeasurementPhotosAsync(context.MeasurementId)).Single();
        var counter = IntegrationTestsSetupFixture.DatabaseCommandCounter;

        using var contentCounterScope = counter.BeginScope("ProductMeasurements", "MeasurementPhotos");
        await AssertPhotoContentStatusAsync(context.HttpClient, context.MeasurementId, photo.Id, HttpStatusCode.OK);
        var countAfterFirstContentRequest = contentCounterScope.Count;
        countAfterFirstContentRequest.Should().BeGreaterThan(0);
        await AssertPhotoContentStatusAsync(context.HttpClient, context.MeasurementId, photo.Id, HttpStatusCode.OK);
        contentCounterScope.Count.Should().Be(countAfterFirstContentRequest);

        using var thumbnailCounterScope = counter.BeginScope("ProductMeasurements", "MeasurementPhotos");
        await AssertPhotoThumbnailStatusAsync(context.HttpClient, context.MeasurementId, photo.Id, HttpStatusCode.OK);
        var countAfterFirstThumbnailRequest = thumbnailCounterScope.Count;
        countAfterFirstThumbnailRequest.Should().BeGreaterThan(0);
        await AssertPhotoThumbnailStatusAsync(context.HttpClient, context.MeasurementId, photo.Id, HttpStatusCode.OK);
        thumbnailCounterScope.Count.Should().Be(countAfterFirstThumbnailRequest);
    }

    [Test]
    [NonParallelizable]
    public async Task GetMeasurementPhotoContentAndThumbnail_DoesNotQueryDatabase_OnSecondSoldRequest()
    {
        using var context = await CreateMeasurementContextAsync();
        await context.WebApiClient.UploadMeasurementPhotoAsync(context.MeasurementId,
            new MeasurementPhotoUploadRequest { FileName = "sold.png", ContentType = "image/png", File = TestHelpers.CreateValidPhotoBytes() });
        var photo = (await context.WebApiClient.GetMeasurementPhotosAsync(context.MeasurementId)).Single();
        // Observe the queued invalidation through warmed real entries before measuring cache hits.
        await AssertPhotoContentAsync(context.HttpClient, context.MeasurementId, photo.Id, TestHelpers.CreateValidPhotoBytes());
        await AssertPhotoThumbnailStatusAsync(context.HttpClient, context.MeasurementId, photo.Id, HttpStatusCode.OK);
        await context.EbayClient.UpdateMeasurementStateAsync(MeasurementState.Sold, context.ProductId, context.MeasurementId);
        var counter = IntegrationTestsSetupFixture.DatabaseCommandCounter;
        var contentPhotoId = photo.Id;
        var thumbnailPhotoId = photo.Id;

        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
            AssertPhotoPlaceholdersAsync(context.HttpClient, context.MeasurementId, photo.Id));

        using var contentCounterScope = counter.BeginScope("ProductMeasurements", "MeasurementPhotos");
        await AssertPhotoContentStatusAsync(context.HttpClient, context.MeasurementId, contentPhotoId, HttpStatusCode.OK);
        var countAfterFirstContentRequest = contentCounterScope.Count;
        await AssertPhotoContentStatusAsync(context.HttpClient, context.MeasurementId, contentPhotoId, HttpStatusCode.OK);
        contentCounterScope.Count.Should().Be(countAfterFirstContentRequest);

        using var thumbnailCounterScope = counter.BeginScope("ProductMeasurements", "MeasurementPhotos");
        await AssertPhotoThumbnailStatusAsync(context.HttpClient, context.MeasurementId, thumbnailPhotoId, HttpStatusCode.OK);
        var countAfterFirstThumbnailRequest = thumbnailCounterScope.Count;
        await AssertPhotoThumbnailStatusAsync(context.HttpClient, context.MeasurementId, thumbnailPhotoId, HttpStatusCode.OK);
        thumbnailCounterScope.Count.Should().Be(countAfterFirstThumbnailRequest);
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Bounded original photo size", "Previously stored photo exceeding the bound is migrated")]
    public async Task MeasurementPhotoOriginalSizeBackfill_CompressesOversizedPhoto_AndLeavesCompliantPhotoUnchanged()
    {
        using var context = await CreateMeasurementContextAsync();

        var compliantContent = TestHelpers.CreateValidPhotoBytes();
        await context.WebApiClient.UploadMeasurementPhotoAsync(
            context.MeasurementId,
            new MeasurementPhotoUploadRequest { FileName = "small.jpg", ContentType = "image/png", File = compliantContent });
        await context.WebApiClient.UploadMeasurementPhotoAsync(
            context.MeasurementId,
            new MeasurementPhotoUploadRequest { FileName = "to-be-oversized.jpg", ContentType = "image/png", File = compliantContent });

        var photos = (await context.WebApiClient.GetMeasurementPhotosAsync(context.MeasurementId))
            .OrderBy(x => x.Order)
            .ToList();
        var compliantPhotoId = photos[0].Id;
        var toBeOversizedPhotoId = photos[1].Id;

        using (var scope = IntegrationTestsSetupFixture.Factory.Services.CreateScope())
        {
            var repository = scope.ServiceProvider.GetRequiredService<IMeasurementPhotoRepository>();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IWriteModelUnitOfWork>();

            var photo = await repository.GetByIdAsync(toBeOversizedPhotoId, CancellationToken.None);
            photo!.CompressOriginalContent(CreateOversizedPhotoBytes());
            await unitOfWork.SaveChangesAsync(CancellationToken.None);
        }

#pragma warning disable CS0618 // Тест обсолетного одноразового backfill - будет удалён вместе с ним.
        using (var scope = IntegrationTestsSetupFixture.Factory.Services.CreateScope())
        {
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<MeasurementPhotoOriginalSizeBackfillHostedService>>();
            var scopeFactory = scope.ServiceProvider.GetRequiredService<IServiceScopeFactory>();
            await new MeasurementPhotoOriginalSizeBackfillHostedService(logger, scopeFactory).StartAsync(CancellationToken.None);
        }
#pragma warning restore CS0618

        await AssertPhotoContentAsync(context.HttpClient, context.MeasurementId, compliantPhotoId, compliantContent);

        using var oversizedResponse = await context.HttpClient.GetAsync(
            $"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{toBeOversizedPhotoId}/content");
        var oversizedContentBytes = await oversizedResponse.Content.ReadAsByteArrayAsync();
        using var decodedOversized = SKBitmap.Decode(oversizedContentBytes);

        Assert.That(Math.Max(decodedOversized.Width, decodedOversized.Height), Is.LessThanOrEqualTo(2000));
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Photo binary retrieval", "Fetch missing photo content")]
    [TestCase(false)]
    [TestCase(true)]
    public async Task MissingPhotoContent_ReturnsNotFound(bool unknownMeasurement)
    {
        using var context = await CreateMeasurementContextAsync();
        var measurementId = unknownMeasurement ? "missing-measurement" : context.MeasurementId;
        await AssertPhotoContentStatusAsync(context.HttpClient, measurementId, Guid.NewGuid(), HttpStatusCode.NotFound);
        await AssertPhotoThumbnailStatusAsync(context.HttpClient, measurementId, Guid.NewGuid(), HttpStatusCode.NotFound);
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Photos shown on the eBay listing description page", "Instruction absent when the lot has no photos")]
    public async Task ListingWithoutPhotos_OmitsInstructionAndImages()
    {
        using var context = await CreateMeasurementContextAsync();
        var html = await context.HttpClient.GetStringAsync($"/ebay_description/{context.ProductId}?measurementState=Created&state=New");
        html.Should().NotContain("Hover over (or tap, on mobile)");
        html.Should().NotContain("/photos/");
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Batched photo metadata query", "Query metadata for multiple measurements at once")]
    [OpenSpecScenario("measurement-photos", "Batched photo metadata query", "Query metadata for a measurement with no photos")]
    public async Task MetadataQuery_BatchesMeasurements_WithoutSelectingBinaryColumns()
    {
        using var context = await CreateMeasurementContextAsync();
        var secondId = await CreateBareMeasurementIdAsync(context);
        var emptyId = await CreateBareMeasurementIdAsync(context);
        foreach (var id in new[] { context.MeasurementId, secondId })
        {
            await context.WebApiClient.UploadMeasurementPhotoAsync(id,
                new MeasurementPhotoUploadRequest { FileName = id + ".png", ContentType = "image/png", File = TestHelpers.CreateValidPhotoBytes() });
        }
        using var services = IntegrationTestsSetupFixture.Factory.Services.CreateScope();
        var queries = services.ServiceProvider.GetRequiredService<IMeasurementPhotoQueries>();
        using var counter = IntegrationTestsSetupFixture.DatabaseCommandCounter.BeginScope("MeasurementPhotos");
        var metadata = await queries.GetMetadataByMeasurementIds([context.MeasurementId, secondId, emptyId], CancellationToken.None);
        metadata.Select(static x => x.MeasurementId).Should().BeEquivalentTo([context.MeasurementId, secondId]);
        metadata.Should().OnlyContain(static x => x.Order == 0 && x.FileName == x.MeasurementId + ".png" && x.Id != Guid.Empty);
        counter.Count.Should().Be(1);
        counter.Commands.Should().ContainSingle().Which.Should().NotContain("\"Content\"").And.NotContain("\"ThumbnailContent\"");
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Bounded original photo size", "Uploading a photo above the bound")]
    public async Task UploadOversizedPng_ReturnsBoundedJpegWithMatchingContentTypeAndThumbnail()
    {
        const int MaximumDimension = 2000;
        const int MaximumEncodedBytes = 2 * 1024 * 1024;
        const int ThumbnailDimension = 400;
        using var context = await CreateMeasurementContextAsync();
        using var bitmap = new SKBitmap(MaximumDimension * 2, MaximumDimension);
        bitmap.Erase(SKColors.CornflowerBlue);
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Png, quality: 100);
        await context.WebApiClient.UploadMeasurementPhotoAsync(context.MeasurementId,
            new MeasurementPhotoUploadRequest { FileName = "large.png", ContentType = "image/png", File = data.ToArray() });
        var photo = (await context.WebApiClient.GetMeasurementPhotosAsync(context.MeasurementId)).Single();
        using var response = await context.HttpClient.GetAsync($"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{photo.Id}/content");
        response.Content.Headers.ContentType?.MediaType.Should().Be("image/jpeg");
        var content = await response.Content.ReadAsByteArrayAsync();
        content.Length.Should().BeLessThanOrEqualTo(MaximumEncodedBytes);
        using var codec = SKCodec.Create(new SKMemoryStream(content));
        codec.EncodedFormat.Should().Be(SKEncodedImageFormat.Jpeg);
        codec.Info.Width.Should().Be(MaximumDimension);
        using var thumbnailResponse = await context.HttpClient.GetAsync($"/api/webapi/v1/measurements/{context.MeasurementId}/photos/{photo.Id}/thumbnail/content");
        using var thumbnail = SKBitmap.Decode(await thumbnailResponse.Content.ReadAsByteArrayAsync());
        thumbnail.Width.Should().Be(ThumbnailDimension);
    }

    private static byte[] CreateOversizedPhotoBytes()
    {
        using var bitmap = new SKBitmap(4000, 2000);
        bitmap.Erase(SKColors.CornflowerBlue);
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Jpeg, quality: 90);
        return data.ToArray();
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

    private static async Task AssertPhotoPlaceholdersAsync(HttpClient httpClient, string measurementId, Guid photoId)
    {
        using var contentResponse = await httpClient.GetAsync(
            $"/api/webapi/v1/measurements/{measurementId}/photos/{photoId}/content");
        using var thumbnailResponse = await httpClient.GetAsync(
            $"/api/webapi/v1/measurements/{measurementId}/photos/{photoId}/thumbnail/content");

        using (Assert.EnterMultipleScope())
        {
            Assert.That(contentResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(contentResponse.Content.Headers.ContentType?.MediaType, Is.EqualTo("image/png"));
            Assert.That(thumbnailResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));
            Assert.That(thumbnailResponse.Content.Headers.ContentType?.MediaType, Is.EqualTo("image/png"));
        }

        var contentBytes = await contentResponse.Content.ReadAsByteArrayAsync();
        var thumbnailBytes = await thumbnailResponse.Content.ReadAsByteArrayAsync();
        using var decodedContent = SKBitmap.Decode(contentBytes);
        using var decodedThumbnail = SKBitmap.Decode(thumbnailBytes);
        decodedContent.Should().NotBeNull();
        decodedThumbnail.Should().NotBeNull();
        decodedContent.Width.Should().Be(1);
        decodedThumbnail.Width.Should().Be(1);

        using (Assert.EnterMultipleScope())
        {
            Assert.That(contentBytes, Is.Not.EqualTo(TestHelpers.CreateValidPhotoBytes()));
            Assert.That(contentBytes, Is.Not.Empty);
            Assert.That(thumbnailBytes, Is.Not.Empty);
        }
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
        response.Content.Headers.ContentType?.MediaType.Should().Be("image/png");
        Assert.That(content, Is.EqualTo(expectedContent));
    }

    private static async Task AssertPhotoContentStatusAsync(
        HttpClient httpClient,
        string measurementId,
        Guid photoId,
        HttpStatusCode expectedStatusCode)
    {
        using var response = await httpClient.GetAsync($"/api/webapi/v1/measurements/{measurementId}/photos/{photoId}/content");
        Assert.That(response.StatusCode, Is.EqualTo(expectedStatusCode));
    }

    private static async Task AssertPhotoThumbnailStatusAsync(
        HttpClient httpClient,
        string measurementId,
        Guid photoId,
        HttpStatusCode expectedStatusCode)
    {
        using var response = await httpClient.GetAsync($"/api/webapi/v1/measurements/{measurementId}/photos/{photoId}/thumbnail/content");
        Assert.That(response.StatusCode, Is.EqualTo(expectedStatusCode));
    }

    private static async Task<string> CreateBareMeasurementIdAsync(MeasurementContext existingContext)
    {
        var randomSeed = TestHelpers.NextMeasurementSeed();
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

        var randomSeed = TestHelpers.NextMeasurementSeed();
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
