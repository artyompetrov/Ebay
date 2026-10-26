using System.Net.Http;
using Client.Clients.Generated;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;
using Microsoft.Extensions.Logging;

namespace Client.Telemetry;

/// <summary>
/// The served minimum log level (<c>GET /api/telemetry/v1/settings</c>), fetched at most every
/// <see cref="CacheDuration"/>. A failed fetch keeps the previous level and is tried again on the next export.
/// Deliberately process-wide state: one cached value per app load.
/// </summary>
internal sealed class ClientTelemetrySettingsSource
{
    public static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(10);

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly TelemetryLevel _level;
    private readonly TimeProvider _time;
    private DateTimeOffset? _fetchedAt;

    public ClientTelemetrySettingsSource(IHttpClientFactory httpClientFactory, TelemetryLevel level, TimeProvider time)
    {
        _httpClientFactory = httpClientFactory;
        _level = level;
        _time = time;
    }

    public async Task<LogLevel> GetMinLevelAsync(CancellationToken cancellationToken)
    {
        var now = _time.GetUtcNow();
        if (_fetchedAt is { } fetchedAt && now - fetchedAt < CacheDuration)
        {
            return _level.MinLevel;
        }

        try
        {
            var client = new WebApiClient(_httpClientFactory.CreateClient(TelemetryHttpClient.Name));
            var settings = await client.GetClientTelemetrySettingsAsync(cancellationToken);
            if (Enum.TryParse<LogLevel>(settings.MinLevel, ignoreCase: true, out var level) && Enum.IsDefined(level))
            {
                _level.Set(level);
            }

            _fetchedAt = now;
        }
        catch (AccessTokenNotAvailableException)
        {
            // No token: telemetry never starts a login (the exception's Redirect() is not called).
        }
        catch (ApiException)
        {
            // The backend answered with an error; keep the previous level.
        }
        catch (HttpRequestException)
        {
            // The backend is unreachable; keep the previous level.
        }

        return _level.MinLevel;
    }
}
