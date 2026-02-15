using System.Text.RegularExpressions;
using Server.Application.Infrastructure;
using Server.Controllers.Generated;

namespace Server.Application.Services.LotDataExtractor;

internal class TestStateExtractor : ExtractorBase, IExtractor
{
    public string ExtractedDataName => "test_state";

    private static readonly List<Extractor> Extractors =
    [
        new Extractor(Regex: new Regex(pattern: @"\bmatched\b", options: Ro), Result: WellKnown.Categories.TestState.Matched, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bselected\b", options: Ro), Result: WellKnown.Categories.TestState.Matched, ExtractFrom: TitleAndShortAndConditionDescription),
        new Extractor(Regex: new Regex(pattern: @"\btested\b", options: Ro), Result: WellKnown.Categories.TestState.Tested, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bL3-3\b", options: Ro), Result: WellKnown.Categories.TestState.Tested, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\bL1-3\b", options: Ro), Result: WellKnown.Categories.TestState.Tested, ExtractFrom: All),
        new Extractor(Regex: new Regex(pattern: @"\btube\s*tester\b", options: Ro), Result: WellKnown.Categories.TestState.Tested, ExtractFrom: All)
    ];

    private static readonly string[] ToRemove = [];

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

#pragma warning disable CA1853
        if (extractionResult.ContainsKey(WellKnown.Categories.TestState.Matched))
#pragma warning restore CA1853
        {
            _ = extractionResult.Remove(WellKnown.Categories.TestState.Tested);
            _ = extractionResult.Remove(WellKnown.Categories.TestState.NotTested);
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
                if (!extractor.ExtractFrom.HasFlag(extractedFrom))
                {
                    continue;
                }

                var match = extractor.Regex.Match(dataReplaced);
                if (match.Success)
                {
                    if (CheckIfAlreadyExtractedThatMatch(
                            successfulExtractions: successfulExtractions,
                            regex: extractor.Regex
                        ))
                    {
                        continue;
                    }

                    if (match.Groups.Count != 1)
                    {
                        throw new InvalidOperationException(
                            $"Expected only 1 groups, {extractor.Regex} {dataReplaced}"
                        );
                    }

                    result.AppendOrCreateNewCollection(
                        key: extractor.Result,
                        value: new ExtractionResult(
                            ExtractedFrom: extractedFrom,
                            Extractor: extractor.Regex.ToString(),
                            Match: match.ToString()
                        )
                    );
                    _ = successfulExtractions.Add(match.ToString());
                }
            }
        }
    }

    private record struct Extractor(Regex Regex, string Result, ExtractFrom ExtractFrom);
}