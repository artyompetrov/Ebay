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
    public void CreateThumbnailAsync_Throws_WhenBytesAreNotAnImage()
    {
        var act = () => _generator.CreateThumbnailAsync([1, 2, 3], CancellationToken.None);

        act.Should().ThrowAsync<InvalidOperationException>();
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
