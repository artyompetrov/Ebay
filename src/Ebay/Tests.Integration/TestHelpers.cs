using System.Net.Http.Headers;
using System.Text.Json;
using Client.Clients.Generated;
using Polly;
using Polly.Timeout;

namespace Tests.Integration;

public static class TestHelpers
{
    public static Task RetryUntilValidationSuccessAsync(
        Func<Task> assertAction,
        int timeout = 30)
    {
        AssertionException? lastAssertion = null;

        var retryPolicy = Policy
            .Handle<AssertionException>()
            .WaitAndRetryForeverAsync(
                sleepDurationProvider: _ => TimeSpan.FromMilliseconds(250),
                onRetry: (exception, _) => lastAssertion = exception as AssertionException);
        var timeoutPolicy = Policy.TimeoutAsync(TimeSpan.FromSeconds(timeout));
        var policy = Policy.WrapAsync(timeoutPolicy, retryPolicy);

        return ExecuteAsync();

        async Task ExecuteAsync()
        {
            try
            {
                await policy.ExecuteAsync(_ => assertAction(), CancellationToken.None);
            }
            catch (TimeoutRejectedException) when (lastAssertion != null)
            {
                Assert.Fail(
                    $"Assertion did not pass in {timeout:F1}s. Last assertion: {lastAssertion.Message}");
            }
        }
    }

    public static async Task AuthenticateWithClientCredentialsAsync(HttpClient client)
    {
        var token = await RequestClientCredentialsTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }

    public static EbayClient CreateEbayClient(HttpClient httpClient) => new(httpClient);

    private static async Task<string> RequestClientCredentialsTokenAsync(HttpClient client)
    {
        using var tokenResponse = await client.PostAsync(
            "/connect/token",
            new FormUrlEncodedContent(
            [
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("client_id", IntegrationTestsSetupFixture.AuthorizationClientId),
                new KeyValuePair<string, string>("client_secret", IntegrationTestsSetupFixture.AuthorizationClientSecret),
                new KeyValuePair<string, string>("scope", IntegrationTestsSetupFixture.AuthorizationClientScope)
            ]));

        var tokenPayload = await tokenResponse.Content.ReadAsStringAsync();
        Assert.That(tokenResponse.StatusCode, Is.EqualTo(System.Net.HttpStatusCode.OK), tokenPayload);

        var token = JsonDocument.Parse(tokenPayload)
            .RootElement
            .GetProperty("access_token")
            .GetString();

        Assert.That(token, Is.Not.Null.And.Not.Empty);
        return token!;
    }
}
