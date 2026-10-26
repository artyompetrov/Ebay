using AwesomeAssertions;
using Server.Application.Currencies;
using Tests.Shared;

namespace Tests.Integration.Tests;

[TestOf(typeof(DefaultCurrencyService))]
public class DefaultCurrenciesTests
{
    [Test]
    [OpenSpecScenario("default-currencies", "Default currencies exist after start", "Started application has the default currencies")]
    public async Task GetCurrencies_AfterStartOnEmptyDatabase_ContainsDefaultCurrencies()
    {
        // The fixture starts the application on a fresh scratch database, which has no currencies.
        using var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var client = TestHelpers.CreateWebApiClient(httpClient);

        var currencies = await client.GetCurrenciesAsync();

        currencies.Select(static x => x.EbayName).Should().Contain(["USD", "RUB", "EUR", "GBP", "AUD", "CAD", "KZT"]);
    }
}
