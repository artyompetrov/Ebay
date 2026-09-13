namespace Server.Application.Abstractions.Driven.Abstractions;

public interface IPhotoThumbnailGenerator
{
    /// <summary>
    /// Creates a size-capped JPEG thumbnail from the original photo bytes.
    /// Throws if <paramref name="originalContent"/> cannot be decoded as an image.
    /// </summary>
    Task<byte[]> CreateThumbnailAsync(byte[] originalContent, CancellationToken cancellationToken);

    /// <summary>
    /// Returns the photo bytes re-encoded within a bounded resolution/quality when they exceed
    /// that bound, or the original bytes unchanged when they are already within it.
    /// Throws if <paramref name="originalContent"/> cannot be decoded as an image.
    /// </summary>
    Task<byte[]> CreateBoundedOriginalAsync(byte[] originalContent, CancellationToken cancellationToken);
}