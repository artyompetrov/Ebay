using AwesomeAssertions;
using Server.Application.New;
using Tests.Shared;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ProductDescriptionSanitizer))]
public sealed class ProductDescriptionSanitizerTests
{
    [Test]
    [OpenSpecScenario("product-description", "Product description is sanitized", "Script content is stripped")]
    public void Sanitize_ScriptTag_IsRemoved()
    {
        var sanitizer = new ProductDescriptionSanitizer();

        var result = sanitizer.Sanitize("<p>Great tube</p><script>alert('xss')</script>");

        result.Should().NotContain("<script").And.NotContain("alert");
    }

    [Test]
    [OpenSpecScenario("product-description", "Product description is sanitized", "Script content is stripped")]
    public void Sanitize_EventHandlerAttribute_IsRemoved()
    {
        var sanitizer = new ProductDescriptionSanitizer();

        var result = sanitizer.Sanitize("<p onclick=\"alert('xss')\">Great tube</p>");

        result.Should().NotContain("onclick").And.NotContain("alert");
    }

    [Test]
    [OpenSpecScenario("product-description", "Product description is sanitized", "Safe formatting is preserved")]
    public void Sanitize_SafeFormatting_IsPreserved()
    {
        var sanitizer = new ProductDescriptionSanitizer();
        const string input = "<h2>Title</h2><p>Some <b>bold</b> and <i>italic</i> text.</p><ul><li>Item</li></ul><a href=\"https://example.com\">link</a>";

        var result = sanitizer.Sanitize(input);

        using (Assert.EnterMultipleScope())
        {
            result.Should().Contain("<h2>Title</h2>");
            result.Should().Contain("<b>bold</b>");
            result.Should().Contain("<i>italic</i>");
            result.Should().Contain("<li>Item</li>");
            result.Should().Contain("href=\"https://example.com\"");
        }
    }
}
