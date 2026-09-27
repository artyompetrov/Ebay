namespace Server.Application.Abstractions.Driving.Abstractions.Services;

/// <summary>
/// Выполняет расчет цен и выручки для лота и его покупок.
/// </summary>
public interface ILotPriceCalculator
{
    /// <summary>
    /// Рассчитывает и сохраняет результаты расчета для лота и его покупок.
    /// </summary>
    /// <param name="lotId">Идентификатор лота.</param>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Идентификатор товара, которому принадлежит лот.</returns>
    Task<Guid> CalculateAsync(long lotId, CancellationToken cancellationToken);
}
