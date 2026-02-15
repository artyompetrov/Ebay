using System.Text.RegularExpressions;
using Server.Domain;

namespace Server.Application.New.Models;

// TODO(architecture): Этот тип уже не "просто модель":
// 1) Здесь зашиты бизнес-правила: RecheckTimeInDays, IsInterestingRevenueUsd, IsInterestingRelevantStatistics, EbayWeightMultiplier.
// 2) Здесь есть поведение: IsCheckRequired, CalculatedEbayWeight, GetIsInteresting().
// 3) Здесь есть техническая логика матчинга текста: ProductRegex + набор Regex/replace-правил.
// Нужно разрезать по смыслу: оставить в модели только данные, правила вынести в policy/бизнес-сервис,
// а regex-логику вынести в отдельный matcher/search-компонент.
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
)
{
    private const int RecheckTimeInDays = 360 * 2;

    /// <summary>
    /// Сумма выручки за штуку от которой интересно работать с товаром
    /// </summary>
    private const int IsInterestingRevenueUsd = 12;

    /// <summary>
    /// Количество штук на ebay продано минимум, для репрезентативности
    /// </summary>
    private const int IsInterestingRelevantStatistics = 3;
    private const double EbayWeightMultiplier = 1.5;

    /// <summary>
    /// Признак, что товар пора повторно проверять.
    /// </summary>
    public bool IsCheckRequired => DateTime.UtcNow - LastCheckTime > TimeSpan.FromDays(RecheckTimeInDays);

    /// <summary>
    /// Вес товара, скорректированный для eBay-алгоритма.
    /// </summary>
    public int CalculatedEbayWeight =>
        (int)Math.Ceiling(Weight * EbayWeightMultiplier / 100.0);


    /// <summary>
    /// Возвращает признак, что товар интересен для закупки по текущим метрикам.
    /// </summary>
    /// <returns><see langword="true" />, если товар удовлетворяет порогам по выручке и статистике продаж.</returns>
    public bool GetIsInteresting()
    {
        return CalculationResult?.RevenueAvg > IsInterestingRevenueUsd &&
        CalculationResult?.QuantityTotal >= IsInterestingRelevantStatistics;
    }

    private static readonly Dictionary<string, string> SimpleReplacements = new()
    {
        { "(", "\\(" },
        { ")", "\\)" },
        { "/", "\\/" },
        { ".", "," },
        { ",", "[,.]" },
    };

    private static readonly (Regex Pattern, string Replacement)[] RegexReplacements =
    [
        (new Regex("[- ]"), "[- ]?"),
        (new Regex("[aа]"), "[aа]"),
        (new Regex("[cс]"), "[cс]"),
        (new Regex("[pр]"), "[pр]"),
        (new Regex("[eе]"), "[eе]"),
        (new Regex("[oо]"), "[oо]"),
        (new Regex("[xх]"), "[xх]"),
        (new Regex("[yу]"), "[yу]"),
        (new Regex("[bв]"), "[bв]"),
        (new Regex("[hн]"), "[hн]"),
        (new Regex("[kк]"), "[kк]"),
        (new Regex("[mм]"), "[mм]"),
        (new Regex("[l]"), "[lл]"),
        (new Regex("[tт]"), "[tт]")
    ];

    private static readonly Dictionary<string, string> DigitReplacements = new()
    {
        { "0", "[- ]?[0оo][- ]?" },
        { "1", "[- ]?1[- ]?" },
        { "2", "[- ]?2[- ]?" },
        { "3", "[- ]?[3з][- ]?" },
        { "4", "[- ]?4[- ]?" },
        { "5", "[- ]?5[- ]?" },
        { "6", "[- ]?6[- ]?" },
        { "7", "[- ]?7[- ]?" },
        { "8", "[- ]?8[- ]?" },
        { "9", "[- ]?9[- ]?" }
    };

    /// <summary>
    /// Регулярное выражение для поиска товарных обозначений с учетом вариаций написания.
    /// </summary>
    public Regex ProductRegex
    {
        get
        {
            var productNames = new HashSet<string>();

            _ = productNames.Add(Name);

            if (RuSearchQueries == null)
            {
                throw new InvalidOperationException($"{nameof(RuSearchQueries)} is null");
            }

            foreach (var ruSearchQuery in RuSearchQueries)
            {
                _ = productNames.Add(ruSearchQuery.Query);
            }

            var processed = productNames.Select(word =>
            {
                var w = word.ToLowerInvariant().Trim();

                // Simple string replacements
                foreach (var kvp in SimpleReplacements)
                {
                    w = w.Replace(kvp.Key, kvp.Value);
                }

                // Regex replacements
                foreach (var (pattern, replacement) in RegexReplacements)
                {
                    w = pattern.Replace(w, replacement);
                }

                // Digits replacements
                foreach (var kvp in DigitReplacements)
                {
                    w = w.Replace(kvp.Key, kvp.Value);
                }

                return w;
            });

            var pattern =
                $"(?:^|\\b|[\\s\\.,\\(\\)\"\\-_])({string.Join("|", processed)})(?:$|\\b|[\\s\\-,:;=\\(\\)\\.\"_])";

            return new Regex(pattern, RegexOptions.IgnoreCase);
        }
    }
}
