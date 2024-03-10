using System.Text.RegularExpressions;
using Ebay.Server.Controllers.Generated;
using Ebay.Server.Infrastructure;

namespace Ebay.Server.Services;

internal class PcsExtractor : IExtractor
{
    private static readonly string[] NewLines = { "\r\n", "\r", "\n" };
    
    private static readonly ExtractFrom All = ExtractFrom.Title | ExtractFrom.Description |
        ExtractFrom.ConditionDescription;

    private static readonly ExtractFrom TitleAndConditionDescription =
        ExtractFrom.Title | ExtractFrom.ConditionDescription;

    private static readonly RegexOptions RO = RegexOptions.IgnoreCase;

    private static readonly string[] ToRemove =
    {
        "196x year",
        "197x year",
        "198x year",
        "199x year",
        "3x MICA",
        "than 9 pcs"
    };

    /// <summary>
    /// Перечень экстракторов с приоритетами
    /// </summary>
    private static readonly List<Extractor> Extractors = new()
    {
        new Extractor(new Regex(@"\b(\d{1,2})\s*x?-?\s*match(?:ed)?\s+pair\b", RO), null, 2, All),
        new Extractor(new Regex(@"\b(\d{1,2})\s*x?-?\s*match(?:ed)?\s+quad\b", RO), null, 4, All),
        new Extractor(new Regex(@"\b(\d{1,2})\s*quartets\b", RO), null, 4, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+pair\b", RO), 2, 1, All),
        new Extractor(new Regex(@"\bselected\s+pair\b", RO), 2, 1, All),
        new Extractor(new Regex(@"\bbalanced\s+quad\b", RO), 4, 1, All),
        new Extractor(new Regex(@"\bpair\s+match(?:ed)?\b", RO), 2, 1, All),
        new Extractor(new Regex(@"\bquad\s+match(?:ed)?\b", RO), 4, 1, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+quad\b", RO), 4, 1, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+quartet\b", RO), 4, 1, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+four\b", RO), 4, 1, All),
        new Extractor(new Regex(@"\b(\d+)\s*pc\b", RO), null, 1, All),
        new Extractor(new Regex(@"(?:x|\b)(\d{1,3})\s*pcs\b", RO), null, 1, All),
        new Extractor(new Regex(@"\bpcs\s*(\d{1,3})\b", RO), null, 1, All),
        new Extractor(new Regex(@"(?:^|\s+)(\d{1,3})\s*x\b", RO), null, 1, TitleAndConditionDescription),
        new Extractor(new Regex(@"\blot\s+x\s*(\d{1,3})", RO), null, 1, All),
        new Extractor(new Regex(@"\blot\s*of\s*(\d{1,3})", RO), null, 1, All),
        new Extractor(new Regex(@"\bpack\s*of\s*(\d{1,3})", RO), null, 1, All),
        new Extractor(new Regex(@"\bset\s*of\s*(\d{1,3})", RO), null, 1, All),
        new Extractor(new Regex(@"\bis\s*for\s*(\d{1,3})", RO), null, 1, All),
        new Extractor(new Regex(@"\bqty[ -=(](\d{1,3})", RO), null, 1, All),
        new Extractor(new Regex(@"\blot[-=](\d{1,3})", RO), null, 1, All),
        new Extractor(new Regex(@"\bx(\d{1,3})\s*piece", RO), null, 1, All),
        new Extractor(new Regex(@"^(\d{1,3})\s*(?:\*|x)", RO), null, 1, All),
        new Extractor(new Regex(@"^(\d{1,3})\s*pair", RO), null, 2, All),
        new Extractor(new Regex(@"^[([]?(\d{1,3})[)\]]?\s", RO), null, 1, TitleAndConditionDescription),
        new Extractor(new Regex(@"\bprice\s+is\s+for\s+one\b", RO), 1, 1, All),

        new Extractor(new Regex(@"^one\b", RO), 1, 1, All),
        new Extractor(new Regex(@"^two\b", RO), 2, 1, All),
        new Extractor(new Regex(@"^pair\b", RO), 2, 1, All),
        new Extractor(new Regex(@"^pair\b", RO), 2, 1, All),
        new Extractor(new Regex(@"^four\b", RO), 4, 1, All),
        new Extractor(new Regex(@"\bquad\b", RO), 4, 1, All),
        new Extractor(new Regex(@"\bquartet\b", RO), 4, 1, All)
    };


    public string ExtractedDataName => "pcs";

    public Dictionary<string, HashSet<ExtractionResult>> Extract(LotDataToExtract lotDataToExtract)
    {
        var titleSplitted = Split(lotDataToExtract.Name);
        var conditionDescriptionSplitted = lotDataToExtract.ConditionDescription != null ? Split(lotDataToExtract.ConditionDescription) : null;
        var descriptionTextSplitted = Split(lotDataToExtract.DescriptionText);

        var extractionResult = new Dictionary<string, HashSet<ExtractionResult>>();
        Extract(titleSplitted, ExtractFrom.Title, extractionResult);

        if (conditionDescriptionSplitted != null)
        {
            Extract(
                conditionDescriptionSplitted,
                ExtractFrom.ConditionDescription,
                extractionResult
            );
        }

        Extract(
            descriptionTextSplitted,
            ExtractFrom.Description,
            extractionResult
        );

        
        return extractionResult;
    }

    public void Extract(string[] splittedArray, ExtractFrom extractedFrom, Dictionary<string, HashSet<ExtractionResult>> result)
    {
        var successfulExtractions = new HashSet<string>();

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
                            key: (int.Parse(match.Groups[1].ToString()) * extractor.Multiplier).ToString(),
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
                            (extractor.Result.Value * extractor.Multiplier).ToString(),
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

    private static string[] Split(string data)
    {
        return data.Split(
            NewLines,
            StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries
        );
    }

}