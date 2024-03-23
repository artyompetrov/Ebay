using System.Text.RegularExpressions;
using Ebay.Server.Controllers.Generated;
using Ebay.Server.Infrastructure;

namespace Ebay.Server.Services;

internal class TestStateExtractor : ExtractorBase, IExtractor
{
   public string ExtractedDataName => "test_state";

    private static readonly List<Extractor> Extractors = new()
    {
        new Extractor(new Regex(pattern: @"\bmatched\b", options: Ro), WellKnown.States.Matched, All),
        new Extractor(new Regex(pattern: @"\bselected\b", options: Ro), WellKnown.States.Matched, TitleAndShortAndConditionDescription),
        new Extractor(new Regex(pattern: @"\btested\b", options: Ro), WellKnown.States.Tested, All),
        new Extractor(new Regex(pattern: @"\bL3-3\b", options: Ro), WellKnown.States.Tested, All),
        new Extractor(new Regex(pattern: @"\bL1-3\b", options: Ro), WellKnown.States.Tested, All),
        new Extractor(new Regex(pattern: @"\btube\s*tester\b", options: Ro), WellKnown.States.Tested, All)
    };

    private static readonly string[] ToRemove =
    {
       
    };

    public Dictionary<string, HashSet<ExtractionResult>> Extract(LotDataToExtract lotDataToExtract)
    {
        var titleSplitted = Split(lotDataToExtract.Name);
        var conditionSplitted = Split(lotDataToExtract.Condition);
        var conditionDescriptionSplitted = lotDataToExtract.ConditionDescription != null ? Split(lotDataToExtract.ConditionDescription) : null;
        var descriptionTextSplitted = Split(lotDataToExtract.DescriptionText);
        var shortDescriptionTextSplitted = lotDataToExtract.ShortDescription != null ? Split(lotDataToExtract.ShortDescription) : null;

        var extractionResult = new Dictionary<string, HashSet<ExtractionResult>>(StringComparer.OrdinalIgnoreCase);

        ExtractInternal(
            splittedArray: titleSplitted,
            extractedFrom: ExtractFrom.Title,
            result: extractionResult
        );
        
        ExtractInternal(
            splittedArray: conditionSplitted,
            extractedFrom: ExtractFrom.Condition,
            result: extractionResult
        );
        
        if (conditionDescriptionSplitted != null)
        {
            ExtractInternal(
                splittedArray: conditionDescriptionSplitted,
                extractedFrom: ExtractFrom.ConditionDescription,
                result: extractionResult
            );
        }
        
        ExtractInternal(
            splittedArray: descriptionTextSplitted,
            extractedFrom: ExtractFrom.Description,
            result: extractionResult
        );
        
        if (shortDescriptionTextSplitted != null)
        {
            ExtractInternal(
                splittedArray: shortDescriptionTextSplitted,
                extractedFrom: ExtractFrom.ShortDescription,
                result: extractionResult
            );
        }

        if (extractionResult.ContainsKey(WellKnown.States.Matched))
        {
            extractionResult.Remove(WellKnown.States.Tested);
            extractionResult.Remove(WellKnown.States.NotTested);
        }
        
        
        return extractionResult;
    }

    private static void ExtractInternal(
        string[] splittedArray,
        ExtractFrom extractedFrom,
        Dictionary<string, HashSet<ExtractionResult>> result
    )
    {
        var successfulExtractions = new HashSet<string>();

        foreach (var dataSplitted in splittedArray.Take(6).Concat(splittedArray.Reverse().Take(6)).Distinct())
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
                    if (CheckIfAlreadyExtractedThatMatch(
                            successfulExtractions: successfulExtractions,
                            regex: extractor.Regex
                        )) continue;

                    if (match.Groups.Count != 1)
                        throw new InvalidOperationException(
                            $"Expected only 1 groups, {extractor.Regex} {dataReplaced}"
                        );

                    result.AppendOrCreateNewCollection(
                        key: extractor.Result,
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

    private record struct Extractor(Regex Regex, string Result, ExtractFrom ExtractFrom);
}