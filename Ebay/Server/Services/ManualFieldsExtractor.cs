using System.Text.RegularExpressions;
using Ebay.Server.Infrastructure;

namespace Ebay.Server.Services;

internal static class ManualFieldsExtractor
{
    private static readonly string[] NewLines = { "\r\n", "\r", "\n" };

    private static readonly string[] ToRemove =
    {
        "196x year",
        "197x year",
        "198x year",
        "199x year",
        "3x MICA",
        "than 9 pcs"
    };

    private static readonly RegexOptions ro = RegexOptions.IgnoreCase;

    private static readonly ExtractFrom All = ExtractFrom.Title | ExtractFrom.Description |
        ExtractFrom.ConditionDescription;

    private static readonly ExtractFrom TitleAndConditionDescription =
        ExtractFrom.Title | ExtractFrom.ConditionDescription;

    /// <summary>
    /// Перечень экстракторов с приоритетами
    /// </summary>
    private static readonly List<Extractor> Extractors = new()
    {
        new Extractor(new Regex(@"\b(\d{1,2})\s*x?-?\s*match(?:ed)?\s+pair\b", ro), null, 2, All),
        new Extractor(new Regex(@"\b(\d{1,2})\s*x?-?\s*match(?:ed)?\s+quad\b", ro), null, 4, All),
        new Extractor(new Regex(@"\b(\d{1,2})\s*quartets\b", ro), null, 4, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+pair\b", ro), 2, 1, All),
        new Extractor(new Regex(@"\bselected\s+pair\b", ro), 2, 1, All),
        new Extractor(new Regex(@"\bbalanced\s+quad\b", ro), 4, 1, All),
        new Extractor(new Regex(@"\bpair\s+match(?:ed)?\b", ro), 2, 1, All),
        new Extractor(new Regex(@"\bquad\s+match(?:ed)?\b", ro), 4, 1, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+quad\b", ro), 4, 1, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+quartet\b", ro), 4, 1, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+four\b", ro), 4, 1, All),
        new Extractor(new Regex(@"\b(\d+)\s*pc\b", ro), null, 1, All),
        new Extractor(new Regex(@"(?:x|\b)(\d{1,3})\s*pcs\b", ro), null, 1, All),
        new Extractor(new Regex(@"\bpcs\s*(\d{1,3})\b", ro), null, 1, All),
        new Extractor(new Regex(@"(?:^|\s+)(\d{1,3})\s*x\b", ro), null, 1, TitleAndConditionDescription),
        new Extractor(new Regex(@"\blot\s+x\s*(\d{1,3})", ro), null, 1, All),
        new Extractor(new Regex(@"\blot\s*of\s*(\d{1,3})", ro), null, 1, All),
        new Extractor(new Regex(@"\bpack\s*of\s*(\d{1,3})", ro), null, 1, All),
        new Extractor(new Regex(@"\bset\s*of\s*(\d{1,3})", ro), null, 1, All),
        new Extractor(new Regex(@"\bis\s*for\s*(\d{1,3})", ro), null, 1, All),
        new Extractor(new Regex(@"\bqty[ -=(](\d{1,3})", ro), null, 1, All),
        new Extractor(new Regex(@"\blot[-=](\d{1,3})", ro), null, 1, All),
        new Extractor(new Regex(@"\bx(\d{1,3})\s*piece", ro), null, 1, All),
        new Extractor(new Regex(@"^(\d{1,3})\s*(?:\*|x)", ro), null, 1, All),
        new Extractor(new Regex(@"^(\d{1,3})\s*pair", ro), null, 2, All),
        new Extractor(new Regex(@"^[([]?(\d{1,3})[)\]]?\s", ro), null, 1, TitleAndConditionDescription),
        new Extractor(new Regex(@"\bprice\s+is\s+for\s+one\b", ro), 1, 1, All),

        new Extractor(new Regex(@"^one\b", ro), 1, 1, All),
        new Extractor(new Regex(@"^two\b", ro), 2, 1, All),
        new Extractor(new Regex(@"^pair\b", ro), 2, 1, All),
        new Extractor(new Regex(@"^pair\b", ro), 2, 1, All),
        new Extractor(new Regex(@"^four\b", ro), 4, 1, All),
        new Extractor(new Regex(@"\bquad\b", ro), 4, 1, All),
        new Extractor(new Regex(@"\bquartet\b", ro), 4, 1, All)
    };

    public static Dictionary<int, HashSet<ExtractionResult>> ExtractCount(
        string title,
        string? conditionDescription,
        string description
    )
    {
        var result = new Dictionary<int, HashSet<ExtractionResult>>();

        ExtractCountInternal(ExtractFrom.Title, title, result);

        if (conditionDescription != null)
        {
            ExtractCountInternal(
                ExtractFrom.ConditionDescription,
                conditionDescription,
                result
            );
        }

        var htmlText = HtmlUtilities.ConvertToPlainText(description);

        ExtractCountInternal(
            ExtractFrom.Description,
            htmlText,
            result
        );

        return result;
    }

    private static void ExtractCountInternal(
        ExtractFrom extractedFrom,
        string data,
        Dictionary<int, HashSet<ExtractionResult>> result
    )
    {
        var successfulExtractions = new HashSet<string>();

        var splittedArray = data.Split(
            NewLines,
            StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries
        );

        foreach (var dataSplitted in splittedArray.Take(4).Concat(splittedArray.Reverse().Take(4)).Distinct())
        {
            var dataReplaced = dataSplitted;
            foreach (var replace in ToRemove)
            {
                dataReplaced = dataSplitted
                    .Replace(replace, "", StringComparison.OrdinalIgnoreCase);
            }

            dataReplaced = dataReplaced.Trim();

            foreach (var extractor in Extractors)
            {
                if (!extractor.ExtractFrom.HasFlag(extractedFrom)) continue;

                var match = extractor.Regex.Match(dataReplaced);
                if (match.Success)
                {
                    if (CheckIfAlreadyExtractedThatMatch(successfulExtractions, extractor)) continue;

                    if (extractor.Result == null)
                    {
                        if (match.Groups.Count != 2)
                            throw new InvalidOperationException(
                                $"Expected only 2 groups, {extractor.Regex} {dataReplaced}"
                            );

                        result.AppendOrCreateNewCollection(
                            int.Parse(match.Groups[1].ToString()) * extractor.Multiplier,
                            new ExtractionResult(
                                extractedFrom,
                                extractor.Regex.ToString(),
                                match.ToString()
                            )
                        );

                        successfulExtractions.Add(match.ToString());
                    }
                    else
                    {
                        if (match.Groups.Count != 1)
                            throw new InvalidOperationException(
                                $"Expected only 1 groups, {extractor.Regex} {dataReplaced}"
                            );

                        result.AppendOrCreateNewCollection(
                            extractor.Result.Value * extractor.Multiplier,
                            new ExtractionResult(
                                extractedFrom,
                                extractor.Regex.ToString(),
                                match.ToString()
                            )
                        );
                        successfulExtractions.Add(match.ToString());
                    }
                }
            }
        }
    }

    private static bool CheckIfAlreadyExtractedThatMatch(HashSet<string> successfulExtractions, Extractor extractor)
    {
        var alreadyExtractedThatMatch = false;
        foreach (var successfulExtraction in successfulExtractions)
        {
            if (extractor.Regex.Match(successfulExtraction).Success)
            {
                alreadyExtractedThatMatch = true;
                break;
            }
        }

        return alreadyExtractedThatMatch;
    }

    private record struct Extractor(Regex Regex, int? Result, int Multiplier, ExtractFrom ExtractFrom);

    public record struct ExtractionResult(ExtractFrom ExtractedFrom, string Extractor, string Match)
    {
        public override string ToString()
        {
            return
                $"{nameof(ExtractedFrom)}: '{ExtractedFrom}', {nameof(Extractor)}: '{Extractor}', {nameof(Match)}: '{Match}'";
        }
    };

    [Flags]
    public enum ExtractFrom
    {
        Title = 1,
        ConditionDescription = 2,
        Description = 4
    }
}