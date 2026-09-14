using Tests.Shared;
using AwesomeAssertions;
using Server.Adapters.Driven.ImageProcessing;
using SkiaSharp;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(PhotoThumbnailGenerator))]
public sealed class PhotoThumbnailGeneratorTests
{
    private readonly PhotoThumbnailGenerator _generator = new();

    [Test]
    public async Task CreateThumbnailAsync_CapsLongestEdge_PreservingAspectRatio()
    {
        var original = CreatePngBytes(width: 800, height: 400);

        var thumbnail = await _generator.CreateThumbnailAsync(original, CancellationToken.None);

        using var decoded = SKBitmap.Decode(thumbnail);
        decoded.Width.Should().Be(400);
        decoded.Height.Should().Be(200);
    }

    [Test]
    public async Task CreateThumbnailAsync_DoesNotUpscale_SmallerThanCap()
    {
        var original = CreatePngBytes(width: 50, height: 20);

        var thumbnail = await _generator.CreateThumbnailAsync(original, CancellationToken.None);

        using var decoded = SKBitmap.Decode(thumbnail);
        decoded.Width.Should().Be(50);
        decoded.Height.Should().Be(20);
    }

    [Test]
    public async Task CreateThumbnailAsync_ProducesJpegBytes()
    {
        var original = CreatePngBytes(width: 100, height: 100);

        var thumbnail = await _generator.CreateThumbnailAsync(original, CancellationToken.None);

        using var codec = SKCodec.Create(new SKMemoryStream(thumbnail));
        codec.EncodedFormat.Should().Be(SKEncodedImageFormat.Jpeg);
    }

    [Test]
    public async Task CreateThumbnailAsync_Throws_WhenBytesAreNotAnImage()
    {
        var act = () => _generator.CreateThumbnailAsync([1, 2, 3], CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>();
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Bounded original photo size", "Uploading a photo above the bound")]
    public async Task CreateBoundedOriginalAsync_ReEncodesWithinBound_WhenOriginalExceedsCap()
    {
        var original = CreatePngBytes(width: 4000, height: 2000);

        var bounded = await _generator.CreateBoundedOriginalAsync(original, CancellationToken.None);

        using var decoded = SKBitmap.Decode(bounded);
        decoded.Width.Should().Be(2000);
        decoded.Height.Should().Be(1000);
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Bounded original photo size", "Uploading a photo within the bound")]
    public async Task CreateBoundedOriginalAsync_ReturnsBytesUnchanged_WhenAlreadyWithinBound()
    {
        var original = CreatePngBytes(width: 800, height: 400);

        var bounded = await _generator.CreateBoundedOriginalAsync(original, CancellationToken.None);

        bounded.Should().BeSameAs(original);
    }

    [Test]
    public async Task CreateBoundedOriginalAsync_Throws_WhenBytesAreNotAnImage()
    {
        var act = () => _generator.CreateBoundedOriginalAsync([1, 2, 3], CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>();
    }

    [Test]
    [OpenSpecScenario("measurement-photos", "Bounded original photo size", "Uploading a photo above the bound")]
    public async Task CreateBoundedOriginalAsync_CompressesByteOversizeEvenWithinPixelBound()
    {
        const int MaximumEncodedBytes = 2 * 1024 * 1024;
        const int ImageDimension = 1600;
        var random = new Random(42);
        using var bitmap = new SKBitmap(ImageDimension, ImageDimension);
        var pixels = new SKColor[ImageDimension * ImageDimension];
        for (var index = 0; index < pixels.Length; index++)
        {
            pixels[index] = new SKColor((byte)random.Next(256), (byte)random.Next(256), (byte)random.Next(256));
        }
        bitmap.Pixels = pixels;
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Png, quality: 100);
        var original = data.ToArray();
        original.Length.Should().BeGreaterThan(MaximumEncodedBytes);
        var bounded = await _generator.CreateBoundedOriginalAsync(original, CancellationToken.None);
        bounded.Length.Should().BeLessThanOrEqualTo(MaximumEncodedBytes);
        using var decoded = SKBitmap.Decode(bounded);
        decoded.Should().NotBeNull();
        decoded.Width.Should().BeLessThanOrEqualTo(ImageDimension);
    }

    private static byte[] CreatePngBytes(int width, int height)
    {
        using var bitmap = new SKBitmap(width, height);
        bitmap.Erase(SKColors.CornflowerBlue);
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Png, quality: 100);
        return data.ToArray();
    }
}