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
///
/// Обрабатывает фото ограниченными батчами в отдельных scope на батч: сначала решение "нужно ли
/// сжимать" принимается по read-model (без записи в EF change tracker write-model), и только для
/// фото, которые действительно нужно сжать, агрегат материализуется через write-репозиторий и
/// сохраняется - так на весь прогон не накапливаются в памяти байты всех фотографий сразу.
/// </summary>
[Obsolete(
    "Одноразовый backfill для фото, загруженных до появления ограничения по размеру оригинала. " +
    "Удалить этот hosted service, его регистрацию в DI и связанные с ним тесты, как только он " +
    "успешно отработает на production и не останется фото с оригиналом больше ограничения.")]
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

        var totalScanned = 0;
        var totalCompressed = 0;
        var skip = 0;

        while (true)
        {
            var (scannedInBatch, compressedInBatch) = await ProcessBatchAsync(skip, cancellationToken);
            if (scannedInBatch == 0)
            {
                break;
            }

            totalScanned += scannedInBatch;
            totalCompressed += compressedInBatch;
            skip += scannedInBatch;
        }

        _logger.LogInformation(
            "Measurement photo original-size backfill finished: compressed {CompressedCount} of {TotalCount} photos",
            totalCompressed,
            totalScanned);
    }

    private async Task<(int Scanned, int Compressed)> ProcessBatchAsync(int skip, CancellationToken cancellationToken)
    {
        using var scope = _serviceScopeFactory.CreateScope();
        var measurementPhotoQueries = scope.ServiceProvider.GetRequiredService<IMeasurementPhotoQueries>();

        var batch = await measurementPhotoQueries.GetContentBatch(skip, WellKnown.PhotoBackfill.BatchSize, cancellationToken);
        if (batch.Count == 0)
        {
            return (0, 0);
        }

        var photoThumbnailGenerator = scope.ServiceProvider.GetRequiredService<IPhotoThumbnailGenerator>();
        var measurementPhotoRepository = scope.ServiceProvider.GetRequiredService<IMeasurementPhotoRepository>();
        var writeModelUnitOfWork = scope.ServiceProvider.GetRequiredService<IWriteModelUnitOfWork>();

        var compressedCount = 0;
        foreach (var photo in batch)
        {
            var boundedContent = await photoThumbnailGenerator.CreateBoundedOriginalAsync(photo.Content, cancellationToken);
            if (ReferenceEquals(boundedContent, photo.Content))
            {
                continue;
            }

            var aggregate = await measurementPhotoRepository.GetByIdAsync(photo.Id, cancellationToken);
            if (aggregate == null)
            {
                continue;
            }

            aggregate.CompressOriginalContent(boundedContent);
            compressedCount++;
        }

        if (compressedCount > 0)
        {
            await writeModelUnitOfWork.SaveChangesAsync(cancellationToken);
        }

        return (batch.Count, compressedCount);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}