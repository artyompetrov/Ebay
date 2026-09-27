namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт публикации триггеров пересчёта цен. Публикует сообщение и не сохраняет изменения сам -
/// вызывающий код коммитит всё в рамках своего собственного <see cref="IWriteModelUnitOfWork.SaveChangesAsync"/>.
/// </summary>
public interface IPriceRecalculationPublisher
{
    /// <summary>
    /// Публикует запрос на пересчет цен и выручки для лота.
    /// </summary>
    Task PublishForLotAsync(long lotId, CancellationToken cancellationToken);

    /// <summary>
    /// Публикует запрос на пересчет цен всех лотов товара.
    /// </summary>
    Task PublishForProductAsync(Guid productId, CancellationToken cancellationToken);

    /// <summary>
    /// Публикует запрос на пересчет цен всех товаров.
    /// </summary>
    Task PublishForAllAsync(CancellationToken cancellationToken);
}
