using AwesomeAssertions;
using Server.Domain;
using Tests.Shared;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ProductEmailSendHistory))]
public sealed class ProductEmailSendHistoryTests
{

    private static readonly DateTimeOffset October1 = new(2026, 10, 1, 0, 0, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset October15 = new(2026, 10, 15, 0, 0, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset June20 = new(2026, 6, 20, 0, 0, 0, TimeSpan.Zero);

    [Test]
    public void Create_SetsFieldsFromArguments()
    {
        var productId = Guid.NewGuid();

        var history = ProductEmailSendHistory.Create(
            productId: productId,
            sellerKey: "seller-key",
            sellerName: "Seller Name",
            link: "http://example.com/1",
            marketplace: "Chipfind",
            isAmbiguous: true,
            advertisementDate: October1,
            contact: "seller@example.com");

        history.Id.Should().NotBe(Guid.Empty);
        history.ProductId.Should().Be(productId);
        history.SellerKey.Should().Be("seller-key");
        history.SellerName.Should().Be("Seller Name");
        history.Link.Should().Be("http://example.com/1");
        history.Marketplace.Should().Be("Chipfind");
        history.IsAmbiguous.Should().BeTrue();
        history.AdvertisementDate.Should().Be(October1);
        history.Contact.Should().Be("seller@example.com");
    }

    [Test]
    public void Create_WhenContactIsBlank_StoresNoContact()
    {
        var history = CreateHistory(October1, contact: "  ");

        history.Contact.Should().BeNull();
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Stored advertisement date never moves backwards", "A newer advertisement moves the date forward")]
    public void UpdateForNewAdvertisement_NewerAdvertisement_UpdatesLinkDateAmbiguityAndName()
    {
        var history = CreateHistory(October1, contact: null);

        history.UpdateForNewAdvertisement(
            link: "http://example.com/2",
            advertisementDate: October15,
            isAmbiguous: true,
            sellerName: "New Name",
            contact: "seller@example.com");

        history.Link.Should().Be("http://example.com/2");
        history.AdvertisementDate.Should().Be(October15);
        history.IsAmbiguous.Should().BeTrue();
        history.SellerName.Should().Be("New Name");
        history.Contact.Should().Be("seller@example.com");
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Stored advertisement date never moves backwards", "An older advertisement does not move the date back")]
    public void UpdateForNewAdvertisement_OlderAdvertisement_KeepsLinkDateAmbiguityAndName()
    {
        var history = CreateHistory(October15, contact: null);

        history.UpdateForNewAdvertisement(
            link: "http://example.com/old",
            advertisementDate: June20,
            isAmbiguous: true,
            sellerName: "Old Name",
            contact: "seller@example.com");

        history.Link.Should().Be("http://example.com/1");
        history.AdvertisementDate.Should().Be(October15);
        history.IsAmbiguous.Should().BeFalse();
        history.SellerName.Should().Be("Seller Name");
        history.Contact.Should().Be("seller@example.com", "a contact belongs to the seller, not to one advertisement");
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Seller contact is kept when a later sighting has none", "Sighting without a contact keeps the stored one")]
    public void UpdateForNewAdvertisement_WhenContactIsBlank_DoesNotOverwriteExistingContact()
    {
        var history = CreateHistory(October1, contact: "seller@example.com");

        history.UpdateForNewAdvertisement(
            link: "http://example.com/2",
            advertisementDate: October15,
            isAmbiguous: false,
            sellerName: "Seller Name",
            contact: null);

        history.Contact.Should().Be("seller@example.com");
    }

    private static ProductEmailSendHistory CreateHistory(DateTimeOffset advertisementDate, string? contact) =>
        ProductEmailSendHistory.Create(
            productId: Guid.NewGuid(),
            sellerKey: "seller-key",
            sellerName: "Seller Name",
            link: "http://example.com/1",
            marketplace: "Chipfind",
            isAmbiguous: false,
            advertisementDate: advertisementDate,
            contact: contact);
}
