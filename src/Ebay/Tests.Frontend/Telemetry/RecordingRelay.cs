using System.Collections.Concurrent;
using System.Net;
using System.Net.Http.Json;

namespace Tests.Frontend.Telemetry;

/// <summary>The backend's telemetry relay: records every post and answers with the queued statuses (then <c>200</c>).</summary>
internal sealed class RecordingRelay : HttpMessageHandler
{
    private readonly ConcurrentQueue<HttpStatusCode> _statuses = new();
    private readonly ConcurrentQueue<RelayPost> _posts = new();

    public string MinLevel { get; set; } = "Debug";

    public IReadOnlyCollection<RelayPost> Posts => _posts;

    public int SettingsRequests { get; private set; }

    /// <summary>Called inside every relay call, e.g. to write log records the way the HTTP stack would.</summary>
    public Action? OnRequest { get; set; }

    public void AnswerNext(HttpStatusCode status) => _statuses.Enqueue(status);

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        OnRequest?.Invoke();
        var path = request.RequestUri!.AbsolutePath;
        if (path.EndsWith("/telemetry/v1/settings", StringComparison.Ordinal))
        {
            SettingsRequests++;
            return new HttpResponseMessage(HttpStatusCode.OK) { Content = JsonContent.Create(new { minLevel = MinLevel }) };
        }

        var body = await request.Content!.ReadAsStringAsync(cancellationToken);
        _posts.Enqueue(new RelayPost(path[(path.LastIndexOf('/') + 1)..], body, request.Headers.Contains("traceparent")));
        var status = _statuses.TryDequeue(out var queued) ? queued : HttpStatusCode.OK;
        return status == HttpStatusCode.OK
            ? new HttpResponseMessage(status)
            : new HttpResponseMessage(status) { Content = JsonContent.Create(new { title = "failed", status = (int)status }) };
    }

    internal sealed record RelayPost(string Signal, string Body, bool HasTraceParent);
}
