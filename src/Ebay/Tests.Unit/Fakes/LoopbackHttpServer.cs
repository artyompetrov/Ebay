using System.Net;
using System.Net.Sockets;
using System.Text;

namespace Tests.Unit.Fakes;

/// <summary>
/// HTTP-сервер на loopback-порту, отвечающий на любой запрос одним и тем же JSON: заменяет ссылку смены IP провайдера,
/// чтобы запрос прошёл через настоящий обработчик (с его трейсами), но не уходил в сеть.
/// </summary>
internal sealed class LoopbackHttpServer : IAsyncDisposable
{
    private readonly HttpListener _listener = new();
    private readonly string _body;
    private readonly Task _loop;
    private int _requestCount;

    public LoopbackHttpServer(string body)
    {
        _body = body;
        var port = GetFreePort();
        BaseAddress = new Uri($"http://{IPAddress.Loopback}:{port}/");
        _listener.Prefixes.Add(BaseAddress.ToString());
        _listener.Start();
        _loop = LoopAsync();
    }

    public Uri BaseAddress { get; }

    public int RequestCount => Volatile.Read(ref _requestCount);

    public async ValueTask DisposeAsync()
    {
        _listener.Stop();
        await _loop;
        _listener.Close();
    }

    private async Task LoopAsync()
    {
        try
        {
            while (true)
            {
                var context = await _listener.GetContextAsync();
                Interlocked.Increment(ref _requestCount);
                var bytes = Encoding.UTF8.GetBytes(_body);
                context.Response.ContentType = "application/json";
                context.Response.ContentLength64 = bytes.Length;
                await context.Response.OutputStream.WriteAsync(bytes);
                context.Response.Close();
            }
        }
        catch (Exception e) when (e is HttpListenerException or ObjectDisposedException or InvalidOperationException)
        {
            // Сервер остановлен в DisposeAsync.
        }
    }

    private static int GetFreePort()
    {
        var listener = new TcpListener(IPAddress.Loopback, 0);
        listener.Start();
        var port = ((IPEndPoint)listener.LocalEndpoint).Port;
        listener.Stop();
        return port;
    }
}
