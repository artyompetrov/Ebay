using Server.Domain.Measurements;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(Server.Domain.LotForSale.LotForSale))]
public sealed class LotForSaleTests
{
    [Test]
    public void Create_AcceptsProvidedId()
    {
        var lot = Server.Domain.LotForSale.LotForSale.Create("ABCdef1", "lot", Guid.NewGuid(), ProductState.New, MeasurementState.Selling);

        Assert.That(lot.Id, Is.EqualTo("ABCdef1"));
    }

    [Test]
    public void Create_Throws_WhenIdLengthIsInvalid()
    {
        Assert.Throws<ArgumentException>(() =>
            Server.Domain.LotForSale.LotForSale.Create("short", "lot", Guid.NewGuid(), ProductState.New, MeasurementState.Selling));
    }
}
