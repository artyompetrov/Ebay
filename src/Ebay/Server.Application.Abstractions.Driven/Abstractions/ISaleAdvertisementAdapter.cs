using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт источника объявлений о продаже на одном внешнем маркетплейсе. Каждый маркетплейс реализует его в своём адаптере.
/// </summary>
public interface ISaleAdvertisementAdapter
{
    /// <summary>
    /// Имя маркетплейса, под которым хранится история дедупликации его объявлений.
    /// </summary>
    string Marketplace { get; }

    /// <summary>
    /// Возвращает свежие объявления о продаже с маркетплейса; <see cref="Error{T}"/> с описанием, если маркетплейс не дал
    /// пригодного ответа (например, страница без ожидаемой разметки), чтобы сбор считался неудачным, а не пустым.
    /// </summary>
    Task<OneOf<IReadOnlyCollection<SaleAdvertisement>, Error<string>>> GetRecentAdvertisementsAsync(CancellationToken cancellationToken);

    /// <summary>
    /// Пытается получить контакт продавца объявления; вызывается только для объявлений, совпавших с товарами.
    /// </summary>
    Task<string?> TryGetContactAsync(SaleAdvertisement saleAdvertisement, CancellationToken cancellationToken);
}
