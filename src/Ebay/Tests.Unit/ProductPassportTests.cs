using AwesomeAssertions;
using Server.Domain;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ProductPassport))]
public sealed class ProductPassportTests
{
    [Test]
    public void Create_SetsFieldsFromArguments()
    {
        var productId = Guid.NewGuid();
        var content = new byte[] { 1, 2, 3 };

        var passport = ProductPassport.Create(
            productId: productId,
            fileName: "passport.pdf",
            contentType: "application/pdf",
            order: 2,
            content: content);

        passport.Id.Should().NotBe(Guid.Empty);
        passport.ProductId.Should().Be(productId);
        passport.FileName.Should().Be("passport.pdf");
        passport.ContentType.Should().Be("application/pdf");
        passport.Order.Should().Be(2);
        passport.Content.Should().BeSameAs(content);
    }

    [Test]
    public void SetOrder_UpdatesOrder()
    {
        var passport = ProductPassport.Create(
            productId: Guid.NewGuid(),
            fileName: "passport.pdf",
            contentType: "application/pdf",
            order: 0,
            content: []);

        passport.SetOrder(3);

        passport.Order.Should().Be(3);
    }
}
