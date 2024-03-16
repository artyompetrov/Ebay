using System.Text.RegularExpressions;
using Ebay.Server.Controllers.Generated;
using Ebay.Server.Infrastructure;

namespace Ebay.Server.Services;

internal class ConditionExtractor : ExtractorBase, IExtractor
{
    public string ExtractedDataName => "condition";

    private static readonly List<Extractor> Extractors = new()
    {
        new Extractor(new Regex(pattern: @"\bne[vw]er\s+used\b", options: Ro), WellKnown.Conditions.New, All),
        new Extractor(new Regex(pattern: @"\bdismantl(?:ing|ed)\b", options: Ro), WellKnown.Conditions.Used, All),
        new Extractor(new Regex(pattern: @"\blike\s+new\b", options: Ro), WellKnown.Conditions.Used, All),
        new Extractor(new Regex(pattern: @"\bnever\s+been\s+used\b", options: Ro), WellKnown.Conditions.New, All),
        new Extractor(new Regex(pattern: @"\bunused\b", options: Ro), WellKnown.Conditions.New, All),
        new Extractor(new Regex(pattern: @"\bused\b", options: Ro), WellKnown.Conditions.Used, All),
        new Extractor(new Regex(pattern: @"\bnib\b", options: Ro), WellKnown.Conditions.New, All),
       //todo new Extractor(new Regex(pattern: @"\bnos\b", options: Ro), WellKnown.Conditions.New, All),
        new Extractor(new Regex(pattern: @"\bnew\b", options: Ro), WellKnown.Conditions.New, All),
        new Extractor(new Regex(pattern: @"\bnot\s+working\b", options: Ro), WellKnown.Conditions.NotWorking, All),
        new Extractor(new Regex(pattern: @"\bfor\s+parts\b", options: Ro), WellKnown.Conditions.NotWorking, All),
       //todo new Extractor(new Regex(pattern: @"\bopen\s+box\b", options: Ro), WellKnown.Conditions.New, All),
    };

    private static readonly string[] ToRemove =
    {
        "be used",
        "are used in",
        "is used in",
        "used in",
        "used for",
        "used as",
        "used as",
        "is new to",
        "are new to",
        "new to",
        "used to",
        "used to",
        "removed from never used",
        "looks NOS",
        "widely used",
        "parameters are like new",
        "not a sign that the tube is used",
    };

    public Dictionary<string, HashSet<ExtractionResult>> Extract(LotDataToExtract lotDataToExtract)
    {
        var titleSplitted = Split(lotDataToExtract.Name);
        var conditionSplitted = Split(lotDataToExtract.Condition);
        var conditionDescriptionSplitted = lotDataToExtract.ConditionDescription != null ? Split(lotDataToExtract.ConditionDescription) : null;
        var descriptionTextSplitted = Split(lotDataToExtract.DescriptionText);
        var shortDescriptionTextSplitted = lotDataToExtract.ShortDescription != null ? Split(lotDataToExtract.ShortDescription) : null;

        var extractionResult = new Dictionary<string, HashSet<ExtractionResult>>();

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

        return extractionResult;
    }

    private static void ExtractInternal(
        string[] splittedArray,
        ExtractFrom extractedFrom,
        Dictionary<string, HashSet<ExtractionResult>> result
    )
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