using System.Net.Http.Headers;
using Client.Clients.Generated;
using Newtonsoft.Json.Linq;
using Server;

namespace Tests
{
    public abstract class ExplicitTestsBase
    {
        protected static HttpClient HttpClient { get; set; } = null!;
        protected static readonly string Server =
            Environment.GetEnvironmentVariable("EBAY_HELPER_REMOTE_HOST") ??
            throw new InvalidOperationException("EBAY_HELPER_REMOTE_HOST environment variable is required");

        protected static EbayClient BackendClient { get; set; } = null!;

        static ExplicitTestsBase()
        {
            CreateClient();
        }


        [OneTimeTearDown]
        public void OneTimeTearDown() => HttpClient?.Dispose();

        private static void CreateClient()
        {
            var port = 443;
            var baseAddress = $"https://{Server}:{port}";

            var url = $"{baseAddress}/connect/token";
            HttpClient = new HttpClient();

            var clientId = Environment.GetEnvironmentVariable(WellKnown.Authorization.ClientId)
                           ?? throw new InvalidOperationException("CLIENT_ID is not set");
            var clientSecret = Environment.GetEnvironmentVariable(WellKnown.Authorization.ClientSecret)
                               ?? throw new InvalidOperationException("AUTH_CLIENT_SECRET is not set");
            var scope = Environment.GetEnvironmentVariable(WellKnown.Authorization.Scope)
                       ?? throw new InvalidOperationException("AUTH_SCOPE is not set");

            using var res = HttpClient.SendAsync(
                    new HttpRequestMessage(method: HttpMethod.Post, requestUri: url)
                    {
                        Content = new FormUrlEncodedContent(
                            new List<KeyValuePair<string, string>>
                            {
                                new(key: "grant_type", value: "client_credentials"),
                                new(key: "client_id", value: clientId),
                                new(key: "client_secret", value: clientSecret),
                                new(key: "scope", value: scope),
                            }
                        )
                    }
                )
                .GetAwaiter()
                .GetResult();

            var token = JToken.Parse(res.Content.ReadAsStringAsync().GetAwaiter().GetResult())["access_token"]!.ToString();

            HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(scheme: "Bearer", parameter: token);

            BackendClient = new EbayClient(HttpClient) { BaseUrl = baseAddress + "/api/ebay/v1" };
        }
    }
}