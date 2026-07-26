using System.IO.Compression;
using System.Net.Http.Headers;
using System.Text.Json;
using Client.Clients.Generated;
using Polly;
using Polly.Timeout;
using SkiaSharp;

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

    public static WebApiClient CreateWebApiClient(HttpClient httpClient) => new(httpClient);

    public static async Task<Guid> CreateProductAsync(EbayClient ebayClient)
    {
        var product = new ProductWithoutId
        {
            Name = $"integration-product-{Guid.NewGuid():N}",
            Weight = 100,
            SearchQueries =
            [
                new SearchQuery
                {
                    Id = Guid.NewGuid(),
                    Query = "integration product"
                }
            ],
            RuSearchQueries = []
        };

        return await ebayClient.CreateProductAsync(product);
    }

    public static byte[] CreateValidMeasurementArchive(int randomSeed)
    {
        var config = string.Join('\n',
        [
            "9 number of stepping variables",
            "30 Variable 1 number of intervals",
            "4 measurement type",
            "0 Y2 axis variable",
            "12000 Pmax"
        ]);

        var data = string.Join('\n',
        [
            "Curve  Ia (mA)  Is (mA)  Vg (V)  Va (V)  Vs (V)  Vf (V)",
            "1  1.2  0.0  -1.0  100.0  100.0  6.3",
            "1  2.1  0.0  -0.5  150.0  150.0  6.3",
            $"1  {2.8 + randomSeed / 1000.0:0.000}  0.0  0.0  {200 + randomSeed}.0  {200 + randomSeed}.0  6.3"
        ]);

        using var stream = new MemoryStream();
        using (var archive = new ZipArchive(stream, ZipArchiveMode.Create, leaveOpen: true))
        {
            var configEntry = archive.CreateEntry("anode_curves.uts");
            using (var writer = new StreamWriter(configEntry.Open()))
            {
                writer.Write(config);
            }

            var dataEntry = archive.CreateEntry("anode_curves.uts.utd");
            using (var writer = new StreamWriter(dataEntry.Open()))
            {
                writer.Write(data);
            }
        }

        return stream.ToArray();
    }

    public static byte[] CreateValidPhotoBytes(byte colorSeed = 0)
    {
        using var bitmap = new SKBitmap(2, 2);
        bitmap.Erase(new SKColor(colorSeed, colorSeed, colorSeed));
        using var image = SKImage.FromBitmap(bitmap);
        using var data = image.Encode(SKEncodedImageFormat.Png, quality: 100);
        return data.ToArray();
    }

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