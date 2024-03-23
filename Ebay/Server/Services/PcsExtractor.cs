using System.Text.RegularExpressions;
using Ebay.Server.Controllers.Generated;
using Ebay.Server.Infrastructure;

namespace Ebay.Server.Services;

internal class PcsExtractor : ExtractorBase, IExtractor
{
    public string ExtractedDataName => "pcs";

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
        new Extractor(new Regex(@"\b(\d{1,2})\s*x?-?\s*match(?:ed)?\s+pair\b", Ro), null, 2, All),
        new Extractor(new Regex(@"\b(\d{1,2})\s*x?-?\s*match(?:ed)?\s+quad\b", Ro), null, 4, All),
        new Extractor(new Regex(@"\b(\d{1,2})\s*quartets\b", Ro), null, 4, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+pair\b", Ro), 2, 1, All),
        new Extractor(new Regex(@"\bselected\s+pair\b", Ro), 2, 1, All),
        new Extractor(new Regex(@"\bbalanced\s+quad\b", Ro), 4, 1, All),
        new Extractor(new Regex(@"\bpair\s+match(?:ed)?\b", Ro), 2, 1, All),
        new Extractor(new Regex(@"\bquad\s+match(?:ed)?\b", Ro), 4, 1, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+quad\b", Ro), 4, 1, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+quartet\b", Ro), 4, 1, All),
        new Extractor(new Regex(@"\btwo\s+match(?:ed)?\s+octets\b", Ro), 16, 1, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+octet\b", Ro), 8, 1, All),
        new Extractor(new Regex(@"\bmatch(?:ed)?\s+four\b", Ro), 4, 1, All),
        new Extractor(new Regex(@"\b(\d+)\s*pc\b", Ro), null, 1, All),
        new Extractor(new Regex(@"\b(\d+)\s*units\b", Ro), null, 1, All),
        new Extractor(new Regex(@"(?:x|\b)(\d{1,3})\s*pcs\b", Ro), null, 1, All),
        new Extractor(new Regex(@"\bpcs\s*(\d{1,3})\b", Ro), null, 1, All),
        new Extractor(new Regex(@"(?:^|\s+)(\d{1,3})\s*x\b", Ro), null, 1, TitleAndShortAndConditionDescription),
        new Extractor(new Regex(@"\blot\s+x\s*(\d{1,3})", Ro), null, 1, All),
        new Extractor(new Regex(@"\blot\s*of\s*(\d{1,3})", Ro), null, 1, All),
        new Extractor(new Regex(@"\bpack\s*of\s*(\d{1,3})", Ro), null, 1, All),
        new Extractor(new Regex(@"\bset\s*of\s*(\d{1,3})", Ro), null, 1, All),
        new Extractor(new Regex(@"\bis\s*for\s*(\d{1,3})", Ro), null, 1, All),
        new Extractor(new Regex(@"\bqty[ -=(](\d{1,3})", Ro), null, 1, All),
        new Extractor(new Regex(@"\blot[-=](\d{1,3})", Ro), null, 1, All),
        new Extractor(new Regex(@"\bx(\d{1,3})\s*piece", Ro), null, 1, All),
        new Extractor(new Regex(@"^(\d{1,3})\s*(?:\*|x)", Ro), null, 1, All),
        new Extractor(new Regex(@"\b(\d{1,3})\s*pair", Ro), null, 2, All),
        new Extractor(new Regex(@"^[([]?(\d{1,3})[)\]]?\s", Ro), null, 1, TitleAndConditionDescription),
        new Extractor(new Regex(@"\bprice\s+is\s+for\s+one\bpair\b", Ro), 2, 1, All),
        new Extractor(new Regex(@"\bprice\s+is\s+for\s+one\b", Ro), 1, 1, All),
        
        new Extractor(new Regex(@"^one\s+pair\b", Ro), 2, 1, All),
        new Extractor(new Regex(@"^one\b", Ro), 1, 1, All),
        new Extractor(new Regex(@"^two\b", Ro), 2, 1, All),
        new Extractor(new Regex(@"^pair\b", Ro), 2, 1, All),
        new Extractor(new Regex(@"^pair\b", Ro), 2, 1, All),
        new Extractor(new Regex(@"^four\b", Ro), 4, 1, All),
        new Extractor(new Regex(@"\bquad\b", Ro), 4, 1, All),
        new Extractor(new Regex(@"\bquartet\b", Ro), 4, 1, All),
        new Extractor(new Regex(@"\boctet\b", Ro), 8, 1, All)
    };

    public Dictionary<string, HashSet<ExtractionResult>> Extract(LotDataToExtract lotDataToExtract)
    {
        var titleSplitted = Split(lotDataToExtract.Name);
        var conditionDescriptionSplitted = lotDataToExtract.ConditionDescription != null ? Split(lotDataToExtract.ConditionDescription) : null;
        var descriptionTextSplitted = Split(lotDataToExtract.DescriptionText);
        var shortDescriptionTextSplitted = lotDataToExtract.ShortDescription != null ? Split(lotDataToExtract.ShortDescription) : null;

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
        
        if (shortDescriptionTextSplitted != null)
        {
            Extract(
                shortDescriptionTextSplitted,
                ExtractFrom.ShortDescription,
                extractionResult
            );
        }

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
                dataReplaced = dataReplaced
                    .Replace(replace, "", StringComparison.OrdinalIgnoreCase);
            }

            dataReplaced = dataReplaced.Trim();

            foreach (var extractor in Extractors)
            {
                if (!extractor.ExtractFrom.HasFlag(extractedFrom)) continue;

                var match = extractor.Regex.Match(dataReplaced);
                if (match.Success)
                {
                    if (CheckIfAlreadyExtractedThatMatch(successfulExtractions, extractor.Regex)) continue;

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
                            key: (extractor.Result.Value * extractor.Multiplier).ToString(),
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

    private record struct Extractor(Regex Regex, int? Result, int Multiplier, ExtractFrom ExtractFrom);
}