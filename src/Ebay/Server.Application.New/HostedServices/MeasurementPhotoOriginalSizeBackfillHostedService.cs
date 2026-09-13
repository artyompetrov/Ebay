using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;

namespace Server.Application.New.HostedServices;

/// <summary>
/// При старте приложения приводит уже сохранённые "оригиналы" фотографий замеров к ограничению
/// по размеру, введённому вместе с этим сервисом (фото, загруженные раньше, могли быть сохранены
/// без ограничения). Повторные запуски дёшевы: фото, уже укладывающиеся в ограничение, не изменяются.
/// </summary>
public sealed class MeasurementPhotoOriginalSizeBackfillHostedService : IHostedService
{
    private readonly ILogger<MeasurementPhotoOriginalSizeBackfillHostedService> _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public MeasurementPhotoOriginalSizeBackfillHostedService(
        ILogger<MeasurementPhotoOriginalSizeBackfillHostedService> logger,
        IServiceScopeFactory serviceScopeFactory)
    {
        _logger = logger;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Measurement photo original-size backfill started");

        using var scope = _serviceScopeFactory.CreateScope();
        var measurementPhotoQueries = scope.ServiceProvider.GetRequiredService<IMeasurementPhotoQueries>();
        var measurementPhotoRepository = scope.ServiceProvider.GetRequiredService<IMeasurementPhotoRepository>();
        var photoThumbnailGenerator = scope.ServiceProvider.GetRequiredService<IPhotoThumbnailGenerator>();
        var writeModelUnitOfWork = scope.ServiceProvider.GetRequiredService<IWriteModelUnitOfWork>();

        var photoIds = await measurementPhotoQueries.GetAllPhotoIds(cancellationToken);
        var compressedCount = 0;

        foreach (var photoId in photoIds)
        {
            var photo = await measurementPhotoRepository.GetByIdAsync(photoId, cancellationToken);
            if (photo == null)
            {
                continue;
            }

            var boundedContent = await photoThumbnailGenerator.CreateBoundedOriginalAsync(photo.Content, cancellationToken);
            if (ReferenceEquals(boundedContent, photo.Content))
            {
                continue;
            }

            photo.CompressOriginalContent(boundedContent);
            compressedCount++;
        }

        if (compressedCount > 0)
        {
            await writeModelUnitOfWork.SaveChangesAsync(cancellationToken);
        }

        _logger.LogInformation(
            "Measurement photo original-size backfill finished: compressed {CompressedCount} of {TotalCount} photos",
            compressedCount,
            photoIds.Count);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
