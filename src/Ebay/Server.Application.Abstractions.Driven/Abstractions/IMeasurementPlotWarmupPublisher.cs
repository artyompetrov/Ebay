namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт публикации команд прогрева кеша eBay-графиков замера. Публикует сообщение и не сохраняет изменения сам -
/// вызывающий код коммитит всё в рамках своего собственного <see cref="IWriteModelUnitOfWork.SaveChangesAsync"/>.
/// </summary>
public interface IMeasurementPlotWarmupPublisher
{
    /// <summary>
    /// Публикует команду прогрева кеша eBay-графиков и описания лампы для замера.
    /// </summary>
    Task PublishAsync(IWriteModelUnitOfWork unitOfWork, string measurementId, CancellationToken cancellationToken);
}
