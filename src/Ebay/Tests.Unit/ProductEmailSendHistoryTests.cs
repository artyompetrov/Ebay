using AwesomeAssertions;
using Server.Domain;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ProductEmailSendHistory))]
public sealed class ProductEmailSendHistoryTests
{
    [Test]
    public void Create_SetsFieldsFromArguments()
    {
        var productId = Guid.NewGuid();
        var advertisementDate = DateTimeOffset.UtcNow;

        var history = ProductEmailSendHistory.Create(
            productId: productId,
            seller: "seller",
            link: "http://example.com/1",
            marketplace: "Chipfind",
            isAmbiguous: true,
            advertisementDate: advertisementDate,
            contact: "seller@example.com");

        history.Id.Should().NotBe(Guid.Empty);
        history.ProductId.Should().Be(productId);
        history.Seller.Should().Be("seller");
        history.Link.Should().Be("http://example.com/1");
        history.Marketplace.Should().Be("Chipfind");
        history.IsAmbiguous.Should().BeTrue();
        history.AdvertisementDate.Should().Be(advertisementDate);
        history.Contact.Should().Be("seller@example.com");
    }

    [Test]
    public void UpdateForNewAdvertisement_UpdatesLinkDateAndAmbiguity()
    {
        var history = ProductEmailSendHistory.Create(
            productId: Guid.NewGuid(),
            seller: "seller",
            link: "http://example.com/1",
            marketplace: "Chipfind",
            isAmbiguous: false,
            advertisementDate: DateTimeOffset.UtcNow.AddDays(-1),
            contact: null);
        var newDate = DateTimeOffset.UtcNow;

        history.UpdateForNewAdvertisement(
            link: "http://example.com/2",
            advertisementDate: newDate,
            isAmbiguous: true,
            contact: "seller@example.com");

        history.Link.Should().Be("http://example.com/2");
        history.AdvertisementDate.Should().Be(newDate);
        history.IsAmbiguous.Should().BeTrue();
        history.Contact.Should().Be("seller@example.com");
    }

    [Test]
    public void UpdateForNewAdvertisement_WhenContactIsBlank_DoesNotOverwriteExistingContact()
    {
        var history = ProductEmailSendHistory.Create(
            productId: Guid.NewGuid(),
            seller: "seller",
            link: "http://example.com/1",
            marketplace: "Chipfind",
            isAmbiguous: false,
            advertisementDate: DateTimeOffset.UtcNow.AddDays(-1),
            contact: "seller@example.com");

        history.UpdateForNewAdvertisement(
            link: "http://example.com/2",
            advertisementDate: DateTimeOffset.UtcNow,
            isAmbiguous: false,
            contact: "   ");

        history.Contact.Should().Be("seller@example.com");
    }
}
