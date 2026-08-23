namespace Server.Application.Abstractions.Driven.Abstractions;

public interface IPhotoThumbnailGenerator
{
    /// <summary>
    /// Creates a size-capped JPEG thumbnail from the original photo bytes.
    /// Throws if <paramref name="originalContent"/> cannot be decoded as an image.
    /// </summary>
    Task<byte[]> CreateThumbnailAsync(byte[] originalContent, CancellationToken cancellationToken);
}