using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Tests.Integration.Tests;

[Parallelizable(ParallelScope.Self)]
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