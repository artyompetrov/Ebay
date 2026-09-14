using Server.Domain.Measurements;
using Tests.Shared;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(Server.Domain.LotForSale.LotForSale))]
public sealed class LotForSaleTests
{
    [Test]
    [OpenSpecScenario("lot-for-sale-listing", "Lot-for-sale identifier format", "A 7-character id is accepted")]
    public void Create_AcceptsProvidedId()
    {
        var lot = Server.Domain.LotForSale.LotForSale.Create("ABCdef1", "lot", Guid.NewGuid(), ProductState.New, MeasurementState.Selling);

        Assert.That(lot.Id, Is.EqualTo("ABCdef1"));
    }

    [Test]
    [OpenSpecScenario("lot-for-sale-listing", "Lot-for-sale identifier format", "An id of the wrong length is rejected")]
    public void Create_Throws_WhenIdLengthIsInvalid()
    {
        Assert.Throws<ArgumentException>(() =>
            Server.Domain.LotForSale.LotForSale.Create("short", "lot", Guid.NewGuid(), ProductState.New, MeasurementState.Selling));
    }
}