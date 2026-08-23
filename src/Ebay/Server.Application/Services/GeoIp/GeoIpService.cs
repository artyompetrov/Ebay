using System.Net.Http.Json;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Server.Application.Services.GeoIp;

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
            return null;

        try
        {
            return await GetFromIpApi(ip, cancellationToken)
                   ?? await GetFromIpInfo(ip, cancellationToken);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            _logger.LogWarning("GeoIP lookup timed out for {Ip}", ip);
            return null;
        }
    }

    private async Task<GeoIpLocation?> GetFromIpApi(string ip, CancellationToken cancellationToken)
    {
        try
        {
            var response = await _httpClient.GetFromJsonAsync<IpApiResponse>(
                $"http://ip-api.com/json/{ip}?fields=status,message,country,city",
                cancellationToken);

            if (response?.Status == IpApiStatusSuccess)
                return new GeoIpLocation(response.Country, response.City);

            _logger.LogWarning(
                "ip-api lookup failed for {Ip}. Status: {Status}. Message: {Message}",
                ip, response?.Status, response?.Message);

            return null;
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            _logger.LogWarning(ex, "ip-api request failed for {Ip}", ip);
            return null;
        }
    }

    private async Task<GeoIpLocation?> GetFromIpInfo(string ip, CancellationToken cancellationToken)
    {
        try
        {
            var response = await _httpClient.GetFromJsonAsync<IpInfoResponse>(
                $"https://ipinfo.io/{ip}/json",
                cancellationToken);

            return response == null
                ? null
                : new GeoIpLocation(response.Country, response.City);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            _logger.LogWarning(ex, "ipinfo.io request failed for {Ip}", ip);
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

            _ = LogRequestAsyncInternal(prefix, realIp, ua);

        }
        finally
        {
            _semaphore.Release();
        }
    }

    /// <summary>
    /// Логируем город запроса - задача fire and forget CancellationToken не нужен
    /// </summary>
    private async Task LogRequestAsyncInternal(string prefix, string? realIp, string ua)
    {
        GeoIpLocation? location = null;

        try
        {
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));
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