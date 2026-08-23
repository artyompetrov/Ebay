using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain.Measurements;

namespace Server.Application.New;

/// <summary>
/// Сервис сценариев работы с фотографиями замера.
/// </summary>
public sealed class MeasurementPhotoService
{
    private readonly IMeasurementPhotoQueries _measurementPhotoQueries;
    private readonly IMeasurementPhotoRepository _measurementPhotoRepository;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IPhotoThumbnailGenerator _photoThumbnailGenerator;
    private readonly IWriteModelUnitOfWork _writeModelUnitOfWork;

    /// <summary>
    /// Создает сервис сценариев работы с фотографиями замера.
    /// </summary>
    /// <param name="measurementPhotoQueries">Запросы чтения фотографий замера.</param>
    /// <param name="measurementPhotoRepository">Репозиторий агрегата фотографии замера.</param>
    /// <param name="measurementQueries">Запросы чтения замеров.</param>
    /// <param name="photoThumbnailGenerator">Генератор миниатюр фотографий.</param>
    /// <param name="writeModelUnitOfWork">Unit of Work для сохранения write-model.</param>
    public MeasurementPhotoService(
        IMeasurementPhotoQueries measurementPhotoQueries,
        IMeasurementPhotoRepository measurementPhotoRepository,
        IMeasurementQueries measurementQueries,
        IPhotoThumbnailGenerator photoThumbnailGenerator,
        IWriteModelUnitOfWork writeModelUnitOfWork)
    {
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

        await _measurementPhotoRepository.AddAsync(
            MeasurementPhoto.Create(
                id: Guid.NewGuid(),
                measurementId: measurementId,
                fileName: fileName,
                contentType: contentType,
                order: resolvedOrder,
                content: content,
                thumbnailContent: thumbnailContent),
            cancellationToken);

        await _writeModelUnitOfWork.SaveChangesAsync(cancellationToken);

        return true;
    }

    /// <summary>
    /// Возвращает сохраненную миниатюру фотографии замера.
    /// </summary>
    /// <param name="measurementId">Идентификатор замера.</param>
    /// <param name="photoId">Идентификатор фотографии.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Байты миниатюры или <see langword="null"/>, если фотография не найдена.</returns>
    public Task<byte[]?> GetThumbnailContentAsync(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken)
    {
        return _measurementPhotoQueries.GetThumbnail(measurementId, photoId, cancellationToken);
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
        return true;
    }
}