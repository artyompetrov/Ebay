namespace Server.Application.New.Models

open System
open System.Collections.Generic
open System.Text.RegularExpressions
open Server.Domain

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
[<AllowNullLiteral>]
type ProductInfo(
    Id: Guid,
    Name: string,
    SearchQueries: IReadOnlyList<SearchQueryWithId>,
    RuSearchQueries: IReadOnlyList<SearchQueryWithId>,
    Weight: int,
    CalculationResult: ProductCalculationResult,
    LastCheckTime: DateTime
) =
    let recheckTimeInDays = 360 * 2
    let isInterestingRevenueUsd = 12
    let isInterestingRelevantStatistics = 3
    let ebayWeightMultiplier = 1.5

    let simpleReplacements =
        dict [
            "(", "\\("
            ")", "\\)"
            "/", "\\/"
            ".", ","
            ",", "[,.]"
        ]

    let regexReplacements: (Regex * string) array =
        [|
            Regex("[- ]"), "[- ]?"
            Regex("[aа]"), "[aа]"
            Regex("[cс]"), "[cс]"
            Regex("[pр]"), "[pр]"
            Regex("[eе]"), "[eе]"
            Regex("[oо]"), "[oо]"
            Regex("[xх]"), "[xх]"
            Regex("[yу]"), "[yу]"
            Regex("[bв]"), "[bв]"
            Regex("[hн]"), "[hн]"
            Regex("[kк]"), "[kк]"
            Regex("[mм]"), "[mм]"
            Regex("[l]"), "[lл]"
            Regex("[tт]"), "[tт]"
        |]

    let digitReplacements =
        dict [
            "0", "[- ]?[0оo][- ]?"
            "1", "[- ]?1[- ]?"
            "2", "[- ]?2[- ]?"
            "3", "[- ]?[3з][- ]?"
            "4", "[- ]?4[- ]?"
            "5", "[- ]?5[- ]?"
            "6", "[- ]?6[- ]?"
            "7", "[- ]?7[- ]?"
            "8", "[- ]?8[- ]?"
            "9", "[- ]?9[- ]?"
        ]

    /// <summary>
    /// Идентификатор товара.
    /// </summary>
    member _.Id = Id

    /// <summary>
    /// Наименование товара.
    /// </summary>
    member _.Name = Name

    /// <summary>
    /// Поисковые запросы для eBay.
    /// </summary>
    member _.SearchQueries = SearchQueries

    /// <summary>
    /// Поисковые запросы для русскоязычных площадок.
    /// </summary>
    member _.RuSearchQueries = RuSearchQueries

    /// <summary>
    /// Вес товара в условной шкале приоритета.
    /// </summary>
    member _.Weight = Weight

    /// <summary>
    /// Результат расчета цены и статистики продаж.
    /// </summary>
    member _.CalculationResult = CalculationResult

    /// <summary>
    /// Дата и время последней проверки товара.
    /// </summary>
    member _.LastCheckTime = LastCheckTime

    /// <summary>
    /// Признак, что товар пора повторно проверять.
    /// </summary>
    member _.IsCheckRequired =
        DateTime.UtcNow - LastCheckTime > TimeSpan.FromDays(float recheckTimeInDays)

    /// <summary>
    /// Вес товара, скорректированный для eBay-алгоритма.
    /// </summary>
    member _.CalculatedEbayWeight =
        int (Math.Ceiling(float Weight * ebayWeightMultiplier / 100.0))

    /// <summary>
    /// Возвращает признак, что товар интересен для закупки по текущим метрикам.
    /// </summary>
    /// <returns><see langword="true" />, если товар удовлетворяет порогам по выручке и статистике продаж.</returns>
    member _.GetIsInteresting() =
        not (isNull CalculationResult)
        && CalculationResult.RevenueAvg > isInterestingRevenueUsd
        && CalculationResult.QuantityTotal >= isInterestingRelevantStatistics

    /// <summary>
    /// Регулярное выражение для поиска товарных обозначений с учетом вариаций написания.
    /// </summary>
    member _.ProductRegex =
        let productNames = HashSet<string>()

        productNames.Add(Name) |> ignore

        if isNull RuSearchQueries then
            raise (InvalidOperationException($"{nameof RuSearchQueries} is null"))

        for ruSearchQuery in RuSearchQueries do
            productNames.Add(ruSearchQuery.Query) |> ignore

        let processed =
            productNames
            |> Seq.map (fun word ->
                let mutable w = word.ToLowerInvariant().Trim()

                // Simple string replacements
                for KeyValue(kvpKey, kvpValue) in simpleReplacements do
                    w <- w.Replace(kvpKey, kvpValue)

                // Regex replacements
                for pattern, replacement in regexReplacements do
                    w <- pattern.Replace(w, replacement)

                // Digits replacements
                for KeyValue(kvpKey, kvpValue) in digitReplacements do
                    w <- w.Replace(kvpKey, kvpValue)

                w)

        let joined = String.Join("|", processed)

        let pattern =
            $"(?:^|\\b|[\\s\\.,\\(\\)\"\\-_])({joined})(?:$|\\b|[\\s\\-,:;=\\(\\)\\.\"_])"

        Regex(pattern, RegexOptions.IgnoreCase)
