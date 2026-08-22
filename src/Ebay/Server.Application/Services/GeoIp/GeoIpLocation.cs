using System.Net.Http.Json;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace Server.Application.Services.GeoIp;

public sealed record GeoIpLocation(string? Country, string? City);