using Server.Domain.Exceptions;
using Server.Domain.Measurements;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(TubeWorkingPoint))]
public sealed class TubeWorkingPointTests
{
    [Test]
    public void Create_AcceptsSmallNegativeGridVoltageAndHalfWidth()
    {
        var productId = Guid.NewGuid();

        var workingPoint = TubeWorkingPoint.Create(
            productId: productId,
            anodeVoltage: 250,
            gridVoltage: -0.5,
            anodeVoltageHalfWidth: 0.2,
            gridVoltageHalfWidth: 0.2,
            nominalCurrent: 35);

        using (Assert.EnterMultipleScope())
        {
            Assert.That(workingPoint.Id, Is.EqualTo(productId));
            Assert.That(workingPoint.GridVoltage, Is.EqualTo(-0.5));
            Assert.That(workingPoint.AnodeVoltageHalfWidth, Is.EqualTo(0.2));
            Assert.That(workingPoint.GridVoltageHalfWidth, Is.EqualTo(0.2));
        }
    }

    [Test]
    public void Create_AcceptsBoundaryValue_OfPointZeroOne()
    {
        Assert.DoesNotThrow(() => TubeWorkingPoint.Create(
            productId: Guid.NewGuid(),
            anodeVoltage: 0.01,
            gridVoltage: -0.01,
            anodeVoltageHalfWidth: 0.01,
            gridVoltageHalfWidth: 0.01,
            nominalCurrent: 0.01));
    }

    [Test]
    public void Create_Throws_WhenValueIsBelowPointZeroOne()
    {
        Assert.Throws<DomainException>(() => TubeWorkingPoint.Create(
            productId: Guid.NewGuid(),
            anodeVoltage: 250,
            gridVoltage: -0.009,
            anodeVoltageHalfWidth: 0.009,
            gridVoltageHalfWidth: 0.2,
            nominalCurrent: 35));
    }
}