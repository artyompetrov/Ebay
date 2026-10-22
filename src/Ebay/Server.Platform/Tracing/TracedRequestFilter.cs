using Microsoft.AspNetCore.Http;

namespace Server.Platform.Tracing;

/// <summary>
/// Decides which incoming requests get a server span: the health check, <c>/.well-known/</c> discovery
/// and static frontend files are excluded because they only add noise.
/// </summary>
internal static class TracedRequestFilter
{
    private const char PathSeparator = '/';

    private static readonly string[] ExcludedPathPrefixes = ["/_framework/", "/_content/", "/.well-known/"];

    private static readonly string[] StaticAssetExtensions =
        [".js", ".css", ".wasm", ".map", ".ico", ".png", ".jpg", ".svg", ".woff", ".woff2", ".ttf", ".otf", ".eot"];

    /// <summary>Returns <see langword="true"/> when a request to <paramref name="path"/> must be traced.</summary>
    public static bool IsTraced(PathString path)
    {
        var value = path.Value ?? string.Empty;
        if (value.TrimEnd(PathSeparator).Equals(PlatformExtensions.HealthEndpointPath, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        return !ExcludedPathPrefixes.Any(prefix => value.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            && !StaticAssetExtensions.Any(extension => value.EndsWith(extension, StringComparison.OrdinalIgnoreCase));
    }
}
