namespace Tests.Integration.Tests;

public class AuthorizedEndpointTests
{
    [Test]
    public async Task AuthorizedEndpoint_RequiresBearerToken_AndAcceptsClientCredentialsToken()
    {
        using var client = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(client);
        var ebayClient = TestHelpers.CreateEbayClient(client);

        var response = await ebayClient.GetAllProductsAsync(CancellationToken.None);

        Assert.That(response, Is.Empty);
    }
}