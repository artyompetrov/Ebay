using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.ImageProcessing;

public static class ServiceCollectionExtensions
{
    public static void AddImageProcessingAdapter(
        this IServiceCollection services) => _ = services.AddTransient<IPhotoThumbnailGenerator, PhotoThumbnailGenerator>();
}
