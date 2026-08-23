using Server.Application.Abstractions.Driven.Abstractions;
using SkiaSharp;

namespace Server.Adapters.Driven.ImageProcessing;

internal sealed class PhotoThumbnailGenerator : IPhotoThumbnailGenerator
{
    private const int ThumbnailMaxDimensionPixels = 400;
    private const int ThumbnailJpegQuality = 75;

    public Task<byte[]> CreateThumbnailAsync(byte[] originalContent, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        using var original = SKBitmap.Decode(originalContent)
            ?? throw new InvalidOperationException("Photo bytes could not be decoded as an image.");

        var (targetWidth, targetHeight) = GetThumbnailSize(original.Width, original.Height);

        using var resized = original.Resize(new SKImageInfo(targetWidth, targetHeight), SKFilterQuality.Medium);

        using var surface = SKSurface.Create(new SKImageInfo(targetWidth, targetHeight, SKColorType.Bgra8888, SKAlphaType.Premul));
        surface.Canvas.Clear(SKColors.White);
        surface.Canvas.DrawBitmap(resized, 0, 0);

        using var snapshot = surface.Snapshot();
        using var encoded = snapshot.Encode(SKEncodedImageFormat.Jpeg, ThumbnailJpegQuality);

        return Task.FromResult(encoded.ToArray());
    }

    private static (int Width, int Height) GetThumbnailSize(int originalWidth, int originalHeight)
    {
        var longestSide = Math.Max(originalWidth, originalHeight);
        if (longestSide <= ThumbnailMaxDimensionPixels)
        {
            return (originalWidth, originalHeight);
        }

        var scale = (double)ThumbnailMaxDimensionPixels / longestSide;
        return (
            Math.Max(1, (int)Math.Round(originalWidth * scale)),
            Math.Max(1, (int)Math.Round(originalHeight * scale)));
    }
}