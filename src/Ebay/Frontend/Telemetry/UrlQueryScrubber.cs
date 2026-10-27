using System.Text.RegularExpressions;

namespace Client.Telemetry;

/// <summary>Removes query strings from absolute URLs in text before it is recorded: they are never exported.</summary>
internal static partial class UrlQueryScrubber
{
    public static string Scrub(string text) => text.Contains('?', StringComparison.Ordinal) ? UrlWithQuery().Replace(text, "${url}") : text;

    [GeneratedRegex("""(?<url>[a-zA-Z][a-zA-Z0-9+.-]*://[^\s?#"'<>]+)\?[^\s#"'<>]*""")]
    private static partial Regex UrlWithQuery();
}
