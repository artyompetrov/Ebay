using System.Net.Http;
using System.Net.Http.Json;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Server.Application.Services.GeoIp;

public sealed record GeoIpLocation(string? Country, string? City);

public class GeoIpService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<GeoIpService> _logger;
    private readonly IMemoryCache _cache;

    public GeoIpService(HttpClient httpClient, ILogger<GeoIpService> logger, IMemoryCache cache)
    {
        _httpClient = httpClient;
        _logger = logger;
        _cache = cache;
    }

    private async Task<GeoIpLocation?> GetLocationAsync(string? ip, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(ip))
            return null;

        try
        {
            var response = await _httpClient.GetFromJsonAsync<IpApiResponse>(
                $"http://ip-api.com/json/{ip}?fields=country,city",
                cancellationToken);

            if (response == null)
                return null;

            return new GeoIpLocation(response.Country, response.City);
        }
        catch (OperationCanceledException)
        {
            _logger.LogWarning("GeoIP lookup timed out for {Ip}", ip);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get location for {Ip}", ip);
            return null;
        }
    }

    public void LogRequest(string prefix, string? realIp, string ua, CancellationToken token)
    {
        if (!string.IsNullOrWhiteSpace(realIp))
        {
            if (_cache.TryGetValue(realIp, out _))
                return;

            _cache.Set(realIp, true, TimeSpan.FromDays(1));
        }

        _ = LogRequestAsyncInternal(prefix, realIp, ua, token);
    }
    
    private async Task LogRequestAsyncInternal(string prefix, string? realIp, string ua, CancellationToken token)
    {
        GeoIpLocation? location = null;

        try
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(token);
            cts.CancelAfter(TimeSpan.FromSeconds(5));
            location = await GetLocationAsync(realIp, cts.Token);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "GeoIP lookup failed for {XRealIp}", realIp);
        }

        _logger.LogInformation(
            message: prefix + " X-Real-IP: {XRealIp}. Country: {Country}. City: {City}. UserAgent: {UserAgent}",
            realIp,
            location?.Country,
            location?.City,
            ua);
    }
    
    private sealed record IpApiResponse(string? Country, string? City);
}
