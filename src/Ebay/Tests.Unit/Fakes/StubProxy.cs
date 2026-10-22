using System.Collections.Concurrent;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace Tests.Unit.Fakes;

/// <summary>
/// Минимальный HTTP-прокси на loopback-порту: записывает заголовки запросов, на первый запрос без
/// <c>Proxy-Authorization</c> отвечает 407 с Basic-вызовом (если требуется аутентификация), на остальные - 502.
/// До целевого сайта ничего не доходит, поэтому тесты не ходят в сеть.
/// </summary>
internal sealed class StubProxy : IAsyncDisposable
{
    private const string ProxyAuthorizationHeader = "Proxy-Authorization";

    private const string ChallengeResponse =
        "HTTP/1.1 407 Proxy Authentication Required\r\nProxy-Authenticate: Basic realm=\"stub\"\r\nContent-Length: 0\r\n\r\n";

    private const string BadGatewayResponse = "HTTP/1.1 502 Bad Gateway\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";

    private readonly TcpListener _listener = new(IPAddress.Loopback, 0);
    private readonly ConcurrentQueue<ProxyRequest> _requests = new();
    private readonly CancellationTokenSource _stopping = new();
    private readonly bool _requireAuthentication;
    private readonly Task _acceptLoop;

    public StubProxy(bool requireAuthentication)
    {
        _requireAuthentication = requireAuthentication;
        _listener.Start();
        Address = new Uri($"http://{IPAddress.Loopback}:{((IPEndPoint)_listener.LocalEndpoint).Port}");
        _acceptLoop = AcceptLoopAsync(_stopping.Token);
    }

    public Uri Address { get; }

    public IReadOnlyCollection<ProxyRequest> Requests => [.. _requests];

    public async ValueTask DisposeAsync()
    {
        await _stopping.CancelAsync();
        _listener.Stop();
        await _acceptLoop;
        _stopping.Dispose();
    }

    private async Task AcceptLoopAsync(CancellationToken cancellationToken)
    {
        try
        {
            while (true)
            {
                var client = await _listener.AcceptTcpClientAsync(cancellationToken);
                _ = HandleAsync(client, cancellationToken);
            }
        }
        catch (OperationCanceledException)
        {
            // Остановка прокси в DisposeAsync.
        }
    }

    private async Task HandleAsync(TcpClient client, CancellationToken cancellationToken)
    {
        using (client)
        {
            try
            {
                await using var stream = client.GetStream();
                using var reader = new StreamReader(stream, Encoding.ASCII, detectEncodingFromByteOrderMarks: false, leaveOpen: true);

                while (await ReadRequestAsync(reader, cancellationToken) is { } request)
                {
                    _requests.Enqueue(request);

                    if (_requireAuthentication && request.ProxyAuthorization is null)
                    {
                        await stream.WriteAsync(Encoding.ASCII.GetBytes(ChallengeResponse), cancellationToken);
                        continue;
                    }

                    await stream.WriteAsync(Encoding.ASCII.GetBytes(BadGatewayResponse), cancellationToken);
                    return;
                }
            }
            catch (Exception e) when (e is IOException or OperationCanceledException)
            {
                // Клиент закрыл соединение или прокси останавливается.
            }
        }
    }

    private static async Task<ProxyRequest?> ReadRequestAsync(StreamReader reader, CancellationToken cancellationToken)
    {
        var requestLine = await reader.ReadLineAsync(cancellationToken);
        if (string.IsNullOrEmpty(requestLine))
        {
            return null;
        }

        string? proxyAuthorization = null;
        while (await reader.ReadLineAsync(cancellationToken) is { Length: > 0 } header)
        {
            var separator = header.IndexOf(':', StringComparison.Ordinal);
            if (separator > 0 && header.AsSpan(0, separator).Equals(ProxyAuthorizationHeader, StringComparison.OrdinalIgnoreCase))
            {
                proxyAuthorization = header[(separator + 1)..].Trim();
            }
        }

        return new ProxyRequest(requestLine, proxyAuthorization);
    }
}
