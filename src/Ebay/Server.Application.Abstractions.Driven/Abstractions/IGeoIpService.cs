namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Resolves the geographic location of an IP address and logs it, deduplicating repeated lookups
/// for the same request signature.
/// </summary>
public interface IGeoIpService
{
    /// <summary>
    /// Resolves <paramref name="realIp"/>'s location and logs it, unless the same
    /// <paramref name="prefix"/>/<paramref name="realIp"/>/<paramref name="userAgent"/> combination
    /// was already logged recently.
    /// </summary>
    Task LogRequest(string prefix, string? realIp, string userAgent, CancellationToken cancellationToken);
}
