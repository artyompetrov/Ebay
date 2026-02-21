using Server.Domain;
using Server.Domain.Product;

namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Информация о товаре и связанных с ним параметрах для расчетов и поиска.
/// </summary>
/// <param name="Id">Идентификатор товара.</param>
/// <param name="Name">Наименование товара.</param>
/// <param name="SearchQueries">Поисковые запросы для eBay.</param>
/// <param name="RuSearchQueries">Поисковые запросы для русскоязычных площадок.</param>
/// <param name="Weight">Вес товара в условной шкале приоритета.</param>
/// <param name="CalculationResult">Результат расчета цены и статистики продаж.</param>
/// <param name="LastCheckTime">Дата и время последней проверки товара.</param>
public record ProductInfo(
    Guid Id,
    string Name,
    IReadOnlyList<SearchQueryWithId> SearchQueries,
    IReadOnlyList<SearchQueryWithId> RuSearchQueries,
    int Weight,
    ProductCalculationResult? CalculationResult,
    DateTime LastCheckTime
);