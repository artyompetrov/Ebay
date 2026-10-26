using System.Diagnostics;
using System.Net.Http.Headers;
using Microsoft.Extensions.Logging;

namespace Client.Telemetry;

/// <summary>
/// Records a client span for every call of the <c>ServerAPI</c> client. A backend call gets a sampled
/// <c>traceparent</c> naming that span, so the backend's server span becomes its child; any other host gets no trace
/// context. At the served <c>Trace</c> level the bodies of backend calls are logged, cut to 4 KB.
/// </summary>
internal sealed class TracingMessageHandler : DelegatingHandler
{
    /// <summary>Category of the body records; outside <c>Client.Telemetry</c>, which is never exported.</summary>
    public const string BodyLogCategory = "Client.Http";

    private const string TraceParentHeader = "traceparent";
    private const int FirstServerErrorStatus = 500;

    private readonly FrontendTracer _tracer;
    private readonly TelemetryLevel _level;
    private readonly ILogger _bodyLogger;
    private readonly Uri _backendBaseAddress;

    public TracingMessageHandler(FrontendTracer tracer, TelemetryLevel level, ILoggerFactory loggerFactory, Uri backendBaseAddress)
    {
        _tracer = tracer;
        _level = level;
        _bodyLogger = loggerFactory.CreateLogger(BodyLogCategory);
        _backendBaseAddress = backendBaseAddress;
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        if (request.RequestUri is not { IsAbsoluteUri: true } uri)
        {
            throw new UnreachableException("HttpClient makes the request URI absolute before its handlers run.");
        }

        var method = request.Method.Method;
        var path = uri.AbsolutePath;
        var isBackend = _backendBaseAddress.IsBaseOf(uri);
        using var activity = _tracer.StartActivity(method + " " + path, ActivityKind.Client);
        request.Headers.Remove(TraceParentHeader);
        if (activity is not null)
        {
            activity.SetTag("http.request.method", method);
            activity.SetTag("server.address", uri.Host);
            activity.SetTag("server.port", uri.Port);
            activity.SetTag("url.scheme", uri.Scheme);
            activity.SetTag("url.path", path);
            if (isBackend)
            {
                request.Headers.TryAddWithoutValidation(TraceParentHeader, $"00-{activity.TraceId.ToHexString()}-{activity.SpanId.ToHexString()}-01");
            }
        }

        var logBodies = isBackend && _level.Allows(LogLevel.Trace);
        if (logBodies && request.Content is { } requestContent && IsText(requestContent.Headers.ContentType))
        {
            _bodyLogger.LogTrace("Backend request {Method} {Path}: {Body}", method, path, await ReadBodyAsync(requestContent, cancellationToken));
        }

        HttpResponseMessage response;
        try
        {
            response = await base.SendAsync(request, cancellationToken);
        }
        catch (Exception exception)
        {
            FrontendTracer.RecordException(activity, exception);
            throw;
        }

        var status = (int)response.StatusCode;
        activity?.SetTag("http.response.status_code", status);
        if (status >= FirstServerErrorStatus)
        {
            activity?.SetTag("error.type", status.ToString(System.Globalization.CultureInfo.InvariantCulture));
            activity?.SetStatus(ActivityStatusCode.Error);
        }

        if (logBodies && IsText(response.Content.Headers.ContentType))
        {
            await response.Content.LoadIntoBufferAsync(cancellationToken);
            _bodyLogger.LogTrace("Backend response {Method} {Path} {StatusCode}: {Body}", method, path, status, await ReadBodyAsync(response.Content, cancellationToken));
        }

        return response;
    }

    private static bool IsText(MediaTypeHeaderValue? contentType) =>
        contentType?.MediaType is { } mediaType
        && (mediaType.StartsWith("text/", StringComparison.OrdinalIgnoreCase) || mediaType.Contains("json", StringComparison.OrdinalIgnoreCase));

    private static async Task<string> ReadBodyAsync(HttpContent content, CancellationToken cancellationToken) =>
        OtlpJsonSerializer.Clean(await content.ReadAsStringAsync(cancellationToken));
}
