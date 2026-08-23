using Microsoft.Extensions.DependencyInjection;
using Server.Application.New;
using Server.Application.New.LotForSale;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ServiceCollectionExtensions))]
public sealed class ApplicationNewServiceCollectionExtensionsTests
{
    [Test]
    public void AddApplicationNewServices_RegistersLotForSaleIdGenerator_AsSingleton()
    {
        var services = new ServiceCollection();

        services.AddApplicationNewServices();

        var descriptor = services.Single(x => x.ServiceType == typeof(ILotForSaleIdGenerator));

        Assert.That(descriptor.Lifetime, Is.EqualTo(ServiceLifetime.Singleton));
    }
}