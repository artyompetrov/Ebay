using System.Text.RegularExpressions;
using Server.Domain;

namespace Server.Application.Abstractions.Queries;

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
    public bool IsCheckRequired => DateTime.UtcNow - LastCheckTime > TimeSpan.FromDays(WellKnown.RecheckTimeInDays);

    public int CalculatedEbayWeight =>
        (int)Math.Ceiling(Weight * WellKnown.Ebay.множительДляУчетаВесаУпаковки / 100.0);


    public bool GetIsInteresting()
    {
        return CalculationResult?.RevenueAvg > WellKnown.IsInteresting.RevenueUsd &&
        CalculationResult?.QuantityTotal >= WellKnown.IsInteresting.RelevantStatistics;
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
