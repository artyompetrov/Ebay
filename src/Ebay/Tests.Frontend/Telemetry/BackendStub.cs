using System.Collections.Concurrent;
using System.Net;
using System.Net.Http.Json;

namespace Tests.Frontend.Telemetry;

/// <summary>A backend (or other host) that answers every call with a fixed status and JSON body and records the requests.</summary>
internal sealed class BackendStub : HttpMessageHandler
{
    private readonly ConcurrentQueue<HttpRequestMessage> _requests = new();

    public HttpStatusCode Status { get; set; } = HttpStatusCode.OK;

    public object Body { get; set; } = new { ok = true };

    public IReadOnlyCollection<HttpRequestMessage> Requests => _requests;

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        _requests.Enqueue(request);
        return Task.FromResult(new HttpResponseMessage(Status) { Content = JsonContent.Create(Body) });
    }
}
