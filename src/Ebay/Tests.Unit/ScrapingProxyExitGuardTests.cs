using System.Collections.Concurrent;
using System.Diagnostics;
using System.Net;
using AwesomeAssertions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Time.Testing;
using OneOf;
using OneOf.Types;
using Server.Adapters.Driven.ChipFind;
using Server.Adapters.Driven.ScrapingProxy;
using Server.Application.Abstractions.Driven.Abstractions;
using Tests.Shared;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ScrapingProxyExitGuard))]
public sealed class ScrapingProxyExitGuardTests
{
    private const string SiteClientName = "site";
    private const string ChangeIpClientName = "scraping-proxy-change-ip";
    private const string ProxyKey = "abc123";
    private const string ChangeIpUrl = "https://changeip.mobileproxy.space/?proxy_key=abc123&format=json";

    private static readonly Uri ProbeUri = new("https://www.chipfind.ru/");
    private static readonly TimeSpan IpChangeDelay = TimeSpan.FromSeconds(10);
    private static readonly TimeSpan ProbeTimeout = TimeSpan.FromSeconds(15);

    [Test]
    [OpenSpecScenario("scraping-proxy", "A collection starts with a probe of the site's main page", "Non-success status fails the probe")]
    public async Task EnsureWorkingExit_ForbiddenMainPage_Fails()
    {
        var time = new RotationClock(IpChangeDelay);
        var site = new ScriptedHandler(time, static _ => HttpStatusCode.Forbidden);

        var result = await CreateGuard(time, site, changeIp: null, changeIpUrl: null).EnsureWorkingExitAsync(SiteClientName, ProbeUri, CancellationToken.None);

        result.AsT1.Value.Should().Contain("status 403");
        // Соединение пробы закрывается: туннель с прежнего IP не должен достаться пробе после смены IP.
        site.Requests.Should().ContainSingle().Which.Should().Match<ScriptedHandler.RecordedRequest>(
            static r => r.Method == HttpMethod.Get && r.Uri == ProbeUri && r.ConnectionClose);
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "A collection starts with a probe of the site's main page", "Body that stops arriving fails the probe")]
    public async Task EnsureWorkingExit_BodyStalls_FailsOnProbeTimeout()
    {
        var time = new RotationClock(IpChangeDelay);
        var bodyStarted = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        var site = new ScriptedHandler(time, (_, _, _) => Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StreamContent(new StallingStream(bodyStarted)),
        }));

        var probe = CreateGuard(time, site, changeIp: null, changeIpUrl: null).EnsureWorkingExitAsync(SiteClientName, ProbeUri, CancellationToken.None);
        await bodyStarted.Task;
        time.Advance(ProbeTimeout);

        (await probe).AsT1.Value.Should().Contain("timeout");
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "A collection starts with a probe of the site's main page", "Unreachable site fails the probe")]
    public async Task EnsureWorkingExit_ConnectionError_Fails()
    {
        var time = new RotationClock(IpChangeDelay);
        var site = new ScriptedHandler(time, static (_, _, _) =>
            throw new HttpRequestException(HttpRequestError.ConnectionError, "Connection refused"));

        var result = await CreateGuard(time, site, changeIp: null, changeIpUrl: null).EnsureWorkingExitAsync(SiteClientName, ProbeUri, CancellationToken.None);

        result.AsT1.Value.Should().Contain(nameof(HttpRequestError.ConnectionError));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "A collection without a working exit IP ends with an error", "Failed probe without an IP change link")]
    public async Task EnsureWorkingExit_NoChangeIpUrl_ProbesOnceAndFails()
    {
        var time = new RotationClock(IpChangeDelay);
        var site = new ScriptedHandler(time, static _ => HttpStatusCode.Forbidden);

        var result = await CreateGuard(time, site, changeIp: null, changeIpUrl: null).EnsureWorkingExitAsync(SiteClientName, ProbeUri, CancellationToken.None);

        result.IsT1.Should().BeTrue();
        site.Requests.Should().ContainSingle();
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "A failed probe switches the proxy exit IP and probes again", "Passing first probe keeps the current exit IP")]
    public async Task EnsureWorkingExit_FirstProbePasses_DoesNotChangeIp()
    {
        var time = new RotationClock(IpChangeDelay);
        var site = new ScriptedHandler(time, static _ => HttpStatusCode.OK);
        var changeIp = ExitGuardTestKit.ChangeIpHandler(time);

        var result = await CreateGuard(time, site, changeIp).EnsureWorkingExitAsync(SiteClientName, ProbeUri, CancellationToken.None);

        result.IsT0.Should().BeTrue();
        changeIp.Requests.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "A failed probe switches the proxy exit IP and probes again", "Probe passes after several IP changes")]
    public async Task EnsureWorkingExit_PassesAfterThreeFailures_ChangesIpThreeTimesWithDelay()
    {
        var time = new RotationClock(IpChangeDelay);
        var site = new ScriptedHandler(time, static call => call < 3 ? HttpStatusCode.Forbidden : HttpStatusCode.OK);
        var changeIp = ExitGuardTestKit.ChangeIpHandler(time);

        var result = await ExitGuardTestKit.AdvanceUntilDoneAsync(time, CreateGuard(time, site, changeIp, maxIpChangeAttempts: 20)
            .EnsureWorkingExitAsync(SiteClientName, ProbeUri, CancellationToken.None));

        result.IsT0.Should().BeTrue();
        site.Requests.Should().HaveCount(4);
        changeIp.Requests.Should().HaveCount(3);
        changeIp.Requests.Should().AllSatisfy(static r => r.Uri.Should().Be(new Uri(ChangeIpUrl)));

        for (var i = 0; i < 3; i++)
        {
            // Смена IP идёт после неудачной пробы, следующая проба - не раньше, чем через паузу после смены.
            changeIp.Requests[i].At.Should().BeOnOrAfter(site.Requests[i].At);
            (site.Requests[i + 1].At - changeIp.Requests[i].At).Should().BeGreaterThanOrEqualTo(IpChangeDelay);
        }
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "A failed probe switches the proxy exit IP and probes again", "Failed IP change request still counts as an attempt")]
    public async Task EnsureWorkingExit_FailedIpChangeRequest_CountsAsAttempt()
    {
        var time = new RotationClock(IpChangeDelay);
        var site = new ScriptedHandler(time, static _ => HttpStatusCode.Forbidden);
        var changeIp = new ScriptedHandler(time, static (call, _, _) => Task.FromResult(call == 0
            ? new HttpResponseMessage(HttpStatusCode.InternalServerError)
            : new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(ExitGuardTestKit.ChangeIpOkAnswer) }));

        var result = await ExitGuardTestKit.AdvanceUntilDoneAsync(time, CreateGuard(time, site, changeIp, maxIpChangeAttempts: 2)
            .EnsureWorkingExitAsync(SiteClientName, ProbeUri, CancellationToken.None));

        result.AsT1.Value.Should().Contain("after 2 IP changes");
        changeIp.Requests.Should().HaveCount(2);
        site.Requests.Should().HaveCount(3);
    }

    [Test]
    public async Task EnsureWorkingExit_UnreadableIpChangeAnswer_ContinuesRotation()
    {
        var time = new RotationClock(IpChangeDelay);
        var site = new ScriptedHandler(time, static call => call == 0 ? HttpStatusCode.Forbidden : HttpStatusCode.OK);
        var changeIp = new ScriptedHandler(time, static (_, _, _) =>
            Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent("<html>not json</html>") }));

        var result = await ExitGuardTestKit.AdvanceUntilDoneAsync(time, CreateGuard(time, site, changeIp)
            .EnsureWorkingExitAsync(SiteClientName, ProbeUri, CancellationToken.None));

        result.IsT0.Should().BeTrue();
        changeIp.Requests.Should().ContainSingle();
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "A failed probe switches the proxy exit IP and probes again", "Cancellation ends the rotation without an error result")]
    public async Task EnsureWorkingExit_CancelledDuringDelay_ThrowsCancellationWithoutMoreIpChanges()
    {
        var time = new RotationClock(IpChangeDelay);
        var site = new ScriptedHandler(time, static _ => HttpStatusCode.Forbidden);
        var changeIp = ExitGuardTestKit.ChangeIpHandler(time);
        using var cancellation = new CancellationTokenSource();

        var ensure = CreateGuard(time, site, changeIp).EnsureWorkingExitAsync(SiteClientName, ProbeUri, cancellation.Token);
        await time.WaitForDelayAsync();
        changeIp.Requests.Should().ContainSingle();
        await cancellation.CancelAsync();
        time.Advance(IpChangeDelay);

        await FluentActions.Awaiting(() => ensure).Should().ThrowAsync<OperationCanceledException>();
        changeIp.Requests.Should().ContainSingle();
        site.Requests.Should().ContainSingle();
    }

    [Test]
    public async Task EnsureWorkingExit_NoProxyAddress_DoesNotProbe()
    {
        var time = new RotationClock(IpChangeDelay);
        var site = new ScriptedHandler(time, static _ => HttpStatusCode.Forbidden);
        var guard = new ScrapingProxyExitGuard(
            new NamedClientFactory(new Dictionary<string, HttpMessageHandler> { [SiteClientName] = site }),
            Options.Create(new ScrapingProxyOptions()),
            time,
            NullLogger<ScrapingProxyExitGuard>.Instance);

        var result = await guard.EnsureWorkingExitAsync(SiteClientName, ProbeUri, CancellationToken.None);

        result.IsT0.Should().BeTrue();
        site.Requests.Should().BeEmpty();
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "The IP change link is not exposed", "Rotation logs do not contain the proxy key")]
    public async Task Rotation_OnRealRegistrations_LogsAndErrorDoNotContainProxyKey()
    {
        var logs = new RecordingLoggerProvider();

        var rotation = await RunRotationOnRealRegistrationsAsync(logs);

        rotation.ChangeIpRequests.Should().Be(1);
        rotation.Error.Should().Contain(nameof(HttpRequestError.ProxyTunnelError)).And.NotContain(ProxyKey);
        logs.Records.Should().Contain(static r => r.Contains("exit IP change 1 requested", StringComparison.Ordinal));
        logs.Records.Should().NotContain(static r => r.Contains(ProxyKey, StringComparison.Ordinal));
    }

    [Test]
    [OpenSpecScenario("scraping-proxy", "The IP change link is not exposed", "Rotation traces do not contain the proxy key")]
    public async Task Rotation_OnRealRegistrations_SpansDoNotContainProxyKey()
    {
        using var testSource = new ActivitySource(nameof(Rotation_OnRealRegistrations_SpansDoNotContainProxyKey));
        var stopped = new ConcurrentQueue<Activity>();
        var traceId = default(ActivityTraceId);
        // Записываются только спаны трассы этого теста, чтобы не задевать параллельные тесты, проверяющие свои спаны.
        using var listener = new ActivityListener
        {
            ShouldListenTo = static _ => true,
            Sample = (ref ActivityCreationOptions<ActivityContext> options) =>
                options.Source == testSource || (traceId != default && options.Parent.TraceId == traceId)
                    ? ActivitySamplingResult.AllDataAndRecorded
                    : ActivitySamplingResult.None,
            ActivityStopped = stopped.Enqueue,
        };
        ActivitySource.AddActivityListener(listener);

        (int ChangeIpRequests, string Error, Uri ChangeIpBase) rotation;
        using (var root = testSource.StartActivity("test"))
        {
            root.Should().NotBeNull();
            traceId = root!.TraceId; // StartActivity даёт null только без слушателя, а он добавлен выше.
            rotation = await RunRotationOnRealRegistrationsAsync(logs: null);
        }

        rotation.ChangeIpRequests.Should().Be(1);

        var spans = stopped.Where(a => a.TraceId == traceId).ToArray();
        // Спаны смены IP и самого HTTP-запроса к ссылке есть, но ключа прокси нет ни в одном теге.
        spans.Should().Contain(static a => a.OperationName == "scraping-proxy.change-ip");
        spans.Should().Contain(a => a.Source.Name == "System.Net.Http"
            && a.Tags.Any(t => t.Key == "url.full" && t.Value!.StartsWith(rotation.ChangeIpBase.ToString(), StringComparison.Ordinal)));
        spans.SelectMany(static a => a.TagObjects).Should().NotContain(static t => $"{t.Value}".Contains(ProxyKey, StringComparison.Ordinal));
        spans.Select(static a => a.StatusDescription ?? "").Should().NotContain(static d => d.Contains(ProxyKey, StringComparison.Ordinal));
    }

    /// <summary>
    /// Сбор chipfind на настоящих регистрациях: прокси-заглушка отвечает 502 (проба не проходит), ссылка смены IP
    /// указывает на loopback-сервер, одна смена IP, время поддельное.
    /// </summary>
    private static async Task<(int ChangeIpRequests, string Error, Uri ChangeIpBase)> RunRotationOnRealRegistrationsAsync(RecordingLoggerProvider? logs)
    {
        // Пауза по умолчанию (10 с) совпадает с IpChangeDelay теста.
        var time = new RotationClock(IpChangeDelay);
        await using var proxy = new StubProxy(requireAuthentication: false);
        await using var changeIpServer = new LoopbackHttpServer(ExitGuardTestKit.ChangeIpOkAnswer);
        await using var services = ScrapingProxyServices.Build(
            services =>
            {
                services.AddSingleton<TimeProvider>(time);
                if (logs is not null)
                {
                    services.AddLogging(builder => builder.AddProvider(logs).SetMinimumLevel(LogLevel.Trace));
                }

                services.AddChipFindAdapter();
            },
            proxy.Address,
            withCredentials: false,
            new Dictionary<string, string?>
            {
                ["ScrapingProxy:ChangeIpUrl"] = $"{changeIpServer.BaseAddress}?proxy_key={ProxyKey}&format=json",
                ["ScrapingProxy:MaxIpChangeAttempts"] = "1",
            });

        var result = await ExitGuardTestKit.AdvanceUntilDoneAsync(
            time,
            services.GetRequiredService<ISaleAdvertisementAdapter>().GetRecentAdvertisementsAsync(CancellationToken.None));

        return (changeIpServer.RequestCount, result.AsT1.Value, changeIpServer.BaseAddress);
    }

    private static ScrapingProxyExitGuard CreateGuard(
        FakeTimeProvider time,
        ScriptedHandler site,
        ScriptedHandler? changeIp,
        string? changeIpUrl = ChangeIpUrl,
        int maxIpChangeAttempts = 20)
    {
        var handlers = new Dictionary<string, HttpMessageHandler> { [SiteClientName] = site };
        if (changeIp is not null)
        {
            handlers[ChangeIpClientName] = changeIp;
        }

        return new ScrapingProxyExitGuard(
            new NamedClientFactory(handlers),
            Options.Create(new ScrapingProxyOptions
            {
                Address = "http://proxy.example:8080",
                ChangeIpUrl = changeIpUrl,
                MaxIpChangeAttempts = maxIpChangeAttempts,
                ProbeTimeout = ProbeTimeout,
                IpChangeDelay = IpChangeDelay,
            }),
            time,
            NullLogger<ScrapingProxyExitGuard>.Instance);
    }

    /// <summary>
    /// Тело ответа, которое отдаёт первые байты и замирает, как при замедлении ТСПУ, пока чтение не отменят.
    /// </summary>
    private sealed class StallingStream : Stream
    {
        private readonly TaskCompletionSource _started;
        private bool _firstChunkSent;

        public StallingStream(TaskCompletionSource started)
        {
            _started = started;
        }

        public override bool CanRead => true;

        public override bool CanSeek => false;

        public override bool CanWrite => false;

        public override long Length => throw new NotSupportedException();

        public override long Position
        {
            get => throw new NotSupportedException();
            set => throw new NotSupportedException();
        }

        public override async ValueTask<int> ReadAsync(Memory<byte> buffer, CancellationToken cancellationToken = default)
        {
            if (!_firstChunkSent)
            {
                _firstChunkSent = true;
                buffer.Span[0] = (byte)'<';
                return 1;
            }

            _started.TrySetResult();
            await Task.Delay(Timeout.Infinite, cancellationToken);
            return 0;
        }

        public override int Read(byte[] buffer, int offset, int count) => throw new NotSupportedException();

        public override void Flush()
        {
        }

        public override long Seek(long offset, SeekOrigin origin) => throw new NotSupportedException();

        public override void SetLength(long value) => throw new NotSupportedException();

        public override void Write(byte[] buffer, int offset, int count) => throw new NotSupportedException();
    }
}
