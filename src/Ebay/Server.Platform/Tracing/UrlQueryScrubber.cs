using System.Diagnostics;
using OpenTelemetry;

namespace Server.Platform.Tracing;

/// <summary>
/// Removes URL query strings from finished spans. HTTP instrumentation only redacts query values, while
/// parameter names and the query layout can still carry sensitive data (tokens, codes, e-mails).
/// </summary>
/// <remarks>
/// Must be added to the tracer provider before any exporter: processors run <see cref="OnEnd"/> in
/// registration order, and an exporter registered earlier would see the span before it is scrubbed.
/// </remarks>
internal sealed class UrlQueryScrubber : BaseProcessor<Activity>
{
    /// <summary>Semantic-convention attribute holding the query string of a request.</summary>
    internal const string UrlQueryAttribute = "url.query";

    /// <summary>Semantic-convention attribute holding the full URL of an outgoing request.</summary>
    internal const string UrlFullAttribute = "url.full";

    private const char QuerySeparator = '?';

    public override void OnEnd(Activity data)
    {
        if (data.GetTagItem(UrlQueryAttribute) is not null)
        {
            data.SetTag(UrlQueryAttribute, null);
        }

        if (data.GetTagItem(UrlFullAttribute) is string fullUrl)
        {
            var querySeparatorIndex = fullUrl.IndexOf(QuerySeparator, StringComparison.Ordinal);
            if (querySeparatorIndex >= 0)
            {
                data.SetTag(UrlFullAttribute, fullUrl[..querySeparatorIndex]);
            }
        }
    }
}
