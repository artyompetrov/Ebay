using System.Diagnostics;
using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OneOf;
using OneOf.Types;
using Polly;
using Polly.Retry;

namespace Server.Adapters.Driven.ScrapingProxy;

/// <summary>
/// Проба главной страницы сайта через прокси и смена внешнего IP прокси, пока проба не пройдёт. ТСПУ режет Cloudflare
/// на части IP мобильного оператора так, что заголовки и первые килобайты приходят, а тело зависает, поэтому проба
/// проходит только если тело пришло целиком за отведённое время.
/// Сервис без состояния: адаптеры собирают по очереди, поэтому две ротации одного прокси не пересекаются, и блокировки
/// здесь не нужны.
/// </summary>
internal sealed class ScrapingProxyExitGuard : IScrapingProxyExitGuard
{
    private const int ProbeBufferSize = 16 * 1024;
    private const string OkStatus = "ok";

    private static readonly ActivitySource ActivitySource = new(WellKnown.Tracing.ActivitySourceName);

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ScrapingProxyOptions _options;
    private readonly TimeProvider _timeProvider;
    private readonly ILogger<ScrapingProxyExitGuard> _logger;
    private readonly ResiliencePipeline<OneOf<Success, Error<string>>>? _rotation;

    public ScrapingProxyExitGuard(
        IHttpClientFactory httpClientFactory,
        IOptions<ScrapingProxyOptions> options,
        TimeProvider timeProvider,
        ILogger<ScrapingProxyExitGuard> logger)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
        _timeProvider = timeProvider;
        _logger = logger;
        _rotation = _options.ChangeIpUri is { } changeIpUri ? BuildRotation(changeIpUri) : null;
    }

    public async Task<OneOf<Success, Error<string>>> EnsureWorkingExitAsync(
        string httpClientName,
        Uri probeUri,
        CancellationToken cancellationToken)
    {
        if (_options.AddressUri is null)
        {
            return new Success();
        }

        if (_rotation is null)
        {
            var single = await ProbeAsync(httpClientName, probeUri, probeNumber: 1, cancellationToken);

            return single.MapT1(error => new Error<string>(
                $"Probe of {probeUri} through the scraping proxy failed and no IP change link is configured: {error.Value}"));
        }

        var probes = 0;
        var result = await _rotation.ExecuteAsync(
            token => new ValueTask<OneOf<Success, Error<string>>>(ProbeAsync(httpClientName, probeUri, ++probes, token)),
            cancellationToken);
        var ipChanges = probes - 1;

        if (result.TryPickT1(out var failure, out var success))
        {
            return new Error<string>(
                $"Probe of {probeUri} through the scraping proxy failed after {ipChanges} IP changes: {failure.Value}");
        }

        if (ipChanges > 0)
        {
            _logger.LogInformation(
                "Scraping proxy probe of {ProbeUri} passed after {IpChanges} IP changes",
                probeUri,
                ipChanges);
        }

        return success;
    }

    private ResiliencePipeline<OneOf<Success, Error<string>>> BuildRotation(Uri changeIpUri) =>
        new ResiliencePipelineBuilder<OneOf<Success, Error<string>>> { TimeProvider = _timeProvider }
            .AddRetry(new RetryStrategyOptions<OneOf<Success, Error<string>>>
            {
                // Повторяется только неудачная проба; исключения (отмена вызывающим, баги) уходят наверх как есть.
                ShouldHandle = static args => ValueTask.FromResult(args.Outcome is { Exception: null, Result.IsT1: true }),
                MaxRetryAttempts = _options.MaxIpChangeAttempts,
                BackoffType = DelayBackoffType.Constant,
                Delay = _options.IpChangeDelay,
                UseJitter = false,
                // Смена IP до паузы: пауза даёт провайдеру время переключить IP перед следующей пробой.
                OnRetry = args => new ValueTask(ChangeIpAsync(changeIpUri, args.AttemptNumber + 1, args.Context.CancellationToken)),
            })
            .Build();

    private async Task<OneOf<Success, Error<string>>> ProbeAsync(
        string httpClientName,
        Uri probeUri,
        int probeNumber,
        CancellationToken cancellationToken)
    {
        using var activity = ActivitySource.StartActivity(WellKnown.Tracing.ProbeSpan);
        activity?.SetTag(WellKnown.Tracing.UrlFullTag, probeUri.ToString());
        activity?.SetTag(WellKnown.Tracing.AttemptTag, probeNumber);

        using var timeout = new CancellationTokenSource(_options.ProbeTimeout, _timeProvider);
        using var linked = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken, timeout.Token);

        string reason;

        try
        {
            var httpClient = _httpClientFactory.CreateClient(httpClientName);
            // Соединение пробы не возвращается в пул: туннель, открытый с прежнего внешнего IP, иначе достался бы
            // следующей пробе после смены IP. Сбор после успешной пробы откроет своё соединение.
            using var request = new HttpRequestMessage(HttpMethod.Get, probeUri) { Headers = { ConnectionClose = true } };
            using var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, linked.Token);

            if (response.IsSuccessStatusCode)
            {
                var bytes = await ReadWholeBodyAsync(response, linked.Token);
                activity?.SetTag(WellKnown.Tracing.ProbeBytesTag, bytes);
                return new Success();
            }

            reason = string.Create(CultureInfo.InvariantCulture, $"status {(int)response.StatusCode}");
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            // Тело не пришло целиком вовремя: сработал таймаут пробы или, если он короче, HttpClient.Timeout клиента.
            reason = timeout.IsCancellationRequested
                ? string.Create(CultureInfo.InvariantCulture, $"probe timeout after {_options.ProbeTimeout.TotalSeconds} s")
                : "HTTP client timeout";
        }
        catch (HttpRequestException e) when (!cancellationToken.IsCancellationRequested)
        {
            reason = $"request error {e.HttpRequestError}: {e.Message}";
        }
        catch (IOException e) when (!cancellationToken.IsCancellationRequested)
        {
            reason = $"response read error: {e.Message}";
        }

        activity?.SetStatus(ActivityStatusCode.Error, reason);
        _logger.LogWarning(
            "Scraping proxy probe {ProbeNumber} of {ProbeUri} failed: {Reason}",
            probeNumber,
            probeUri,
            reason);

        return new Error<string>(reason);
    }

    private static async Task<long> ReadWholeBodyAsync(HttpResponseMessage response, CancellationToken cancellationToken)
    {
        await using var body = await response.Content.ReadAsStreamAsync(cancellationToken);
        var buffer = new byte[ProbeBufferSize];
        long total = 0;
        int read;

        while ((read = await body.ReadAsync(buffer, cancellationToken)) > 0)
        {
            total += read;
        }

        return total;
    }

    /// <summary>
    /// Запрашивает смену внешнего IP. Неудача только логируется: попытка всё равно засчитана, и проба покажет,
    /// сменился ли IP. Ни сообщения исключений, ни сама ссылка не пишутся в лог: в ссылке ключ прокси.
    /// </summary>
    private async Task ChangeIpAsync(Uri changeIpUri, int attempt, CancellationToken cancellationToken)
    {
        using var activity = ActivitySource.StartActivity(WellKnown.Tracing.ChangeIpSpan);
        activity?.SetTag(WellKnown.Tracing.AttemptTag, attempt);

        string failure;

        try
        {
            var httpClient = _httpClientFactory.CreateClient(WellKnown.ChangeIpHttpClientName);
            using var response = await httpClient.GetAsync(changeIpUri, cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                var answer = await response.Content.ReadFromJsonAsync<ChangeIpAnswer>(cancellationToken);

                if (answer is { Status: { } status } && status.Equals(OkStatus, StringComparison.OrdinalIgnoreCase))
                {
                    activity?.SetTag(WellKnown.Tracing.NewIpTag, answer.NewIp);
                    _logger.LogInformation(
                        "Scraping proxy exit IP change {Attempt} requested, new IP {NewIp}",
                        attempt,
                        answer.NewIp);
                    return;
                }

                // Текст сообщения провайдера не пишется: он мог бы повторить ссылку с ключом прокси.
                failure = $"answer status {answer?.Status}";
            }
            else
            {
                failure = string.Create(CultureInfo.InvariantCulture, $"status {(int)response.StatusCode}");
            }
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            failure = "timeout";
        }
        catch (HttpRequestException e) when (!cancellationToken.IsCancellationRequested)
        {
            failure = $"request error {e.HttpRequestError}";
        }
        catch (Exception e) when (e is JsonException or NotSupportedException or InvalidOperationException)
        {
            // Ответ не JSON или в неподдерживаемой кодировке: смена IP всё равно засчитана, ротация продолжается.
            failure = "unreadable answer";
        }

        activity?.SetStatus(ActivityStatusCode.Error, failure);
        _logger.LogWarning("Scraping proxy exit IP change {Attempt} failed: {Failure}", attempt, failure);
    }

    /// <summary>
    /// Ответ ссылки смены IP (<c>format=json</c>); значения <c>status</c> провайдер не документирует, кроме успешного.
    /// </summary>
    private sealed record ChangeIpAnswer(
        [property: JsonPropertyName("status")] string? Status,
        [property: JsonPropertyName("new_ip")] string? NewIp);
}
