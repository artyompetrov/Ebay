using AwesomeAssertions;
using Server.Application;
using Server.Application.Abstractions.Driven.Models;
using Server.Domain.Product;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ProductService))]
public sealed class ProductServiceTests
{
    private const int ProductWeight = 10;

    [TestCase("12AT7W/6201 Tung-Sol", "12at7w/6201 tung-sol")]
    [TestCase("12AT7W/6201 Tung-Sol", @"12AT7W\6201 Tung Sol")]
    [TestCase(@"12AT7W\6201", "12AT7W/6201")]
    public void GetProductRegex_NameWithSlash_MatchesEitherSlash(string productName, string text)
    {
        var regex = ProductService.GetProductRegex(CreateProduct(productName));

        regex.IsMatch(text).Should().BeTrue();
    }

    [Test]
    public void GetProductRegex_NameWithSlash_DoesNotMatchOtherSeparator()
    {
        var regex = ProductService.GetProductRegex(CreateProduct("12AT7W/6201"));

        regex.IsMatch("12AT7W|6201").Should().BeFalse();
    }

    [Test]
    public void GetProductRegex_RuSearchQueryWithSlash_IsIncludedInPattern()
    {
        var product = CreateProduct("6N1P") with { RuSearchQueries = [new SearchQueryWithId(Guid.NewGuid(), "6Н1П/ЕВ")] };

        var regex = ProductService.GetProductRegex(product);

        regex.IsMatch("лампа 6н1п/ев новая").Should().BeTrue();
    }

    private static ProductInfo CreateProduct(string name) => new(
        Id: Guid.NewGuid(),
        Name: name,
        SearchQueries: [],
        RuSearchQueries: [],
        Weight: ProductWeight,
        CalculationResult: null,
        LastCheckTime: DateTimeOffset.UtcNow,
        Description: null);
}
