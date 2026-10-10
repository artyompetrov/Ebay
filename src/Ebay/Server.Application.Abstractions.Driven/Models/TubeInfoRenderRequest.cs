using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Данные для отрисовки карточки лампы на странице лота eBay.
/// </summary>
/// <param name="ManufactureCode">Код/дата производства.</param>
/// <param name="ProductState">Состояние лампы.</param>
/// <param name="DoubleTriodeSectionRmse">Наибольшее расхождение секций двойного триода (с учётом пары), %; <see langword="null" />, если не применимо.</param>
public sealed record TubeInfoRenderRequest(
    string ManufactureCode,
    ProductState ProductState,
    double? DoubleTriodeSectionRmse);
