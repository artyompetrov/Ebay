using System.Net.Http.Headers;
using Client.Clients.Generated;
using Newtonsoft.Json.Linq;
using Server;

namespace Tests;

public abstract class ExplicitTestsBase
{
    protected static HttpClient HttpClient = null!;
    protected const string Server = "radiotubes.kz";
    protected static EbayClient BackendClient = null!;

    static ExplicitTestsBase()
    {
        CreateClient();
    }


    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        HttpClient.Dispose();
    }

    private static void CreateClient()
    {
        var port = 443;
        var baseAddress = $"https://{Server}:{port}";

        var url = $"{baseAddress}/connect/token";
        HttpClient = new HttpClient();

        using var res = HttpClient.SendAsync(
                new HttpRequestMessage(method: HttpMethod.Post, requestUri: url)
                {
                    Content = new FormUrlEncodedContent(
                        new List<KeyValuePair<string, string>>
                        {
                            new(key: "grant_type", value: "client_credentials"),
                            new(key: "client_id", value: WellKnown.Authorization.PythonClientId),
                            new(key: "client_secret", value: WellKnown.Authorization.ClientSecret),
                            new(key: "scope", value: WellKnown.Authorization.Scope),
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