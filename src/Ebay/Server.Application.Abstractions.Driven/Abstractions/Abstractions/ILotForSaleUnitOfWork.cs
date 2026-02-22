namespace Server.Application.Abstractions.Driven.Abstractions.Abstractions;

/// <summary>
/// Unit of Work для агрегата лота для продажи.
/// </summary>
public interface ILotForSaleUnitOfWork
{
    /// <summary>
    /// Сохраняет изменения по агрегатам лотов для продажи.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
