using System.Text.RegularExpressions;

namespace Ebay.Server.Services;

internal abstract class ExtractorBase
{
    protected static readonly ExtractFrom All = ExtractFrom.Title | ExtractFrom.Description |
        ExtractFrom.ConditionDescription | ExtractFrom.Condition;

    protected static readonly ExtractFrom TitleAndConditionDescription =
        ExtractFrom.Title | ExtractFrom.ConditionDescription;

    private static readonly string[] NewLines = { "\r\n", "\r", "\n" };
    protected const RegexOptions Ro = RegexOptions.IgnoreCase;

    protected static string[] Split(string data)
    {
        return data.Split(
            NewLines,
            StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries
        );
    }

    protected static bool CheckIfAlreadyExtractedThatMatch(HashSet<string> successfulExtractions, Regex regex)
    {
        var alreadyExtractedThatMatch = false;
        foreach (var successfulExtraction in successfulExtractions)
        {
            if (regex.Match(successfulExtraction).Success)
            {
                alreadyExtractedThatMatch = true;
                break;
            }
        }

        return alreadyExtractedThatMatch;
    }
}