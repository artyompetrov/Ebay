using OneOf;
using OneOf.Types;
using Server.Domain.Errors;

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
    /// <returns>
    /// Идентификатор товара, которому принадлежит лот; <see cref="NotFound"/>, если лот уже удален;
    /// <see cref="DomainError"/>, если цену доставки лота рассчитать нельзя.
    /// </returns>
    Task<OneOf<Guid, NotFound, DomainError>> CalculateAsync(long lotId, CancellationToken cancellationToken);
}
