using System.Net.Http;
using System.Net.Http.Json;
using Microsoft.Extensions.Logging;

namespace Server.Application.Services.GeoIp;

public sealed record GeoIpLocation(string? Country, string? City);

public class GeoIpService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<GeoIpService> _logger;

    public GeoIpService(HttpClient httpClient, ILogger<GeoIpService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<GeoIpLocation?> GetLocationAsync(string? ip, CancellationToken cancellationToken)
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
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get location for {Ip}", ip);
            return null;
        }
    }

    private sealed record IpApiResponse(string? Country, string? City);
}
