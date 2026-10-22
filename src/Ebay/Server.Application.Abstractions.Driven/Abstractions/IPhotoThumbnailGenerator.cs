using OneOf;
using Server.Domain.Errors;

namespace Server.Application.Abstractions.Driven.Abstractions;

public interface IPhotoThumbnailGenerator
{
    /// <summary>
    /// Creates a size-capped JPEG thumbnail from the original photo bytes;
    /// <see cref="DomainError"/> if <paramref name="originalContent"/> cannot be decoded as an image.
    /// </summary>
    Task<OneOf<byte[], DomainError>> CreateThumbnailAsync(byte[] originalContent, CancellationToken cancellationToken);

    /// <summary>
    /// Returns the photo bytes re-encoded within a bounded resolution/quality when they exceed
    /// that bound (JPEG), or the same original byte-array instance when already within it;
    /// <see cref="DomainError"/> if <paramref name="originalContent"/> cannot be decoded as an image.
    /// </summary>
    Task<OneOf<byte[], DomainError>> CreateBoundedOriginalAsync(byte[] originalContent, CancellationToken cancellationToken);
}
