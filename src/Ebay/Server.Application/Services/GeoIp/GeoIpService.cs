using System.Net.Http.Json;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Server.Application.Services.GeoIp;

public sealed record GeoIpLocation(string? Country, string? City);

public class GeoIpService : IDisposable
{
    private const string IpApiStatusSuccess = "success";
    private readonly HttpClient _httpClient;
    private readonly ILogger<GeoIpService> _logger;
    private readonly IMemoryCache _cache;
    private readonly SemaphoreSlim _semaphore = new(1, 1);

    public GeoIpService(HttpClient httpClient, ILogger<GeoIpService> logger, IMemoryCache cache)
    {
        _httpClient = httpClient;
        _logger = logger;
        _cache = cache;
    }

    private async Task<GeoIpLocation?> GetLocationAsync(string? ip, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(ip))
        {
            return null;
        }

        try
        {
            var ipApiResponse = await _httpClient.GetFromJsonAsync<IpApiResponse>(
                $"http://ip-api.com/json/{ip}?fields=status,message,country,city",
                cancellationToken);

            if (ipApiResponse?.Status == IpApiStatusSuccess)
            {
                return new GeoIpLocation(ipApiResponse.Country, ipApiResponse.City);
            }

            _logger.LogWarning(
                "ip-api lookup failed for {Ip}. Status: {Status}. Message: {Message}",
                ip,
                ipApiResponse?.Status,
                ipApiResponse?.Message);

            var ipInfoResponse = await _httpClient.GetFromJsonAsync<IpInfoResponse>(
                $"https://ipinfo.io/{ip}/json",
                cancellationToken);

            return ipInfoResponse == null ? null : new GeoIpLocation(ipInfoResponse.Country, ipInfoResponse.City);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
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

    public async Task LogRequest(
        string prefix,
        string? realIp,
        string ua,
        CancellationToken token)
    {
        await _semaphore.WaitAsync(token);
        try
        {

            var key = $"{prefix}_{realIp}_{ua}";

            if (_cache.TryGetValue(key, out _))
            {
                return;
            }

            _cache.Set(key, true, TimeSpan.FromDays(1));

            _ = LogRequestAsyncInternal(prefix, realIp, ua, token);

        }
        finally
        {
            _semaphore.Release();
        }
    }

    private async Task LogRequestAsyncInternal(string prefix, string? realIp, string ua, CancellationToken token)
    {
        GeoIpLocation? location = null;

        try
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(token);
            cts.CancelAfter(TimeSpan.FromSeconds(60));
            location = await GetLocationAsync(realIp, cts.Token);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "GeoIP lookup failed for {XRealIp}", realIp);
        }

        if (WellKnown.GeoIp.ExcludeCountries.Contains(location?.Country, StringComparer.OrdinalIgnoreCase))
        {
            return;
        }

        _logger.LogInformation(
#pragma warning disable CA2254
            message: prefix + " X-Real-IP: {XRealIp}. Country: {Country}. City: {City}. UserAgent: {UserAgent}",
#pragma warning restore CA2254
            realIp,
            location?.Country,
            location?.City,
            ua);
    }

    private sealed record IpApiResponse(string? Status, string? Message, string? Country, string? City);

    private sealed record IpInfoResponse(string? Country, string? City);

    public void Dispose()
    {
        _httpClient.Dispose();
        _semaphore.Dispose();
        GC.SuppressFinalize(this);
    }
}
