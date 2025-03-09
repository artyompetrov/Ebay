using System.Text.RegularExpressions;
using Server.Controllers.Generated;
using Server.Infrastructure;

namespace Server.Services;

internal class PcsExtractor : ExtractorBase, IExtractor
{
    public string ExtractedDataName => "pcs";

    private static readonly string[] ToRemove =
    [
        "196x year",
        "197x year",
        "198x year",
        "199x year",
        "3x MICA",
        "than 9 pcs"
    ];

    /// <summary>
    /// Перечень экстракторов с приоритетами
    /// </summary>
    private static readonly List<Extractor> Extractors = new()
    {
        new Extractor(Regex: new Regex(pattern: @"\b(\d{1,2})\s*x?-?\s*match(?:ed)?\s+pair\b", options: Ro), Result: null, Multiplier: 2, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\b(\d{1,2})\s*x?-?\s*match(?:ed)?\s+quad\b", options: Ro), Result: null, Multiplier: 4, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\b(\d{1,2})\s*quartets\b", options: Ro), Result: null, Multiplier: 4, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bmatch(?:ed)?\s+pair\b", options: Ro), Result: 2, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bselected\s+pair\b", options: Ro), Result: 2, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bbalanced\s+quad\b", options: Ro), Result: 4, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bpair\s+match(?:ed)?\b", options: Ro), Result: 2, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bquad\s+match(?:ed)?\b", options: Ro), Result: 4, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bmatch(?:ed)?\s+quad\b", options: Ro), Result: 4, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bmatch(?:ed)?\s+quartet\b", options: Ro), Result: 4, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\btwo\s+match(?:ed)?\s+octets\b", options: Ro), Result: 16, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bmatch(?:ed)?\s+octet\b", options: Ro), Result: 8, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bmatch(?:ed)?\s+four\b", options: Ro), Result: 4, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\b(\d+)\s*pc\b", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\b(\d+)\s*units\b", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"(?:x|\b)(\d{1,3})\s*pcs\b", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bpcs\s*(\d{1,3})\b", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"(?:^|\s+)(\d{1,3})\s*x\b", options: Ro), Result: null, Multiplier: 1, ExtractFrom: TitleAndShortAndConditionDescription),
        new Extractor(Regex: new Regex(pattern: @"\blot\s+x\s*(\d{1,3})", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\blot\s*of\s*(\d{1,3})", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bpack\s*of\s*(\d{1,3})", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bset\s*of\s*(\d{1,3})", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bis\s*for\s*(\d{1,3})", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bqty[ -=(](\d{1,3})", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\blot[-=](\d{1,3})", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bx(\d{1,3})\s*piece", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"^(\d{1,3})\s*(?:\*|x)", options: Ro), Result: null, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\b(\d{1,3})\s*pair", options: Ro), Result: null, Multiplier: 2, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"^[([]?(\d{1,3})[)\]]?\s", options: Ro), Result: null, Multiplier: 1, ExtractFrom: TitleAndConditionDescription),
        new Extractor(Regex: new Regex(pattern: @"\bprice\s+is\s+for\s+one\s+pair\b", options: Ro), Result: 2, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bprice\s+is\s+for\s+one\b", options: Ro), Result: 1, Multiplier: 1, ExtractFrom: All),

        new Extractor(Regex: new Regex(pattern: @"^one\s+pair\b", options: Ro), Result: 2, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"^one\b", options: Ro), Result: 1, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"^two\b", options: Ro), Result: 2, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"^pair\b", options: Ro), Result: 2, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"^pair\b", options: Ro), Result: 2, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"^four\b", options: Ro), Result: 4, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bquad\b", options: Ro), Result: 4, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bquartet\b", options: Ro), Result: 4, Multiplier: 1, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\boctet\b", options: Ro), Result: 8, Multiplier: 1, ExtractFrom: All)
    };

    public Dictionary<string, HashSet<ExtractionResult>> Extract(LotDataToExtract lotDataToExtract)
    {
        var titleSplitted = Split(lotDataToExtract.Name);
        var conditionDescriptionSplitted = lotDataToExtract.ConditionDescription != null ? Split(lotDataToExtract.ConditionDescription) : null;
        var descriptionTextSplitted = Split(lotDataToExtract.DescriptionText);
        var shortDescriptionTextSplitted = lotDataToExtract.ShortDescription != null ? Split(lotDataToExtract.ShortDescription) : null;

        var extractionResult = new Dictionary<string, HashSet<ExtractionResult>>();

        if (lotDataToExtract.LotSize != null)
        {
            extractionResult.AppendOrCreateNewCollection(
                key: lotDataToExtract.LotSize.ToString()!,
                value: new ExtractionResult(ExtractedFrom: ExtractFrom.LotSize, Extractor: "lotSize", Match: lotDataToExtract.LotSize.ToString()!)
            );
        }

        Extract(splittedArray: titleSplitted, extractedFrom: ExtractFrom.Title, result: extractionResult);

        if (conditionDescriptionSplitted != null)
        {
            Extract(
                splittedArray: conditionDescriptionSplitted,
                extractedFrom: ExtractFrom.ConditionDescription,
                result: extractionResult
            );
        }

        Extract(
            splittedArray: descriptionTextSplitted,
            extractedFrom: ExtractFrom.Description,
            result: extractionResult
        );

        if (shortDescriptionTextSplitted != null)
        {
            Extract(
                splittedArray: shortDescriptionTextSplitted,
                extractedFrom: ExtractFrom.ShortDescription,
                result: extractionResult
            );
        }

        return extractionResult;
    }

    private static void Extract(string[] splittedArray, ExtractFrom extractedFrom, Dictionary<string, HashSet<ExtractionResult>> result)
    {
        var successfulExtractions = new HashSet<string>();

        foreach (var dataSplitted in splittedArray.Take(4).Concat(splittedArray.Reverse().Take(4)).Distinct())
        {
            var dataReplaced = dataSplitted;
            foreach (var replace in ToRemove)
            {
                dataReplaced = dataReplaced
                    .Replace(oldValue: replace, newValue: "", comparisonType: StringComparison.OrdinalIgnoreCase);
            }

            dataReplaced = dataReplaced.Trim();

            foreach (var extractor in Extractors)
            {
                if (!extractor.ExtractFrom.HasFlag(extractedFrom)) continue;

                var match = extractor.Regex.Match(dataReplaced);
                if (match.Success)
                {
                    if (CheckIfAlreadyExtractedThatMatch(successfulExtractions: successfulExtractions, regex: extractor.Regex)) continue;

                    if (extractor.Result == null)
                    {
                        if (match.Groups.Count != 2)
                            throw new InvalidOperationException(
                                $"Expected only 2 groups, {extractor.Regex} {dataReplaced}"
                            );

                        result.AppendOrCreateNewCollection(
                            key: (int.Parse(match.Groups[1].ToString()) * extractor.Multiplier).ToString(),
                            value: new ExtractionResult(
                                ExtractedFrom: extractedFrom,
                                Extractor: extractor.Regex.ToString(),
                                Match: match.ToString()
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
                            key: (extractor.Result.Value * extractor.Multiplier).ToString(),
                            value: new ExtractionResult(
                                ExtractedFrom: extractedFrom,
                                Extractor: extractor.Regex.ToString(),
                                Match: match.ToString()
                            )
                        );
                        successfulExtractions.Add(match.ToString());
                    }
                }
            }
        }
    }

    private record struct Extractor(Regex Regex, int? Result, int Multiplier, ExtractFrom ExtractFrom);
}