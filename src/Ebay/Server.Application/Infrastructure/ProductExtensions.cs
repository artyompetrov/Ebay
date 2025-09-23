
using System.Text.RegularExpressions;
using Server.Domain;

namespace Server.Application.Infrastructure;

public static class ProductExtensions
{
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
        (new Regex("[tт]"), "[tт]")
    ];

    private static readonly Dictionary<string, string> DigitReplacements = new Dictionary<string, string>
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

    public static Regex GetProductRegex(this Product product)
    {
        var productNames = new HashSet<string>();

        productNames.Add(product.Name);

        if (product.RuSearchQueries == null)
            throw new NullReferenceException($"{nameof(product.RuSearchQueries)} is null");

        foreach (var ruSearchQuery in product.RuSearchQueries)
        {
            productNames.Add(ruSearchQuery.Query);
        }

        var processed = productNames.Select(word =>
        {
            var w = word.ToLower().Trim();

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

    public static bool GetIsInteresting(this Product product) =>
        product.ProductCalculationResult?.RevenueAvg > WellKnown.IsInteresting.RevenueUsd &&
        product.ProductCalculationResult?.QuantityTotal >= WellKnown.IsInteresting.RelevantStatistics;

    /// <summary>
    /// Вес в относительных единицах для расчета стоимости доставки на ebay
    /// </summary>
    public static int GetCalculatedEbayWeight(this Product product) =>
        (int)Math.Ceiling(product.Weight * WellKnown.Ebay.множительДляУчетаВесаУпаковки / 100.0);
}