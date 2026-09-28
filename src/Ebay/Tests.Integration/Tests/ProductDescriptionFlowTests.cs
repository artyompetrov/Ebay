using Tests.Shared;
using AwesomeAssertions;
using Client.Clients.Generated;

namespace Tests.Integration.Tests;

public class ProductDescriptionFlowTests
{
    [Test]
    [OpenSpecScenario("product-description", "Product description storage", "Setting a description on a product")]
    public async Task CreateAndGetProduct_RoundTripsDescription()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var ebayClient = TestHelpers.CreateWebApiClient(httpClient);

        var product = new ProductWithoutId
        {
            Name = $"integration-product-{Guid.NewGuid():N}",
            Weight = 100,
            SearchQueries = [new SearchQuery { Id = Guid.NewGuid(), Query = "integration product" }],
            RuSearchQueries = [],
            Description = "<p>Custom seller description</p>"
        };
        var productId = await ebayClient.CreateProductAsync(product);

        var fetched = await ebayClient.GetProductAsync(productId);

        fetched.Description.Should().Be("<p>Custom seller description</p>");
    }

    [Test]
    [OpenSpecScenario("product-description", "eBay listing description page shows the product description", "Description rendered above existing content")]
    public async Task EbayDescriptionPage_RendersDescriptionAboveExistingSections_WhenProductHasDescription()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var ebayClient = TestHelpers.CreateWebApiClient(httpClient);

        var product = new ProductWithoutId
        {
            Name = $"integration-product-{Guid.NewGuid():N}",
            Weight = 100,
            SearchQueries = [new SearchQuery { Id = Guid.NewGuid(), Query = "integration product" }],
            RuSearchQueries = [],
            Description = "<p>Custom seller description</p>"
        };
        var productId = await ebayClient.CreateProductAsync(product);

        var html = await httpClient.GetStringAsync($"/ebay_description/{productId}?measurementState=Created&state=New");

        html.Should().Contain("Custom seller description");

        var descriptionIndex = html.IndexOf("Custom seller description", StringComparison.Ordinal);
        var shippingSectionIndex = html.IndexOf("Shipping", StringComparison.Ordinal);
        descriptionIndex.Should().BeLessThan(shippingSectionIndex);
    }

    [Test]
    [OpenSpecScenario("product-description", "Product description storage", "Product without a description")]
    [OpenSpecScenario("product-description", "eBay listing description page shows the product description", "No description means unchanged page")]
    public async Task EbayDescriptionPage_HasNoCustomDescription_WhenProductHasNoDescription()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var ebayClient = TestHelpers.CreateWebApiClient(httpClient);
        var productId = await TestHelpers.CreateProductAsync(ebayClient);

        var fetched = await ebayClient.GetProductAsync(productId);
        fetched.Description.Should().BeNullOrEmpty();

        var html = await httpClient.GetStringAsync($"/ebay_description/{productId}?measurementState=Created&state=New");
        html.Should().Contain("Shipping");
    }

    [Test]
    [OpenSpecScenario("product-description", "Product description storage", "Clearing an existing description")]
    public async Task UpdateProduct_WithEmptyDescription_ClearsStoredDescription()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var ebayClient = TestHelpers.CreateWebApiClient(httpClient);

        var product = new ProductWithoutId
        {
            Name = $"integration-product-{Guid.NewGuid():N}",
            Weight = 100,
            SearchQueries = [new SearchQuery { Id = Guid.NewGuid(), Query = "integration product" }],
            RuSearchQueries = [],
            Description = "<p>Custom seller description</p>"
        };
        var productId = await ebayClient.CreateProductAsync(product);
        var created = await ebayClient.GetProductAsync(productId);

        var update = ToProductWithoutId(created);
        update.Description = null;
        await ebayClient.UpdateProductAsync(update, productId);

        var updated = await ebayClient.GetProductAsync(productId);
        updated.Description.Should().BeNullOrEmpty();
    }

    private static ProductWithoutId ToProductWithoutId(ProductWithId product) => new()
    {
        Name = product.Name,
        SearchQueries = product.SearchQueries,
        RuSearchQueries = product.RuSearchQueries,
        Weight = product.Weight,
        Description = product.Description
    };
}
