using OneOf;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Domain.Errors;
using SkiaSharp;

namespace Server.Adapters.Driven.ImageProcessing;

internal sealed class PhotoThumbnailGenerator : IPhotoThumbnailGenerator
{
    private const int ThumbnailMaxDimensionPixels = 400;
    private const int ThumbnailJpegQuality = 75;
    private const int BoundedOriginalMaxDimensionPixels = 2000;
    private const int BoundedOriginalJpegQuality = 85;
    private const int BoundedOriginalMaxBytes = 2 * 1024 * 1024;
    private const double OversizeDimensionScale = 0.8;

    private static readonly DomainError NotAnImageError = new("Photo bytes could not be decoded as an image.");

    public Task<OneOf<byte[], DomainError>> CreateThumbnailAsync(byte[] originalContent, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        using var original = Decode(originalContent);
        if (original is null)
        {
            return Task.FromResult<OneOf<byte[], DomainError>>(NotAnImageError);
        }

        var (targetWidth, targetHeight) = GetBoundedSize(original.Width, original.Height, ThumbnailMaxDimensionPixels);

        return Task.FromResult<OneOf<byte[], DomainError>>(ResizeAndEncode(original, targetWidth, targetHeight, ThumbnailJpegQuality));
    }

    public Task<OneOf<byte[], DomainError>> CreateBoundedOriginalAsync(byte[] originalContent, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        using var original = Decode(originalContent);
        if (original is null)
        {
            return Task.FromResult<OneOf<byte[], DomainError>>(NotAnImageError);
        }

        var longestSide = Math.Max(original.Width, original.Height);
        if (longestSide <= BoundedOriginalMaxDimensionPixels && originalContent.Length <= BoundedOriginalMaxBytes)
        {
            return Task.FromResult<OneOf<byte[], DomainError>>(originalContent);
        }

        var (targetWidth, targetHeight) = GetBoundedSize(original.Width, original.Height, BoundedOriginalMaxDimensionPixels);
        var encoded = ResizeAndEncode(original, targetWidth, targetHeight, BoundedOriginalJpegQuality);
        while (encoded.Length > BoundedOriginalMaxBytes)
        {
            cancellationToken.ThrowIfCancellationRequested();
            targetWidth = Math.Max(1, (int)(targetWidth * OversizeDimensionScale));
            targetHeight = Math.Max(1, (int)(targetHeight * OversizeDimensionScale));
            encoded = ResizeAndEncode(original, targetWidth, targetHeight, BoundedOriginalJpegQuality);
        }
        return Task.FromResult<OneOf<byte[], DomainError>>(encoded);
    }

    private static SKBitmap? Decode(byte[] content)
    {
        using var stream = new SKMemoryStream(content);
        using var codec = SKCodec.Create(stream);
        return codec is null ? null : SKBitmap.Decode(codec);
    }

    private static byte[] ResizeAndEncode(SKBitmap original, int targetWidth, int targetHeight, int jpegQuality)
    {
        using var resized = original.Resize(new SKImageInfo(targetWidth, targetHeight), SKFilterQuality.Medium);

        using var surface = SKSurface.Create(new SKImageInfo(targetWidth, targetHeight, SKColorType.Bgra8888, SKAlphaType.Premul));
        surface.Canvas.Clear(SKColors.White);
        surface.Canvas.DrawBitmap(resized, 0, 0);

        using var snapshot = surface.Snapshot();
        using var encoded = snapshot.Encode(SKEncodedImageFormat.Jpeg, jpegQuality);

        return encoded.ToArray();
    }

    private static (int Width, int Height) GetBoundedSize(int originalWidth, int originalHeight, int maxDimensionPixels)
    {
        var longestSide = Math.Max(originalWidth, originalHeight);
        if (longestSide <= maxDimensionPixels)
        {
            return (originalWidth, originalHeight);
        }

        var scale = (double)maxDimensionPixels / longestSide;
        return (
            Math.Max(1, (int)Math.Round(originalWidth * scale)),
            Math.Max(1, (int)Math.Round(originalHeight * scale)));
    }
}