namespace Server.Application.Abstractions.Services;

public interface IGeoIpService
{
    Task LogRequest(
        string prefix,
        string? realIp,
        string ua,
        CancellationToken token);

}