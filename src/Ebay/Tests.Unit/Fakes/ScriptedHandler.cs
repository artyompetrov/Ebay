using System.Net;

namespace Tests.Unit.Fakes;

/// <summary>
/// Обработчик, который отвечает по сценарию (номер вызова с нуля) и запоминает запросы со временем их прихода.
/// </summary>
internal sealed class ScriptedHandler : HttpMessageHandler
{
    private readonly TimeProvider _timeProvider;
    private readonly Func<int, HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> _respond;
    private readonly List<RecordedRequest> _requests = [];

    public ScriptedHandler(TimeProvider timeProvider, Func<int, HttpRequestMessage, CancellationToken, Task<HttpResponseMessage>> respond)
    {
        _timeProvider = timeProvider;
        _respond = respond;
    }

    public ScriptedHandler(TimeProvider timeProvider, Func<int, HttpStatusCode> status)
        : this(timeProvider, (call, _, _) => Task.FromResult(new HttpResponseMessage(status(call)) { Content = new StringContent("ok") }))
    {
    }

    public IReadOnlyList<RecordedRequest> Requests
    {
        get
        {
            lock (_requests)
            {
                return [.. _requests];
            }
        }
    }

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        int call;
        lock (_requests)
        {
            call = _requests.Count;
            _requests.Add(new RecordedRequest(
                request.Method,
                request.RequestUri,
                request.Headers.UserAgent.ToString(),
                _timeProvider.GetUtcNow()));
        }

        return _respond(call, request, cancellationToken);
    }

    internal sealed record RecordedRequest(HttpMethod Method, Uri? Uri, string UserAgent, DateTimeOffset At);
}
