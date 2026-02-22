using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace IntegrationTests;

[Parallelizable(ParallelScope.Self)]
public class AuthorizedEndpointTests
{
    [Test]
    public async Task AuthorizedEndpoint_RequiresBearerToken_AndAcceptsClientCredentialsToken()
    {
        using var client = IntegrationTestsSetupFixture.Factory.CreateClient();

        using var unauthorizedResponse = await client.GetAsync("/api/ebay/v1/products");
        Assert.That(unauthorizedResponse.StatusCode, Is.EqualTo(HttpStatusCode.Unauthorized));

        using var tokenResponse = await client.PostAsync(
            "/connect/token",
            new FormUrlEncodedContent(
            [
                new KeyValuePair<string, string>("grant_type", "client_credentials"),
                new KeyValuePair<string, string>("client_id", AuthorizationConstants.TestClientId),
                new KeyValuePair<string, string>("client_secret", AuthorizationConstants.TestClientSecret),
                new KeyValuePair<string, string>("scope", AuthorizationConstants.TestScope)
            ]));

        var tokenPayload = await tokenResponse.Content.ReadAsStringAsync();
        Assert.That(tokenResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK), tokenPayload);

        var token = JsonDocument.Parse(tokenPayload)
            .RootElement
            .GetProperty("access_token")
            .GetString();

        Assert.That(token, Is.Not.Null.And.Not.Empty);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        using var authorizedResponse = await client.GetAsync("/api/ebay/v1/products");
        var authorizedPayload = await authorizedResponse.Content.ReadAsStringAsync();
        Assert.That(authorizedResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK), authorizedPayload);
    }
}
