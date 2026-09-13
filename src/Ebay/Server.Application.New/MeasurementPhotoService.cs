using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.New.Caching;
using Server.Domain.Measurements;

namespace Server.Application.New;

/// <summary>
/// Сервис сценариев работы с фотографиями замера.
/// </summary>
public sealed class MeasurementPhotoService
{
    private const string ThumbnailContentType = "image/jpeg";
    private const string HiddenPhotoPlaceholderContentType = "image/png";

    /// <summary>
    /// Прозрачный PNG размером 1x1, отдаваемый вместо реального фото/миниатюры,
    /// когда замер уже продан и не должен быть публично виден на странице лота eBay.
    /// </summary>
    private static readonly byte[] HiddenPhotoPlaceholderContent = Convert.FromBase64String(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=");

    private readonly IMemoryCache _cache;
    private readonly MeasurementCacheInvalidationRegistry _cacheInvalidationRegistry;
    private readonly IMeasurementPhotoQueries _measurementPhotoQueries;
    private readonly IMeasurementPhotoRepository _measurementPhotoRepository;
    private readonly IMeasurementInfoQueries _measurementQueries;
    private readonly IPhotoThumbnailGenerator _photoThumbnailGenerator;
    private readonly IWriteModelUnitOfWork _writeModelUnitOfWork;

    /// <summary>
    /// Создает сервис сценариев работы с фотографиями замера.
    /// </summary>
    /// <param name="cache">Выделенный in-memory кеш для байтов фото/миниатюр непроданных замеров.</param>
    /// <param name="cacheInvalidationRegistry">Реестр токенов протухания кеша по измерению.</param>
    /// <param name="measurementPhotoQueries">Запросы чтения фотографий замера.</param>
    /// <param name="measurementPhotoRepository">Репозиторий агрегата фотографии замера.</param>
    /// <param name="measurementQueries">Запросы чтения карточки замера.</param>
    /// <param name="photoThumbnailGenerator">Генератор миниатюр фотографий.</param>
    /// <param name="writeModelUnitOfWork">Unit of Work для сохранения write-model.</param>
    public MeasurementPhotoService(
        [FromKeyedServices(WellKnown.ImageCache.ServiceKey)] IMemoryCache cache,
        MeasurementCacheInvalidationRegistry cacheInvalidationRegistry,
        IMeasurementPhotoQueries measurementPhotoQueries,
        IMeasurementPhotoRepository measurementPhotoRepository,
        IMeasurementInfoQueries measurementQueries,
        IPhotoThumbnailGenerator photoThumbnailGenerator,
        IWriteModelUnitOfWork writeModelUnitOfWork)
    {
        _cache = cache;
        _cacheInvalidationRegistry = cacheInvalidationRegistry;
        _measurementPhotoQueries = measurementPhotoQueries;
        _measurementPhotoRepository = measurementPhotoRepository;
        _measurementQueries = measurementQueries;
        _photoThumbnailGenerator = photoThumbnailGenerator;
        _writeModelUnitOfWork = writeModelUnitOfWork;
    }

    /// <summary>
    /// Загружает фотографию для замера.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="fileName">Имя файла.</param>
    /// <param name="contentType">MIME-тип файла.</param>
    /// <param name="content">Содержимое файла.</param>
    /// <param name="order">Порядковый номер в списке фотографий.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns><see langword="true"/>, если замер существует и фото сохранено; иначе <see langword="false"/>.</returns>
    public async Task<bool> UploadAsync(
        string measurementId,
        string fileName,
        string contentType,
        byte[] content,
        int? order,
        CancellationToken cancellationToken)
    {
        var measurement = await _measurementQueries.GetMeasurementInfo(measurementId, cancellationToken);
        if (measurement == null)
        {
            return false;
        }

        var resolvedOrder = order ?? await _measurementPhotoQueries.GetNextOrder(measurementId, cancellationToken);
        var thumbnailContent = await _photoThumbnailGenerator.CreateThumbnailAsync(content, cancellationToken);
        var boundedContent = await _photoThumbnailGenerator.CreateBoundedOriginalAsync(content, cancellationToken);

        await _measurementPhotoRepository.AddAsync(
            MeasurementPhoto.Create(
                id: Guid.NewGuid(),
                measurementId: measurementId,
                fileName: fileName,
                contentType: ReferenceEquals(boundedContent, content) ? contentType : ThumbnailContentType,
                order: resolvedOrder,
                content: boundedContent,
                thumbnailContent: thumbnailContent),
            cancellationToken);

        await _writeModelUnitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }

    /// <summary>
    /// Возвращает полное содержимое фотографии замера. Если замер уже продан,
    /// возвращает публичную заглушку вместо реального фото.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="photoId">Идентификатор фотографии.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Содержимое фотографии (реальное или заглушка) либо <see langword="null"/>, если замер или фотография не найдены.</returns>
    public async Task<MeasurementPhotoContent?> GetContentAsync(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken)
    {
        return await _cache.GetOrCreateAsync(
            key: ContentCacheKey(measurementId, photoId),
            factory: async () =>
            {
                var measurement = await _measurementQueries.GetMeasurementInfo(measurementId, cancellationToken);
                if (measurement == null)
                {
                    return null;
                }

                if (measurement.MeasurementState.IsHiddenFromPublicListing())
                {
                    var metadata = await _measurementPhotoQueries.GetMetadataByMeasurementIds([measurementId], cancellationToken);
                    return metadata.Any(photo => photo.Id == photoId)
                        ? new MeasurementPhotoContent(HiddenPhotoPlaceholderContent, HiddenPhotoPlaceholderContentType)
                        : null;
                }

                var photo = await _measurementPhotoQueries.Get(measurementId, photoId, cancellationToken);
                return photo == null ? null : new MeasurementPhotoContent(photo.Content, photo.ContentType);
            },
            sizeSelector: static x => x.Content.LongLength,
            invalidationTokenFactory: () => _cacheInvalidationRegistry.AcquireToken(measurementId));
    }

    /// <summary>
    /// Возвращает сохраненную миниатюру фотографии замера. Если замер уже продан,
    /// возвращает публичную заглушку вместо реальной миниатюры.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="photoId">Идентификатор фотографии.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Содержимое миниатюры (реальное или заглушка) либо <see langword="null"/>, если замер или фотография не найдены.</returns>
    public async Task<MeasurementPhotoContent?> GetThumbnailContentAsync(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken)
    {
        return await _cache.GetOrCreateAsync(
            key: ThumbnailCacheKey(measurementId, photoId),
            factory: async () =>
            {
                var measurement = await _measurementQueries.GetMeasurementInfo(measurementId, cancellationToken);
                if (measurement == null)
                {
                    return null;
                }

                if (measurement.MeasurementState.IsHiddenFromPublicListing())
                {
                    var metadata = await _measurementPhotoQueries.GetMetadataByMeasurementIds([measurementId], cancellationToken);
                    return metadata.Any(photo => photo.Id == photoId)
                        ? new MeasurementPhotoContent(HiddenPhotoPlaceholderContent, HiddenPhotoPlaceholderContentType)
                        : null;
                }

                var thumbnail = await _measurementPhotoQueries.GetThumbnail(measurementId, photoId, cancellationToken);
                return thumbnail == null ? null : new MeasurementPhotoContent(thumbnail, ThumbnailContentType);
            },
            sizeSelector: static x => x.Content.LongLength,
            invalidationTokenFactory: () => _cacheInvalidationRegistry.AcquireToken(measurementId));
    }

    /// <summary>
    /// Удаляет фотографию замера и сдвигает порядок последующих фотографий.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="photoId">Идентификатор фотографии.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns><see langword="true"/>, если фото найдено и удалено; иначе <see langword="false"/>.</returns>
    public async Task<bool> DeleteAsync(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken)
    {
        var photo = await _measurementPhotoQueries.Get(measurementId, photoId, cancellationToken);
        if (photo == null)
        {
            return false;
        }

        var photos = await _measurementPhotoQueries.GetByMeasurementId(measurementId, cancellationToken);
        var idsToShift = photos
            .Where(x => x.Order > photo.Order)
            .Select(x => x.Id)
            .ToList();

        foreach (var id in idsToShift)
        {
            var aggregate = await _measurementPhotoRepository.GetByIdAsync(id, cancellationToken);
            aggregate?.ShiftOrderDown();
        }

        await _measurementPhotoRepository.RemoveAsync(photoId, cancellationToken);
        await _writeModelUnitOfWork.SaveChangesAsync(cancellationToken);

        _cache.Remove(ContentCacheKey(measurementId, photoId));
        _cache.Remove(ThumbnailCacheKey(measurementId, photoId));

        return true;
    }

    private static string ContentCacheKey(string measurementId, Guid photoId) => $"measurement-photo-content:{measurementId}:{photoId}";

    private static string ThumbnailCacheKey(string measurementId, Guid photoId) => $"measurement-photo-thumbnail:{measurementId}:{photoId}";
}
